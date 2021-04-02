FROM 470-ubuntu-base

RUN mkdir -p /app
RUN mkdir -p /home

RUN pwd
RUN apt-get update && apt-get -y install julia

WORKDIR /app

COPY . /app

RUN ls -a

WORKDIR /home
RUN pwd

EXPOSE 5000

ENTRYPOINT [ "node", "/app/julia-server.js", "5000" ]



