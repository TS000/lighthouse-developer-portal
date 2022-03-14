#!/usr/bin bats
# shellcheck shell=bash

setup() {
    load 'test-helper/common-setup'
    _common_setup
    export PG_USER="postgres"
    export SRC="sandbox"
    export DEST="sandbox"
    export BASE_PATH="/tmp/pg_test/"
    mkdir -p /tmp/pg_test/pg_backup.d/
    mkdir -p /tmp/pg_test/src
    mkdir -p /tmp/pg_test/dest
    echo "SOURCE PG_DUMP" > /tmp/pg_test/src/pg_dump.sql
    echo "DEST PG_DUMP" > /tmp/pg_test/dest/pg_dump.sql
    export KUBECONFIG=$KUBECONFIG:$HOME/.kube/config
    kubectl config set-context --current --namespace=lighthouse-bandicoot-sandbox
}

_clean_up() {
    rm -r /tmp/pg_test
}

source_profile_script() {
    source ./scripts/migrate_db.sh "${PG_USER}" "${SRC}" "${DEST}" "$BASE_PATH"
}

@test "can run script" {
    source_profile_script
    run _clean_up
}

@test ".check_required_environment requires PG_USER environment variable" {
    unset PG_USER
    assert_empty "${PG_USER}"
    source_profile_script
    run check_required_environment "${PG_USER}" "${SRC}" "${DEST}"
    assert_failure
    assert_output --partial "PG_USER"
    run _clean_up
}

@test ".check_required_environment requires SRC environment variable" {
    unset SRC
    assert_empty "${SRC}"
    source_profile_script
    run check_required_environment "${PG_USER}" "${SRC}" "${DEST}"
    assert_failure
    assert_output --partial "SRC"
    run _clean_up
}

@test ".check_required_environment requires DEST environment variable" {
    unset DEST
    assert_empty "${DEST}"
    source_profile_script
    run check_required_environment "${PG_USER}" "${SRC}" "${DEST}"
    assert_failure
    assert_output --partial "DEST"
    run _clean_up
}

@test ".get_pod_name returns a sandbox pod with sandbox args" {
    source_profile_script
    run get_pod_name "${SRC}"
    assert_output --regexp "^sandbox-postgres-[a-z0-9]+-[a-z0-9]+"
    run _clean_up
}

@test ".pg_dump creates a pg_dump from SANDBOX with src args" {
    local parent_dir="/tmp/pg_test"
    local db_name="backstage_plugin_catalog"
    local src_args="-a --column-inserts --on-conflict-do-nothing"
    assert_file_does_not_exist "${parent_dir}/db_${db_name}.sql"
    source_profile_script
    run pg_dump "${PG_USER}" "${SRC}" "${parent_dir}" "${db_name}" "${src_args}"
    assert_file_exists "${parent_dir}/db_${db_name}.sql"
    run _clean_up
    assert_file_does_not_exist "${parent_dir}/db_${db_name}.sql"
}

@test ".pg_dump creates a pg_dump from SANDBOX with backup args" {
    local parent_dir="/tmp/pg_test"
    local db_name="backstage_plugin_catalog"
    local backup_args="-c --if-exists"
    assert_file_does_not_exist "${parent_dir}/db_${db_name}.sql"
    source_profile_script
    run pg_dump "${PG_USER}" "${SRC}" "${parent_dir}" "${db_name}" "${backup_args}"
    assert_file_exists "${parent_dir}/db_${db_name}.sql"
}

@test ".pg_restore updates SANDBOX DB using db file and pg_restore" {
    local parent_dir="/tmp/pg_test"
    local db_name="backstage_plugin_catalog"
    assert_file_exists "${parent_dir}/db_${db_name}.sql"
    source_profile_script
    run pg_restore "${PG_USER}" "${SRC}" "${parent_dir}" "${db_name}"
    assert_output --partial "set_config"
    run _clean_up
}