import express from 'express';
import { tokenAuthentication } from '../middleware/passportMiddleware';
import validateRequest from '../middleware/validateRequest';
import { usernameSchema } from '../validation/user';
import { searchUser } from '../controllers/user';

const userRouter = express.Router();

userRouter.route('/search').post(
	tokenAuthentication,
	validateRequest({
		params: usernameSchema,
	}),
	searchUser
);

export default userRouter;
