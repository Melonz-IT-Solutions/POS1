#!/bin/sh
set -e

# Render injects PORT; fall back to 80 for local use
PORT=${PORT:-80}

# Make Apache listen on the correct port
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# Run migrations and seed on every deploy (safe with --force in production)
php artisan migrate --force --seed

# Cache config/routes for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
