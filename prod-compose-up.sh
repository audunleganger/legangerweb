docker container prune -f
docker image prune -f
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
