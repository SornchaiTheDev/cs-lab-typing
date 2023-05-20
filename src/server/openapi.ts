import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "~/server/api/root";
import { env } from "~/env.mjs";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "CS-LAB Typing REST API DOCS",
  version: "0.0.1",
  baseUrl: env.BASE_URL,
  tags: ["logs"],
});
