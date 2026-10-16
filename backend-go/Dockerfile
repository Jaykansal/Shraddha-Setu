# Multi-stage Dockerfile for ShraddhaSetu Golang Backend
FROM golang:1.22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git ca-certificates

COPY go.mod ./
RUN go mod download || true

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o shraddhasetu-server ./cmd/server

FROM alpine:latest
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /root/

COPY --from=builder /app/shraddhasetu-server .
COPY --from=builder /app/scripts ./scripts

EXPOSE 8080
CMD ["./shraddhasetu-server"]
