FROM node:22

WORKDIR /app

COPY package*.json ./

# Upgrade npm to latest
RUN npm install -g npm@latest

# Force registry and install
RUN npm config set registry https://registry.npmjs.org/ && npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]
