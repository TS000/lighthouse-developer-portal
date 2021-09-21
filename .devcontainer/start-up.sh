#!/bin/bash
oryx build -p virtualenv_name=.venv --log-file /tmp/oryx-build.log --manifest-dir /tmp || echo 'Could not auto-build. Skipping.'
pip install pre-commit && pre-commit install && pre-commit