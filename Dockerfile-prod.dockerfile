FROM node:10-alpine

ENV NODE_ENV=production

WORKDIR /backend

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        git

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && apk del .gyp

COPY knexfile.ts tsconfig.json tslint.json nodemon.json ./
COPY migrations ./migrations
COPY seeds ./seeds
COPY src ./src

RUN yarn build

CMD [ "node", "dist/src/index.js" ]