FROM nginx:latest

COPY web/default.conf /etc/nginx/conf.d/default.conf
COPY backend/staticfiles/ /var/www/static

EXPOSE 80:80
