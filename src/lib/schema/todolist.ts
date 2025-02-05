import { z } from "zod";

export const CreateTodolistValidation = z.object({
  title: z.string().min(1),
});


export const ItemsValidatidation = z.object({
  items: z.string().min(1),
});
