#!/bin/bash
#
# Copyright (c) IBM Corporation 2025
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Run every test case file (tc_*.js) in this directory, one after another,
# each in its own node process, passing a JSON config file to the tests.
#
# Usage:
#   unittests/run_all.sh [config-file]
#
# config-file defaults to config.example.json in this directory.
#
# Exit code is 0 if every test file passed, 1 otherwise.

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
config="${1:-$dir/config.example.json}"

if [ ! -f "$config" ]; then
  echo "Config file not found: $config" >&2
  exit 1
fi
config="$(cd "$(dirname "$config")" && pwd)/$(basename "$config")"

shopt -s nullglob
files=("$dir"/tc_*.js)
if [ ${#files[@]} -eq 0 ]; then
  echo "No tc_*.js test files found in $dir" >&2
  exit 1
fi

echo "Using config: $config"

passed=0
failed=0
summary=()
for f in "${files[@]}"; do
  name="$(basename "$f")"
  echo
  echo "===== $name ====="
  # node:test runs the tests on load; common.js reads --config from argv
  if node "$f" --config "$config"; then
    passed=$((passed + 1))
    summary+=("PASS  $name")
  else
    failed=$((failed + 1))
    summary+=("FAIL  $name")
  fi
done

echo
echo "===== Summary ====="
printf '%s\n' "${summary[@]}"
echo
echo "$passed passed, $failed failed"

[ "$failed" -eq 0 ]
