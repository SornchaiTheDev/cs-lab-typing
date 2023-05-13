import axios from "axios";
import { env } from "@/server/env";

export const api = axios.create({
  baseURL: env.BASE_URL,
});
