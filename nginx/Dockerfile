FROM nginx:alpine

RUN rm /etc/nginx/conf.d/*

COPY conf/* /etc/nginx/conf.d/
COPY snippets/* /etc/nginx/snippets/

# CMD ["sleep", "infinity"]
