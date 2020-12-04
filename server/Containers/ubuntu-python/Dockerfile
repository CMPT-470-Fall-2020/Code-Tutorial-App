FROM 470-ubuntu-base

RUN mkdir -p /app
RUN mkdir -p /home

RUN pwd
RUN apt-get update && apt-get -y install python3

WORKDIR /app

COPY . /app

RUN ls -a

WORKDIR /home
RUN pwd

EXPOSE 5000

ENTRYPOINT [ "python3", "/app/python-server.py", "5000" ]



