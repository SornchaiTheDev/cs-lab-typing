const { z } = require("zod");

/*eslint sort-keys: "error"*/
const envSchema = z.object({
  BASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  POSTGRES_PRISMA_URL: z.string(),
  POSTGRES_URL_NON_POOLING: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(env.error.format(), null, 4)
  );
  process.exit(1);
}
module.exports.env = env.data;
