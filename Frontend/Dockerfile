# NOTE: build context for this image is the repository root (see docker-compose.yml),
# so that the nginx config in infra/nginx/ can be copied into the final stage.

# ---- Stage 1: install deps and build the Vite app --------------------------
FROM node:22-alpine AS build

WORKDIR /app

COPY Frontend/package.json Frontend/pnpm-lock.yaml ./

RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY Frontend/. .

RUN pnpm run build

# ---- Stage 2: serve the static build with Nginx -----------------------------
FROM nginx:1.29-alpine

COPY infra/nginx/frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
