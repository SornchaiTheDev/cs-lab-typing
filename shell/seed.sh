# Seeding the database

if [ -f yarn.lock ]; then yarn prisma db seed ; \
 elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npx prisma db seed ; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm exec prisma db seed; \
 else echo "Lockfile not found." && exit 1; \
 fi