#!/usr/bin/bash

# Remove all existing images if they exist.
# If they don't exist, this command will spit out an error but its ok.
docker image rm 470-ubuntu-base
docker image rm 470-ubuntu-bash
docker image rm 470-ubuntu-zsh
docker image rm 470-ubuntu-julia
docker image rm 470-ubuntu-python

# Build the base container used to support all other language containers
echo "Building base ubuntu container"
cd ./basic-ubuntu
docker build -t 470-ubuntu-base .

# Build the base container for bash
echo "Building base bash container"
cd ../ubuntu-bash
# Some linux distros alias cp to "cp -i". This causes issues with the script
# since it will ask for permission before overwritting any existing files overwrite.
/usr/bin/cp ../../bash-server.js ./
/usr/bin/cp ../../generic_server.js ./
docker build -t 470-ubuntu-bash .


# Build the base container for bash
echo "Building base zsh container"
cd ../ubuntu-zsh
# Some linux distros alias cp to "cp -i". This causes issues with the script
# since it will ask for permission before overwritting any existing files overwrite.
/usr/bin/cp ../../zsh-server.js ./
/usr/bin/cp ../../generic_server.js ./
docker build -t 470-ubuntu-zsh .

# Build the base container for bash
echo "Building base julia container"
cd ../ubuntu-julia
# Some linux distros alias cp to "cp -i". This causes issues with the script
# since it will ask for permission before overwritting any existing files overwrite.
/usr/bin/cp ../../julia-server.js ./
/usr/bin/cp ../../generic_server.js ./
docker build -t 470-ubuntu-julia .


# Build the base container for bash
echo "Building base python container"
cd ../ubuntu-python
# Some linux distros alias cp to "cp -i". This causes issues with the script
# since it will ask for permission before overwritting any existing files overwrite.
/usr/bin/cp ../../python-server.py ./
docker build -t 470-ubuntu-python .