FROM node:20-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

FROM base AS dependencies
RUN yarn install --immutable

FROM dependencies AS build
COPY . .
RUN yarn build

FROM node:20-alpine AS release
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
