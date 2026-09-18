FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY public ./public

ARG GIT_SHA=unknown
ARG GIT_DATE=unknown
ENV GIT_SHA=$GIT_SHA
ENV GIT_DATE=$GIT_DATE
ENV NODE_ENV=production
EXPOSE 3141

CMD ["node", "server.js"]
