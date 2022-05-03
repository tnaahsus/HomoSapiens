FROM node:17-alpine
RUN mkdir "frontend"

WORKDIR frontend

COPY package.json .

RUN npm config rm proxy && npm config rm htttps proxy
RUN npm install

COPY . .

RUN npm run build