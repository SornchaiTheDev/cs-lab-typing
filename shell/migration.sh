# Run Prisma Migrations

if [ -f yarn.lock ]; then yarn prisma migrate deploy ; \
 elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npx prisma migrate deploy ; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm exec prisma migrate deploy; \
 else echo "Lockfile not found." && exit 1; \
 fi
