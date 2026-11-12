.PHONY: help build up down restart logs shell mysql redis artisan migrate seed fresh test lint

help:
	@echo "POS System - Docker Commands"
	@echo ""
	@echo "  make build      Build Docker images"
	@echo "  make up         Start all containers"
	@echo "  make dev        Start with Vite dev server (node profile)"
	@echo "  make down       Stop all containers"
	@echo "  make restart    Restart all containers"
	@echo "  make logs       Follow container logs"
	@echo "  make shell      Open shell in app container"
	@echo "  make mysql      Open MySQL CLI"
	@echo "  make artisan    Run artisan command (make artisan CMD='...')"
	@echo "  make migrate    Run migrations"
	@echo "  make seed       Run all seeders"
	@echo "  make fresh      Fresh migrate + seed"
	@echo "  make test       Run test suite"
	@echo "  make lint       Run PHP linter (pint)"
	@echo "  make setup      First-time setup"

build:
	docker compose build

up:
	docker compose up -d

dev:
	docker compose --profile dev up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

shell:
	docker compose exec app bash

mysql:
	docker compose exec mysql mysql -u $${DB_USERNAME:-pos_user} -p$${DB_PASSWORD:-pos_secret} $${DB_DATABASE:-pos1}

redis:
	docker compose exec redis redis-cli

artisan:
	docker compose exec app php artisan $(CMD)

migrate:
	docker compose exec app php artisan migrate

seed:
	docker compose exec app php artisan db:seed

fresh:
	docker compose exec app php artisan migrate:fresh --seed

test:
	docker compose exec app php artisan test

lint:
	docker compose exec app ./vendor/bin/pint

setup:
	cp -n .env.example .env || true
	docker compose build
	docker compose up -d
	@echo "Waiting for MySQL to be ready..."
	@sleep 10
	docker compose exec app composer install
	docker compose exec app php artisan key:generate
	docker compose exec app php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
	docker compose exec app php artisan migrate --seed
	npm install
	npm run build
	@echo ""
	@echo "Setup complete! Open http://localhost:8000"
	@echo "Admin: admin@pos.com / password"
