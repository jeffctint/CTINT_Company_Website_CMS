import { validate } from '@/middlewares';
import { z } from 'zod';

const refreshTokenSchema = z.object({
  refreshToken: z
    .string({
      required_error: 'Refresh token is required',
    })
    .trim()
    .min(1, 'Refresh token cannot be empty'),
});
export const validateRefreshToken = validate(refreshTokenSchema);

/**
 * Validate the GC user header
 */
const gcUserHeaderSchema = z.object({
  // This key 'headers' is for request.headers; Please refer to the validate middleware
  headers: z.object({
    'gc-user-name': z.string({
      required_error: 'Missing GC user name',
    }),
    'gc-user-email': z.string({
      required_error: 'Missing GC user email',
    }),
    'gc-user-id': z.string({
      required_error: 'Missing GC user id',
    }),
  }),
});

export const validateGcUserHeader = validate(gcUserHeaderSchema);
