FROM alpine:3.5
FROM node:8-slim
RUN mkdir /src
WORKDIR /src
ADD . /src/
RUN yarn