import { z } from "zod";

export const LoginValidation = z.object({
  username: z.string(),
  password: z.string(),
});
