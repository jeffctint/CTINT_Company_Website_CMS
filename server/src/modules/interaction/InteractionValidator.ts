import { validate } from '@/middlewares';
import { InteractionSchema, InteractionDetailApiSchema, InteractionsApiSchema } from './InteractionModel';

export const validateInteractionCreate = validate(InteractionSchema);
export const validateInteractionDetail = validate(InteractionDetailApiSchema);
export const validateInteractions = validate(InteractionsApiSchema);
