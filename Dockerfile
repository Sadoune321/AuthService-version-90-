FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build   # ← ajoute cette ligne !

CMD ["node", "dist/main.js"]