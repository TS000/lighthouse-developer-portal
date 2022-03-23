#!/bin/bash
set -e

usage() {
  echo
  echo "$0 [-e] [-n] [-p] [-u]"
  echo "-e    <dev|qa|sandbox|prod> environment"
  echo "-k    key-value pair, i.e. foo=bar (pass as many of these as necessary)"
  echo "-n    name of auth secret, e.g. lhdp-service-account-email"
  echo
  exit 0
}

if [ -z "$1" ]; then usage; fi

key_value_literals=''

while getopts ":he:k:n:" opt; do
  case "$opt" in
    e) env=$OPTARG >&2;;
    h) usage;;
    k) key_value_literals="${key_value_literals} --from-literal=${OPTARG}" >&2;;
    n) secret_name=$OPTARG >&2;;
    \?)
      echo "Invalid option: -${OPTARG}" >&2
      exit 1;;
    :)
      echo "Option -${OPTARG} requires an argument." >&2
      exit 1;;
  esac
done

if [ -z "$env" ] || [ -z "$key_value_literals" ] || [ -z "$secret_name" ]; then
  echo 'Missing -e, -k, or -n' >&2
  exit 1
fi

kubectl create secret generic "$secret_name" \
  --namespace="lighthouse-bandicoot-${env}" \
  $key_value_literals \
  --dry-run=client -o yaml | kubectl apply -f -
