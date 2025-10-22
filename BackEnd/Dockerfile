# 1. Use uma imagem base oficial do Node.js (versão LTS Alpine é leve e segura)
FROM node:18-alpine

# 2. Defina o diretório de trabalho dentro do container
WORKDIR /app

# 3. Copie os arquivos de dependência
COPY package.json package-lock.json ./

# 4. Instale as dependências
RUN npm install

# 5. Copie o restante do código da sua aplicação
COPY . .

# 6. Exponha a porta que sua API usa (ex: 3001)
EXPOSE 3001

# 7. O comando para iniciar sua aplicação
CMD ["npm", "start"]
# Ou, se não tiver um script "start": CMD ["node", "src/server.js"]