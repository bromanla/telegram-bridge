#!/bin/bash

# Sequential assembly is required to avoid issues arising
# from internal package dependencies

build_workspace() {
  local package=$1
  npm run build --workspace=@bridge/$package
}

# libs
build_workspace "common"
build_workspace "bus"

# packages
build_workspace "contract"
build_workspace "head"
