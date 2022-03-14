#!/bin/bash

set -eou pipefail

PG_USER=${1}
SRC=${2}
DEST=${3}
BASE_PATH=${4}
RESET_USER=""
RESET_SRC=""
RESET_PATH=""
RESET_DB=""

_raise() { echo "${1}" >&2; }

# Runs when the program exits; if exit code=1 it resets the destination(or target) db
clean_up() {
    exit_status="${1:-$?}"
    echo "Exit status: ${exit_status}"
    if [ "${exit_status}" == "1" ]; then
        echo "Restoring backup file..."
        reset_db &
        tail --pid=$! -f /dev/null
    fi
    exit "${exit_status}"
}

# Set up variables for resetting db in case of error
setup_reset() {
    local pg_user="${1}"
    local src="${2}"
    local backup_dir="${3}"
    local db_name="${4}"
    RESET_USER="${pg_user}"
    RESET_SRC="${src}"
    RESET_PATH="${backup_dir}"
    RESET_DB="${db_name}"
}

# Raises error if missing env variables
check_required_environment() {
    local required_env="PG_USER SRC DEST"

    for reqvar in $required_env; do
        if [ -z "${!reqvar}" ]; then
        _raise "missing ENVIRONMENT VARIABLE ${reqvar}"
        return 1
        fi
    done
}

# Sets kubernetes namespace
set_namespace() {
    src="${1}"
    local src_env
    src_env=$(echo "${src}" | tr '[:upper:]' '[:lower:]')
    case "${src_env}" in
        qa | dev ) # QA and Dev share namespace so just use 'lighthouse-bandicoot-dev'
        src_env="dev"
        ;;
        sandbox )
        src_env="sandbox"
        ;;
        *)
        exit 1
        ;;
    esac
    kubectl config set-context --current --namespace="lighthouse-bandicoot-${src_env}"
}

# Returns name of postgres pod
get_pod_name() {
    src="${1}"
    src_env=$(echo "${src}" | tr '[:upper:]' '[:lower:]')
    cmd=$(kubectl get pods | grep "${src_env}.*postgres" | awk '{print $1; exit}')
    echo "${cmd}"
}

# Creates a .sql script file that psql CLI can run to restore the database
pg_dump() {
    pg_user="${1}"
    src="${2}"
    parent_dir="${3}"
    db_name="${4}"
    args="${5}"
    set_namespace "${src}"
    pod_name=$(get_pod_name "${src}")
    mkdir -p "${BASE_PATH}/${parent_dir}"
    kubectl exec "$pod_name" -- bash -c "pg_dump -U ${pg_user} -d ${db_name} ${args}" > "${parent_dir}/db_${db_name}.sql"
}

# Uses psql to restore the database using the .sql file created from pg_dump
pg_restore() {
    pg_user="${1}"
    dest="${2}"
    parent_dir="${3}"
    db_name="${4}"
    set_namespace "${dest}"
    pod_name=$(get_pod_name "${dest}")
    kubectl exec -i "${pod_name}" -- psql -U ${pg_user} -d ${db_name} -q < "${parent_dir}/db_${db_name}.sql"
}

# Creates .sql file to restore the destination(or target) db
back_up_db(){
    local backup_args="-c --if-exists"
    mkdir -p "${BASE_PATH}/${RESET_PATH}"
    pg_dump "${RESET_USER}" "${RESET_SRC}" "${RESET_PATH}" "${RESET_DB}" "${backup_args}" &
    wait $!
}

# Passes arguments to reset destination(or target) db to pg_restore()
reset_db() {
    pg_restore "${RESET_USER}" "${RESET_SRC}" "${RESET_PATH}" "${RESET_DB}"
}

# Removes duplicate catalog entities
prune_db() {
    pg_user="${1}"
    dest="${2}"
    parent_dir="${3}"
    db_name="${4}"
    set_namespace "${dest}"
    pod_name=$(get_pod_name "${dest}")
    kubectl exec -i "${pod_name}" -- psql -U ${pg_user} -d ${db_name} < "${BASE_PATH}/scripts/prune_db.sql"
}

run_main() {
    pg_user="${1}"
    env_src="${2}"
    dest="${3}"
    local args="-a --column-inserts --on-conflict-do-nothing"
    local backup_dir="${BASE_PATH}/gha-tmp/pg_backup.d"
    local tmp_dir="${BASE_PATH}/gha-tmp/pg_db.d"
    local db_name="backstage_plugin_catalog"
    mkdir -p "${backup_dir}"
    mkdir -p "${tmp_dir}"

    trap clean_up EXIT
    setup_reset "${pg_user}" "${dest}" "${backup_dir}" "${db_name}" || exit 1
    back_up_db  || exit 1
    check_required_environment "${pg_user} ${env_src} ${dest}" || exit 1
    pg_dump "${pg_user}" "${env_src}" "${tmp_dir}" "${db_name}" "${args}" || exit 1
    pg_restore "${pg_user}" "${dest}" "${tmp_dir}" "${db_name}" || exit 1
    prune_db "${pg_user}" "${dest}" "${tmp_dir}" "${db_name}" || exit 1
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]
then
  run_main "${PG_USER}" "${SRC}" "${DEST}"
fi