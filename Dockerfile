FROM node:10-alpine
EXPOSE 8080
WORKDIR /backend
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++
COPY package.json /backend/
COPY yarn.lock /backend/
RUN yarn install && apk del .gyp
COPY migrations /backend/seeds
COPY seeds /backend/seeds
COPY src /backend/src
COPY knexfile.ts /backend/
COPY tsconfig.json /backend/
COPY nodemon.json /backend/
RUN node_modules/.bin/ts-node -v
RUN node_modules/.bin/tsc --version
CMD [ "yarn", "start" ]