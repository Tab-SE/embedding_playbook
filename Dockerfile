FROM node:22-alpine AS base

# ── Build stage ───────────────────────────────────────────────────────────────
# Only NEXT_PUBLIC_* vars are needed at build time (they get inlined by Next.js).
# All secrets (API keys, JWT secrets, etc.) are injected at runtime by Railway
# and never baked into the image.
FROM base AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build-time public vars — these are the only ones Next.js needs during `next build`
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_ANALYTICS_DOMAIN
ARG NEXT_PUBLIC_ANALYTICS_SITE
ARG NEXT_PUBLIC_ANALYTICS_DOMAIN_EACANADA
ARG NEXT_PUBLIC_ANALYTICS_SITE_EACANADA
ARG NEXT_PUBLIC_ANALYTICS_DOMAIN_UBL
ARG NEXT_PUBLIC_ANALYTICS_SITE_UBL
ARG NEXT_PUBLIC_ANALYTICS_AGENT_ID
ARG NEXT_PUBLIC_CHAT_API
ARG NEXT_PUBLIC_SALESFORCE_ORG_URL
ARG NEXT_PUBLIC_TABNEXT_DASHBOARD_ID

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ANALYTICS_DOMAIN=$NEXT_PUBLIC_ANALYTICS_DOMAIN
ENV NEXT_PUBLIC_ANALYTICS_SITE=$NEXT_PUBLIC_ANALYTICS_SITE
ENV NEXT_PUBLIC_ANALYTICS_DOMAIN_EACANADA=$NEXT_PUBLIC_ANALYTICS_DOMAIN_EACANADA
ENV NEXT_PUBLIC_ANALYTICS_SITE_EACANADA=$NEXT_PUBLIC_ANALYTICS_SITE_EACANADA
ENV NEXT_PUBLIC_ANALYTICS_DOMAIN_UBL=$NEXT_PUBLIC_ANALYTICS_DOMAIN_UBL
ENV NEXT_PUBLIC_ANALYTICS_SITE_UBL=$NEXT_PUBLIC_ANALYTICS_SITE_UBL
ENV NEXT_PUBLIC_ANALYTICS_AGENT_ID=$NEXT_PUBLIC_ANALYTICS_AGENT_ID
ENV NEXT_PUBLIC_CHAT_API=$NEXT_PUBLIC_CHAT_API
ENV NEXT_PUBLIC_SALESFORCE_ORG_URL=$NEXT_PUBLIC_SALESFORCE_ORG_URL
ENV NEXT_PUBLIC_TABNEXT_DASHBOARD_ID=$NEXT_PUBLIC_TABNEXT_DASHBOARD_ID

RUN npm run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# All secrets (NEXTAUTH_SECRET, OPENAI_API_KEY, TABLEAU_*, etc.) are injected
# by Railway at runtime — never stored in this image.
CMD ["node", "server.js"]
