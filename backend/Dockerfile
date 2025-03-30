FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production
ENV PORT=8240

EXPOSE 8240

CMD ["node", "src/index.js"]