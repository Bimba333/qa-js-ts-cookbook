# Образ сервиса прогресса.
#
# Сборка и запуск разделены так же, как у учебного стенда: в рабочий образ
# не попадают ни TypeScript, ни dev-зависимости.

FROM node:22.23.1-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY platform ./platform
RUN npx tsc -p platform/tsconfig.json

FROM node:22.23.1-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/.platform-build ./.platform-build

USER node

EXPOSE 4320

CMD ["node", ".platform-build/src/main.js"]
