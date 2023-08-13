# CS LAB V0.0.1

## TODOS

- [ ] Fix Some query full_name to student_id
- [ ] Recheck remove relation
- [ ] Unit testing

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

in `deploy.sh` you can change destination of standalone folder

Deploy on Server

1. Build project and Setup Database

```sh
chmod +x ./deploy.sh
./deploy.sh
```

or using Docker

...in Progress 🚧
