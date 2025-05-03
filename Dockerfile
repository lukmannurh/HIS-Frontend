# Stage 1: build React
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: serve via Nginx
FROM nginx:alpine
# salin hasil build
COPY --from=builder /app/build /usr/share/nginx/html
# salin config Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
