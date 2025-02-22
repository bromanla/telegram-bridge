# Stage 1: Compilation of binary files
FROM denoland/deno:2.2.1 AS builder

WORKDIR /app
COPY . .

RUN deno task "compile:*"

# The final image for telegram
FROM debian:bullseye-slim AS telegram

WORKDIR /app
COPY --from=builder /app/bin/telegram .
COPY locales /app/locales

CMD ["/app/telegram"]

# The final image for vk
FROM debian:bullseye-slim AS vk

WORKDIR /app
COPY --from=builder /app/bin/vk .

CMD ["/app/vk"]

# Migration stage
FROM debian:bullseye-slim AS migrate

WORKDIR /app
COPY --from=builder /app/bin/migrate .

CMD ["/app/migrate"]
