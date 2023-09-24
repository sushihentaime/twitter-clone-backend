import { z } from 'zod';

export const signupSchema = z
	.object({
		name: z
			.string()
			.regex(/^[a-zA-Z0-9 -]*$/, {
				message: 'Name must only contain letters, numbers and spaces',
			})
			.min(3, { message: 'Name must be at least 3 characters long' })
			.max(50, { message: 'Name must be at most 50 characters long' })
			.trim(),
		username: z
			.string()
			.min(3, { message: 'Username must be at least 3 characters long' })
			.max(50, { message: 'Username must be at most 50 characters long' })
			.regex(/^[a-zA-Z0-9]*$/, {
				message: 'Username must be alphanumeric and no spaces allowed',
			})
			.trim(),
		email: z.string().email({ message: 'Invalid email address' }).trim(),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
				message:
					'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
			})
			.trim(),
	})
	.strict();

export const loginSchema = z
	.object({
		username: z
			.string()
			.min(3, { message: 'Username must be at least 3 characters long' })
			.max(50, { message: 'Username must be at most 50 characters long' })
			.regex(/^[a-zA-Z0-9]*$/, {
				message: 'Username must be alphanumeric and no spaces allowed',
			}),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long' })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
				message:
					'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
			}),
	})
	.strict();

export type SignupSchema = z.infer<typeof signupSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;
