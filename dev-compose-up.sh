docker container prune -f
docker image prune -f
docker compose --env-file .env.dev up -d
