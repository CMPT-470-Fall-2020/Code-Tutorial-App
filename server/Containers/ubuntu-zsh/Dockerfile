FROM 470-ubuntu-base

RUN mkdir -p /app
RUN mkdir -p /home

RUN pwd
RUN apt-get update && apt-get -y install zsh

WORKDIR /app

COPY . /app

RUN ls -a

WORKDIR /home
RUN pwd

EXPOSE 5000

ENTRYPOINT [ "node", "/app/zsh-server.js", "5000" ]



