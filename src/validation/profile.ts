import { z } from 'zod';

export const profileUsernameSchema = z
	.object({
		username: z
			.string()
			.regex(/[0-9a-fA-F]{24}$/, { message: 'Invalid Profile Id' }),
	})
	.strict();

export const updateProfileSchema = z
	.object({
		bio: z
			.string()
			.trim()
			.max(250, { message: 'Bio must be less than 250 characters' })
			.optional(),
		profilePic: z
			.string()
			.trim()
			.url({ message: 'Profile Pic must be a valid URL' })
			.optional(),
		coverPic: z
			.string()
			.trim()
			.url({ message: 'Cover Pic must be a valid URL' })
			.optional(),
		location: z.string().trim().optional(),
		birthDate: z.string().datetime().optional(),
	})
	.strict();

export type ProfileUsernameSchema = z.infer<typeof profileUsernameSchema>;

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
