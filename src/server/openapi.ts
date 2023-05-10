import { generateOpenApiDocument } from "trpc-openapi";

import { appRouter } from "./routers/_app";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "CS-LAB Typing REST API DOCS",
  version: "0.0.1",
  baseUrl: "http://localhost:3000/api",
  tags: ["logs"],
});
