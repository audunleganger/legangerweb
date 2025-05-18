docker run -d \
	--name minecraft-java-server \
	-p 6004:6004 \
	-p 6004:6004/udp \
	-e EULA=TRUE \
	-e VIEW_DISTANCE=16 \
	-e DIFFICULTY=hard \
	-e TZ=Europe/Oslo \
	-e SERVER_PORT=6004 \
	-e LEVEL=Midgard \
	-v $(pwd)/data:/data \
	--tty \
	--interactive \
	--restart unless-stopped \
	itzg/minecraft-server
