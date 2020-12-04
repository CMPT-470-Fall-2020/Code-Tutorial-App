#!/usr/bin/bash

echo "Deleting all images"
docker image rm 470-ubuntu-base
docker image rm 470-ubuntu-bash
docker image rm 470-ubuntu-zsh
docker image rm 470-ubuntu-julia
docker image rm 470-ubuntu-python

