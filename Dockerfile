FROM node:20-alpine

WORKDIR /apps
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .
RUN npm run build

RUN rm -rf src tsconfig.json

EXPOSE 18310
CMD [ "npm","start" ]