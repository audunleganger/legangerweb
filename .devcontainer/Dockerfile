FROM alpine:latest

RUN apk add --no-cache bash

# Set bash as the default shell
SHELL ["/bin/bash", "-c"]

# Install dev tools and dependencies
RUN apk add --no-cache \
    nginx \
    curl \
    nodejs \
    npm \
    python3 \
    py3-pip \
    nano \
    vim \
    git \
    openssl \
    certbot \
    certbot-nginx \
    net-tools \
    docker

# Set working directory
WORKDIR /workspace
