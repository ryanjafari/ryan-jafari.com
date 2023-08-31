# Official devcontainer multipurpose base image
FROM mcr.microsoft.com/devcontainers/universal

# Install essential packages and cwebp
RUN apt-get update && apt-get install -y \
    build-essential \
    webp \
    && rm -rf /var/lib/apt/lists/*
