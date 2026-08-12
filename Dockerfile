# Multi-stage Dockerfile for Next.js + FFmpeg Trampoline Video Annotator
FROM node:18-alpine AS base

# Install FFmpeg and dependencies
RUN apk add --no-cache ffmpeg curl

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATA_DIR="/app/Data"

CMD ["npm", "run", "start"]
