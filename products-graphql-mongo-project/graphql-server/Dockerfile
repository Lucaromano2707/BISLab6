FROM node:18

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Anwendungscode kopieren
COPY . .

EXPOSE 8081

# Server starten
CMD ["node", "product-service.js"]