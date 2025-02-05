import { z } from "zod";

export const CreateUserValidation = z
  .object({
    username: z.string().min(1),
    nama: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string(),
    passwordConfirmation: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.passwordConfirmation) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });
