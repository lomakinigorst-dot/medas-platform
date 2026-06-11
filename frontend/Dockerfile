FROM node:20-alpine AS builder
WORKDIR /app
# Use Taobao npm mirror for better connectivity from Russia/VPS
RUN npm config set registry https://registry.npmmirror.com
COPY package*.json ./
RUN npm install
COPY . .
RUN node_modules/.bin/next build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
