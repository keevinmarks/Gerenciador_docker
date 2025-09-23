# --- Estágio 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instala todas as dependências para conseguir buildar
RUN npm install

COPY . .

# Passa as variáveis de ambiente necessárias para o build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Desabilita telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Roda o script de build do Next.js
RUN npm run build

# --- Estágio 2: Produção ---
FROM node:18-alpine AS runner

WORKDIR /app

# Define o ambiente para produção, otimizando o Next.js
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copia os arquivos de dependência
COPY --from=builder /app/package.json ./package.json

# Instala APENAS as dependências de produção
RUN npm install --omit=dev

# Copia os arquivos de build do estágio anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# O Next.js por padrão usa a porta 3000
EXPOSE 3000

# O comando para iniciar o servidor de produção do Next.js
CMD ["npm", "start"]