FROM node:20-alpine

#ENV NODE_ENV production

RUN apk add --no-cache python3 make g++
RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

COPY --chown=node:node front/package.json front/yarn.lock ./
RUN yarn install
#RUN yarn install --prod --frozen-lockfile

COPY --chown=node:node ./front/public ./public
COPY --chown=node:node ./front/src ./src
COPY --chown=node:node ./front/tsconfig.json ./tsconfig.json
COPY --chown=node:node ./front/next-env.d.ts ./next-env.d.ts

RUN yarn build

USER node
EXPOSE 3000


CMD ["yarn", "start"]
#CMD ["node", "index.js"]