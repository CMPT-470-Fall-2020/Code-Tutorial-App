FROM ubuntu
RUN apt-get update && \
	apt-get -y install procps apt-utils curl git jq \ 
	perl cowsay sqlite silversearcher-ag cloc && \
	curl -sL https://deb.nodesource.com/setup_15.x | bash - && \
	apt-get install -y nodejs

