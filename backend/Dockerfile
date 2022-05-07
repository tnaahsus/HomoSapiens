FROM golang:1.18beta1-alpine3.15 AS exe-build

RUN mkdir -p "backend"

WORKDIR backend

COPY . .

RUN go mod download

RUN go build .

FROM alpine:3.15

RUN mkdir -p src/.cockroach && chmod -R 777 /src

WORKDIR src

COPY --from=exe-build /go/backend/blog-site .

COPY --from=exe-build /go/backend/.env .

COPY --from=exe-build /go/backend/config.json .

EXPOSE 9000

CMD ["./blog-site"]