# CS LAB V1.0.0

## Stack 🛠️

- NextJs (Pages Directory)
- Trpc
- Zustand
- Tailwind
- Framer motion
- Zod
- Prisma
- Next Auth

## Environment Variables

|Variable|Description|
|---|-----------|
|NEXTAUTH_URL|root path of your URL ex. <http://localhost:3000>|
|NEXTAUTH_SECRET|a JWT signature you can generate using  `openssl rand -base64 32`|
|GOOGLE_CLIENT_ID| OAuth 2.0 Google Client Id you can get it at <https://console.cloud.google.com/> or you can follow these steps <https://support.google.com/cloud/answer/6158849?hl=en>|
|GOOGLE_CLIENT_SECRET| OAuth 2.0 Google Client secret. you can get it at  <https://console.cloud.google.com/>|
|DATABASE_URL| postgresql connection string ex. `postgresql://postgres:xxxxxxxxxxxx@localhost:5432/cs-lab`|

you can get those variables at `.env.example`

## Deployment

```bash
git pull origin main
pm2 status
pm2 stop 0
pm2 del 0
pm2 save --force
pnpm i
pnpm build
pm2 start 
pm2 save
```

or using Docker

...in Progress 🚧
