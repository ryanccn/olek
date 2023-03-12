FROM docker.io/library/node:19-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
RUN yarn build
COPY . .
CMD [ "yarn", "start" ]