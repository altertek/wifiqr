FROM mhart/alpine-node:16 as builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY . .

RUN npm ci --prod

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
