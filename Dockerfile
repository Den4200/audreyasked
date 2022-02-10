##### Build Image #####
FROM node:16 AS builder

WORKDIR /audreyasked

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY prisma .
RUN npx prisma generate

COPY . .
RUN yarn build

##### Runtime Image #####
FROM node:16

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /audreyasked/prisma ./prisma
COPY --from=builder /audreyasked/public ./public
COPY --from=builder /audreyasked/dist ./dist
COPY --from=builder /audreyasked/next.config.js ./next.config.js
COPY --from=builder /audreyasked/.next/ ./.next
COPY --from=builder /audreyasked/node_modules/ ./node_modules
COPY --from=builder /audreyasked/package.json/ ./package.json

CMD ["sh", "-c",  "npx prisma migrate deploy && yarn start"]
