FROM mcr.microsoft.com/devcontainers/base:alpine-3.20

RUN apk update && apk add --no-cache \
	npm \
	bash \
	docker \
	docker-compose \
	&& rm -rf /var/cache/apk/*

CMD ["sleep", "infinity"]