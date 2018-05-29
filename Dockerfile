FROM node:9-slim
EXPOSE 8080
COPY . .
RUN yarn
CMD [ "yarn", "start" ]