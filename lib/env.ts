import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1).startsWith("sk-"),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);