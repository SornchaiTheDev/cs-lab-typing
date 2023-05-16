import { mergeRouter } from "@/server/trpc";
import { createSectionsRouter } from "./create.router";
import { getSectionsRouter } from "./get.router";
import { updateSectionsRouter } from "./update.router";
import { deleteSectionsRouter } from "./delete.router";

export const sectionRouter = mergeRouter(
  createSectionsRouter,
  getSectionsRouter,
  updateSectionsRouter,
  deleteSectionsRouter
);
