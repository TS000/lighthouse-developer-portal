assert_empty(){
  assert [ -z "${1}" ]
}
refute_empty(){
  assert [ ! -z "${1}" ]
}
assert_file_exists() {
  assert [ -f "${1}" ]
}
assert_file_does_not_exist() {
  assert [ ! -f "${1}" ]
}