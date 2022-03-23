#!/bin/bash
set -e

usage() {
  echo
  echo "$0 [-e] [-n] [-p] [-u]"
  echo "-e    <dev|qa|sandbox|prod> environment"
  echo "-n    name of auth secret, e.g. lhdp-service-account-email"
  echo "-p    password"
  echo "-u    username"
  echo
  exit 0
}

if [ -z "$1" ]; then usage; fi

while getopts ":he:n:p:u:" opt; do
  case $opt in
    e) env=$OPTARG >&2;;
    h) usage;;
    n) secret_name=$OPTARG >&2;;
    p) pwd=$OPTARG >&2;;
    u) uname=$OPTARG >&2;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1;;
  esac
done

if [ -z "$env" ] || [ -z "$secret_name" ] || [ -z "$pwd" ] || [ -z "$uname" ]; then
  echo 'Missing -e, -n, -p, or -u' >&2
  exit 1
fi

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: $secret_name
  namespace: lighthouse-bandicoot-${env}
type: kubernetes.io/basic-auth
stringData:
  username: $uname
  password: $pwd
EOF
