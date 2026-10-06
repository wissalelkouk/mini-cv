FROM nginx:alpine
COPY index.html style.css script.js photo.jpg /usr/share/nginx/html/
EXPOSE 80
