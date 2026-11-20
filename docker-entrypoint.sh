#!/bin/sh
set -e

# Configure Apache port only when running the web server
if [ "$1" = "apache2-foreground" ]; then
    PORT=${PORT:-80}
    sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
    sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf
fi

# Run migrations + seed on every deploy
php artisan migrate --force --seed

# Create the public storage symlink
php artisan storage:link --force

# Cache config/routes/views for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
