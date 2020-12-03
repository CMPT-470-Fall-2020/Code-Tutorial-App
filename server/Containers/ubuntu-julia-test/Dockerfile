FROM 470-ubuntu-base

RUN mkdir -p /home

RUN apt-get update && apt-get -y install julia

WORKDIR /home
RUN pwd

CMD ["/bin/sh", "-c", "while true; do sleep 60; done"]
