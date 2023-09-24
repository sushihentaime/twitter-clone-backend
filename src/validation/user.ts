import { z } from 'zod';

export const userIdSchema = z
	.object({
		userId: z
			.string()
			.regex(/[0-9a-fA-F]{24}$/, { message: 'Invalid User Id' }),
	})
	.strict();

export type UserIdSchema = z.infer<typeof userIdSchema>;
