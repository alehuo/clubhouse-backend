FROM node:10-alpine
WORKDIR /backend
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        git
COPY package.json .
COPY yarn.lock .
RUN yarn install && apk del .gyp

COPY knexfile.ts .
COPY tsconfig.json .
COPY nodemon.json .
COPY migrations ./migrations
COPY seeds ./seeds
COPY src ./src

CMD [ "yarn", "start" ]