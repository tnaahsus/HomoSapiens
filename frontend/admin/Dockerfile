FROM node:17-alpine
RUN mkdir "frontend"

WORKDIR frontend

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build