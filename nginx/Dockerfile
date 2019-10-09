FROM nginx:latest
EXPOSE 80 443
RUN rm /etc/nginx/conf.d/default.conf
COPY settings/nginx.conf /etc/nginx/nginx.conf
COPY settings/html /usr/share/nginx/html
COPY settings/conf.d /etc/nginx/conf.d
COPY settings/cert /etc/nginx/cert