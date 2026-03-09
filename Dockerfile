# 1. Dependencias
FROM node:22-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2. Builder
FROM node:22-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG API_BASE_URL=https://dev.orcronics.com/api/v1
ENV API_BASE_URL=$API_BASE_URL
RUN yarn generate

# 3. Runner — solo Nginx sirviendo estáticos, sin Node
FROM nginx:alpine AS runner
COPY --from=builder /app/.output/public /usr/share/nginx/html
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80