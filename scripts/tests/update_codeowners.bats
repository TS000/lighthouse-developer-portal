#!/usr/bin bats
# shellcheck shell=bash

setup() {
    load 'test-helper/common-setup'
    _common_setup
    export PLUGIN_DIR="/plugins/plugin-name/"
    export TEAM_NAME="team-name"
    export backup_path="/tmp/codeownerstest.d"
    mkdir -p /tmp/codeownerstest.d
    cp -f CODEOWNERS /tmp/codeownerstest.d
}

_clean_up() {
    cp -f /tmp/codeownerstest.d/CODEOWNERS CODEOWNERS
}

source_profile_script() {
    source ./scripts/update_codeowners.sh "${TEAM_NAME}" "${PLUGIN_DIR}"
}

@test "can run script" {
    source_profile_script
    run _clean_up
}

@test ".run_main can handle malformed PLUGIN_DIR" {
    local plugin_dir="/plugins/plugins-name"
    source_profile_script
    run run_main "${TEAM_NAME}" "${plugin_dir}" "CODEOWNERS"
    assert_success
    run _clean_up
}

@test ".check_required_environment requires PLUGIN_DIR environment variable" {
    unset PLUGIN_DIR
    assert_empty "${PLUGIN_DIR}"
    source_profile_script
    run check_required_environment
    assert_failure
    assert_output --partial "PLUGIN_DIR"
    run _clean_up
}

@test ".check_required_environment requires TEAM_NAME environment variable" {
    unset TEAM_NAME
    assert_empty "${TEAM_NAME}"
    source_profile_script
    run check_required_environment
    assert_failure
    assert_output --partial "TEAM_NAME"
    run _clean_up
}

@test ".validate_plugin_path aborts script when PLUGIN_DIR does not begin with '/plugins/'" {
    local plugin_dir="/notplugins/plugins-name/"
    source_profile_script
    run validate_plugin_path "${plugin_dir}"
    assert_output --partial "Error: Teams can only become"
    assert_failure
    run _clean_up
}

@test ".validate_plugin_path aborts script when PLUGIN_DIR does not end with a '/'" {
    local plugin_dir="/plugins/plugins-name"
    source_profile_script
    run validate_plugin_path "${plugin_dir}"
    assert_output --partial "Error"
    assert_failure
    run _clean_up
}

@test ".validate_plugin_path continues script when PLUGIN_DIR is valid" {
    local plugin_dir="/plugins/plugins-name/"
    source_profile_script
    run validate_plugin_path "${plugin_dir}"
    assert_success
    run _clean_up
}

@test ".validate_team_name aborts script when TEAM_NAME is not valid format" {
    local team_name="some-other-org/team-name"
    source_profile_script
    run validate_team_name "${team_name}"
    assert_output --partial "Error: "
    assert_failure
    run _clean_up
}

@test ".validate_team_name aborts script when TEAM_NAME does not contain @department-of-veterans-affairs" {
    local team_name="@some-other-org/team-name"
    source_profile_script
    run validate_team_name "${team_name}"
    assert_output --partial "Error: "
    assert_failure
    run _clean_up
}

@test ".validate_team_name continues script when TEAM_NAME is valid" {
    local team_name="@some-other-org/team-name"
    source_profile_script
    run validate_team_name "${team_name}"
    assert_output --partial "Error: "
    assert_failure
    run _clean_up
}