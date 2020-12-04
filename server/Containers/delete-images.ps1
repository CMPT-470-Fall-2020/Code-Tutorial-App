Write-Host "Deleting all images"
docker image rm 470-ubuntu-base
docker image rm 470-ubuntu-bash
docker image rm 470-ubuntu-zsh
docker image rm 470-ubuntu-julia
docker image rm 470-ubuntu-python

docker image rm 470-ubuntu-python-autograder
docker image rm 470-ubuntu-bash-autograder
docker image rm 470-ubuntu-zsh-autograder
docker image rm 470-ubuntu-julia-autograder

