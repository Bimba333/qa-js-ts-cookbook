# Образ учебного SUT.
#
# Сборка и запуск разделены: в финальный образ не попадают ни TypeScript,
# ни dev-зависимости, ни исходники тестов.

FROM node:22.23.1-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY sut ./sut
RUN npx tsc -p sut/tsconfig.json

FROM node:22.23.1-bookworm-slim AS runtime

ENV NODE_ENV=production \
    SUT_MODE=educational

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Скомпилированный код и данные, которые читаются во время выполнения.
COPY --from=build /app/.sut-build ./.sut-build
COPY sut/migrations ./sut/migrations
COPY sut/contracts ./sut/contracts

USER node

EXPOSE 4310 4311

CMD ["node", ".sut-build/src/main.js"]
