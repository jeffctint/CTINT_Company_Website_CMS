// Implement a validate middleware using zod
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const validate = (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the request object against the schema
      // Note the different parameters passed to parseAsync depending on the request type
      await schema.parseAsync({
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      // Map the error if it is an instance of ZodError
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(e => {
          return {
            path: e.path[0],
            message: e.message,
          };
        });
        return res.status(StatusCodes.BAD_REQUEST).json({ errors });
      }
    }
  };
};

export { validate };
