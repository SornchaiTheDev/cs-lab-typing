#!/bin/bash

# Install dependencies
if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the project

if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
 elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
 else echo "Lockfile not found." && exit 1; \
 fi

# Run Prisma Migrations

if [ -f yarn.lock ]; then yarn prisma migrate deploy ; \
 elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npx prisma migrate deploy ; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm exec prisma migrate deploy; \
 else echo "Lockfile not found." && exit 1; \
 fi

# Seeding the database

if [ -f yarn.lock ]; then yarn prisma db seed ; \
 elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npx prisma db seed ; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm exec prisma db seed; \
 else echo "Lockfile not found." && exit 1; \
 fi




# Change Working Directory
cd ../

# Copy build files to server
cp -r ./cs-lab-typing/.next/standalone ./standalone
cp -r ./cs-lab-typing/.next/static ./standalone/.next/static
cp -r ./cs-lab-typing/public ./standalone

# Run the server
cd standalone/ 

node server.js
