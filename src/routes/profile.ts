import express, { Request, Response } from 'express';
import { tokenAuthentication } from '../middleware/passportMiddleware';
import { getUserByUsername } from '../services/user';
import { followUsers, getProfile, updateProfile } from '../services/profile';
import AppResponse from '../utils/AppResponse';
import {
	ProfileUsernameSchema,
	UpdateProfileSchema,
	profileUsernameSchema,
	updateProfileSchema,
} from '../validation/profile';
import validateRequest from '../middleware/validateRequest';
import AppError, { HttpCode } from '../utils/AppError';

const profileRouter = express.Router();

profileRouter.get(
	'/:username',
	tokenAuthentication,
	validateRequest({
		params: profileUsernameSchema,
	}),
	async (req: Request<ProfileUsernameSchema>, res: Response) => {
		const { username } = req.params;
		const user = await getUserByUsername(username);
		const profile = await getProfile(String(user._id));

		return AppResponse(res, profile, 200);
	}
);

profileRouter.patch(
	'/:username',
	tokenAuthentication,
	validateRequest({
		params: profileUsernameSchema,
		body: updateProfileSchema,
	}),
	async (
		req: Request<ProfileUsernameSchema, {}, UpdateProfileSchema>,
		res: Response
	) => {
		const { body, params, user } = req;
		if (typeof user === 'undefined') {
			throw new AppError({
				httpCode: HttpCode.UNAUTHORIZED,
				message: 'Unauthorized',
			});
		}
		if (user.username !== params.username) {
			throw new AppError({
				httpCode: HttpCode.FORBIDDEN,
				message: 'Forbidden',
			});
		}
		const profile = await updateProfile(user._id, body);
		return AppResponse(res, profile, 200);
	}
);

profileRouter.get(
	'/:username/followers',
	tokenAuthentication,
	validateRequest({ params: profileUsernameSchema }),
	async (req: Request<ProfileUsernameSchema>, res: Response) => {
		const { username } = req.params;
		const user = await getUserByUsername(username);
		const profile = await getProfile(String(user._id));
		return AppResponse(
			res,
			{ profile, followersCount: profile.followers.length },
			200
		);
	}
);

profileRouter.get(
	'/:username/following',
	tokenAuthentication,
	validateRequest({ params: profileUsernameSchema }),
	async (req: Request<ProfileUsernameSchema>, res: Response) => {
		const { username } = req.params;
		const user = await getUserByUsername(username);
		const profile = await getProfile(String(user._id));
		return AppResponse(
			res,
			{ profile, followingsCount: profile.following.length },
			200
		);
	}
);

profileRouter.patch(
	'/:username/follow',
	tokenAuthentication,
	validateRequest({ params: profileUsernameSchema }),
	async (req: Request<ProfileUsernameSchema>, res: Response) => {
		const { params, user } = req;
		if (typeof user === 'undefined') {
			throw new AppError({
				httpCode: HttpCode.FORBIDDEN,
				message: 'You must be logged in to follow a user',
			});
		}

		if (user.username === params.username) {
			throw new AppError({
				httpCode: HttpCode.FORBIDDEN,
				message: "You can't follow yourself",
			});
		}

		const userToFollow = await getUserByUsername(params.username);
		const { profile, userToFollowProfile } = await followUsers(
			user._id,
			String(userToFollow._id)
		);

		return AppResponse(res, { profile, userToFollowProfile }, 200);
	}
);

export default profileRouter;
