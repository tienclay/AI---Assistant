FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

RUN yarn build

#####

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

RUN yarn install --production

ENTRYPOINT ["node", "dist/src/main.js"]
