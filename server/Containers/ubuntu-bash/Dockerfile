FROM basic-ubuntu

RUN mkdir -p /app
RUN mkdir -p /home

RUN pwd

WORKDIR /app

COPY . /app

RUN ls -a

WORKDIR /home
RUN pwd

EXPOSE 5000

ENTRYPOINT [ "node", "/app/bash-server.js", "5000" ]



