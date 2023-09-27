import { z } from 'zod';

export const userIdSchema = z
	.object({
		userId: z
			.string()
			.regex(/[0-9a-fA-F]{24}$/, { message: 'Invalid User Id' }),
	})
	.strict();

export const usernameSchema = z
	.object({
		username: z.string().regex(/^[a-zA-Z0-9]*$/, {
			message: 'Username must be alphanumeric and no spaces allowed',
		}),
	})
	.strict();

export type UserIdSchema = z.infer<typeof userIdSchema>;

export type UsernameSchema = z.infer<typeof usernameSchema>;
