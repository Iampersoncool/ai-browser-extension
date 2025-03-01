import type { ValidationTargets } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { typeToFlattenedError, z, ZodError } from 'zod';

function formatZodError<T>(error: ZodError<T>): typeToFlattenedError<T> {
  return error.flatten();
}

// https://fiberplane.com/blog/hono-validation-middleware/
export default function zodValidator<
  // json, form, query, param, header, cookie
  Target extends keyof ValidationTargets,
  Schema extends z.ZodSchema
>(target: Target, schema: Schema) {
  return zValidator(target, schema, (result, c) => {
    // Early-return (or throw) on error
    if (!result.success) {
      // Error requirements will vary by use-case
      return c.json(
        {
          message: `invalid ${target}`,
          timestamp: Date.now(),
          errors: formatZodError(result.error),
        },
        400
      );
    }

    // Otherwise return the validated data
    return result.data;
  });
}
