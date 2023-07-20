import { z } from 'zod';

export interface InteractionModel {
  interactionId: string;
  caseId: string;
}

// The validation schema
export const InteractionSchema = z.object({
  interactionId: z
    .string({
      required_error: 'interactionId is required',
    })
    .trim()
    .min(1, 'interactionId cannot be empty'),
});

// The api validation schema for interaction detail. Note that the id is path parameter, hence the params object
// Please refer to the validate middleware in server\src\middlewares\ValidateMiddleware.ts
export const InteractionDetailApiSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'id is required',
    }),
  }),
});

// The api validation schema for interaction list. Note that the query is query parameter, hence the query object
// Please refer to the validate middleware in server\src\middlewares\ValidateMiddleware.ts
export const InteractionsApiSchema = z.object({
  body: z.object({
    startDate: z
      .string({
        required_error: 'startDate is required',
      })
      .trim(),
    endDate: z
      .string({
        required_error: 'endDate is required',
      })
      .trim(),
    pageIndex: z
      .string({
        required_error: 'pageIndex is required',
      })
      .trim(),
    pageSize: z
      .string({
        required_error: 'pageSize is required',
      })
      .trim(),
  }),
});

// The inferred type
export type Interaction = z.infer<typeof InteractionSchema>;
