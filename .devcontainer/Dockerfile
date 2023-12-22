# Official devcontainer JavaScript base image (v20.5.0)
# NOTE: `mcr.microsoft.com/devcontainers/typescript-node` is also available.
# TODO: Figure out how to remove `nvm`.
# TODO: Slim this image via `docker-slim`.
FROM mcr.microsoft.com/devcontainers/javascript-node:20-bookworm

# Install essential packages and cwebp.
RUN apt-get update && apt-get install -y \
  build-essential \
  webp \
  && rm -rf /var/lib/apt/lists/*

# Upgrade to a specific version of npm.
RUN npm install -g npm@10.0.0

# Upgrade to a specific version of pnpm.
RUN npm install -g pnpm@8.7.1

# TODO: Add pnpm install for the project? Test from a full rebuild.
# TODO: Pin version of oh-my-zsh and disable auto-update.
