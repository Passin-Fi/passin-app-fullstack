build:
	docker build -t ezsol-frontend:latest . && docker run -d --name ezsol-frontend -p 5555:3000  ezsol-frontend:latest