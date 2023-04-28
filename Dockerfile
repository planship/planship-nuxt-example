# Build image
#
# Image responsible for building the 'node_modules' dependency directory
# and making it available for COPY from other images.

FROM node:19-alpine as builder


RUN apk update && apk upgrade
RUN apk add git

RUN npm install -g pnpm@7

# RUN mkdir -p app

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc .

RUN pnpm install --frozen-lockfile

COPY app ./app

CMD ["pnpm", "run", "dev"]
