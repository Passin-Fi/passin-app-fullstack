# docker build -t ezsol-frontend:latest . && docker run -d --name ezsol-frontend -p 5555:3000  ezsol-frontend:latest
build:
	docker-compose up -d --build
app:
	docker-compose up -d --build app