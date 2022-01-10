##### Build Image #####
FROM node:latest AS builder

WORKDIR /audreyasked

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

##### Runtime Image #####
FROM node:latest

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /audreyasked/public ./public
COPY --from=builder /audreyasked/next.config.js ./next.config.js
COPY --from=builder /audreyasked/.next/ ./.next
COPY --from=builder /audreyasked/node_modules/ ./node_modules
COPY --from=builder /audreyasked/package.json/ ./package.json

CMD ["yarn", "start"]
