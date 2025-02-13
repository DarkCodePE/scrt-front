# Etapa de dependencias
FROM node:18-alpine AS deps

WORKDIR /app

# Instalar dependencias necesarias para compilación
RUN apk add --no-cache libc6-compat

# Copiar archivos de configuración
COPY package.json package-lock.json ./
COPY next.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./

# Instalar dependencias
RUN npm ci

# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependencias y archivos de configuración
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/next.config.ts ./
COPY --from=deps /app/tsconfig.json ./
COPY --from=deps /app/tailwind.config.ts ./
COPY --from=deps /app/postcss.config.mjs ./

# Copiar código fuente
COPY src ./src
COPY public ./public

# Variables de entorno para la construcción
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Crear usuario no root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

# Ajustar permisos
RUN chown -R nextjs:nodejs /app

# Cambiar al usuario no root
USER nextjs

# Exponer puerto
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]