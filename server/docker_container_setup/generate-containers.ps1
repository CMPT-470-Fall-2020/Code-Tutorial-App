# Remove all existing images if they exist.
# If they don't exist, this command will spit out an error but its ok.
docker image rm 470-ubuntu-base
docker image rm 470-ubuntu-bash
docker image rm 470-ubuntu-zsh
docker image rm 470-ubuntu-julia
docker image rm 470-ubuntu-python

docker image rm 470-ubuntu-python-autograder
docker image rm 470-ubuntu-bash-autograder
docker image rm 470-ubuntu-zsh-autograder
docker image rm 470-ubuntu-julia-autograder

# Build the base container used to support all other language containers
Write-Host "Building base ubuntu container"
cd ./basic-ubuntu
docker build -t 470-ubuntu-base .

# Build the base container for bash
Write-Host "Building base bash container"
cd ../ubuntu-bash
# Some linux distros alias cp to "cp -i". This causes issues with the script
# since it will ask for permission before overwritting any existing files overwrite.
copy ../../language-servers/bash-server.js ./
copy ../../generic_server.js ./
docker build -t 470-ubuntu-bash .


# Build the base container for bash
Write-Host "Building base zsh container"
cd ../ubuntu-zsh
# Some linux distros alias cp to "cp -i". This causes issues with the script
# since it will ask for permission before overwritting any existing files overwrite.
copy ../../language-servers/zsh-server.js ./
copy ../../generic_server.js ./
docker build -t 470-ubuntu-zsh .

# Build the base container for bash
Write-Host "Building base julia container"
cd ../ubuntu-julia
# Some linux distros alias cp to "cp -i". This causes issues with the script
# since it will ask for permission before overwritting any existing files overwrite.
copy ../../language-servers/julia-server.js ./
copy ../../generic_server.js ./
docker build -t 470-ubuntu-julia .


# Build the base container for bash
Write-Host "Building base python container"
cd ../ubuntu-python
# Some linux distros alias cp to "cp -i". This causes issues with the script
# since it will ask for permission before overwritting any existing files overwrite.
copy ../../language-servers/python-server.py ./
docker build -t 470-ubuntu-python .



Write-Host "Building autograders now"
# Build the base container for python
Write-Host "Building base python container"
cd ../ubuntu-python-test
docker build -t 470-ubuntu-python-autograder .


# Build the base container for bash
Write-Host "Building base python container"
cd ../ubuntu-bash-test
docker build -t 470-ubuntu-bash-autograder .

# Build the base container for zsh
Write-Host "Building base python container"
cd ../ubuntu-zsh-test
docker build -t 470-ubuntu-zsh-autograder .

# Build the base container for julia
Write-Host "Building base python container"
cd ../ubuntu-julia-test
docker build -t 470-ubuntu-julia-autograder .
