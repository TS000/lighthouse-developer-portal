#!/bin/bash

set -eou pipefail

TEAM_NAME=${1}
PLUGIN_DIR=${2}

export CODEOWNERS_FILE="CODEOWNERS"

raise()
{
  echo "${1}" >&2
}

back_up_files(){
    codeowners="${1}"
    mkdir -p /tmp/codeowners.d
    cp -f "${codeowners}" /tmp/codeowners.d
}

clean_up() {
    exit_status="${1}"
    echo "Exit status: ${exit_status}"
    if [ "${exit_status}" == "1" ]; then
        echo "Restoring backup file..."
        cp /tmp/codeowners.d/"${CODEOWNERS_FILE}" "${CODEOWNERS_FILE}"
    fi
    rm -r /tmp/codeowners.d
    exit "${exit_status}"
}

check_required_environment() {
    local required_env="PLUGIN_DIR TEAM_NAME"

    for reqvar in $required_env; do
        if [ -z "${!reqvar}" ]; then
        raise "missing ENVIRONMENT VARIABLE ${reqvar}"
        return 1
        fi
    done
}

setup_plugin_path() {
    local plugin_dir="${1}"
    local plugin_path

    # Check parent directory is '/plugins
    if [[ "${plugin_dir}" == /plugins/* ]]; then
        plugin_path=$plugin_dir
    else
        plugin_path="/plugins/${plugin_dir}"
    fi
    if [ "${plugin_path: -1}" != "/" ]; then
        plugin_path+="/"
    fi
    echo "${plugin_path}"
}

setup_team_name() {
    local team_name="${1}"
    local org="@department-of-veterans-affairs/"
    echo "${org}${team_name}"
}

validate_plugin_path() {
    local plugin_path="${1}"
    # Check string only contains lowercase and hyphens
    regex="^\/[a-z]+\/[a-z\-]+\/$"
    if [[ ! $plugin_path =~ $regex ]]; then
        echo "Error: Please make sure the plugin name only contains lowercase characters and hyphens"
        clean_up "1"
    fi
    # Check plugin path begins with '/plugins'
    if [[ "${plugin_path}" != /plugins/* ]]; then
        echo "Error: Teams can only become Codeowners of plugins"
        clean_up "1"
    fi
    # Check last char is '/'
    if [ "${plugin_path: -1}" != "/" ]; then
        echo "Error: path to plugin must end with '/'"
        clean_up "1"
    fi
    # Check the plugin name is not already being used
    if grep -cw "${plugin_path}" "CODEOWNERS"; then
        echo "Error: plugin name already exists"
        clean_up "1"
    fi
}

validate_team_name() {
    local team_name="${1}"
    org="${team_name%/*}"
    regex="^[\@][a-zA-Z\-]+\/[a-zA-Z\-]+$"
    # Check team name format
    if [[ ! $team_name =~ $regex ]]; then
        echo "failed regex"
        echo -e "Error: Incorrect format for team name.\nPlease use '@org/team-name'"
        clean_up "1"
    fi
    # Check if team is from DoVA
    if [ "${org}" != "@department-of-veterans-affairs" ]; then
        echo "failed org"
        echo "Error: Teams from this organization are not allowed"
        clean_up "1"
    fi
}

append_codeowners() {
    local team_name="${1}"
    local plugin_dir="${2}"
    codeowners_file=${3}

    echo -en "\n${plugin_dir}\t${team_name}" >> "${codeowners_file}"
}

run_main() {
    team="${1}"
    plugin_dir="${2}"
    codeowners_file="${3}"
    local plugin_path
    local full_team_name

    back_up_files "${codeowners_file}" || exit 1
    check_required_environment "$plugin_dir $team" || exit 1
    full_team_name=$(setup_team_name "${team}")
    validate_team_name "${full_team_name}" || exit 1
    plugin_path=$(setup_plugin_path "${plugin_dir}")
    validate_plugin_path "${plugin_path}" || exit 1
    append_codeowners "${full_team_name}" "${plugin_path}" "${codeowners_file}" || exit 1
    clean_up "0"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]
then
  run_main "${TEAM_NAME}" "${PLUGIN_DIR}" "${CODEOWNERS_FILE}"
fi