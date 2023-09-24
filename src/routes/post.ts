import 'express-async-errors';
import express from 'express';
import validateRequest from '../middleware/validateRequest';
import {
	createPostSchema,
	paginationSchema,
	postIdSchema,
} from '../validation/post';
import { tokenAuthentication } from '../middleware/passportMiddleware';
import {
	createNewPost,
	deletePostById,
	getPost,
	getPostLikes,
	getPosts,
	getUserPosts,
	likePost,
} from '../controllers/post';
import {
	createNewComment,
	deleteComment,
	getComments,
} from '../controllers/comment';
import {
	createCommentSchema,
	deleteCommentSchema,
} from '../validation/comment';
import { userIdSchema } from '../validation/user';

const postRouter = express.Router();

postRouter
	.route('/')
	.post(
		tokenAuthentication,
		validateRequest({
			body: createPostSchema,
		}),
		createNewPost
	)
	.get(
		tokenAuthentication,
		validateRequest({
			params: paginationSchema,
		}),
		getPosts
	);

postRouter
	.route('/:postId')
	.get(
		tokenAuthentication,
		validateRequest({
			params: postIdSchema,
		}),
		getPost
	)
	.delete(
		tokenAuthentication,
		validateRequest({
			params: postIdSchema,
		}),
		deletePostById
	);

postRouter
	.route('/:postId/likes')
	.patch(
		tokenAuthentication,
		validateRequest({
			params: postIdSchema,
		}),
		likePost
	)
	.get(
		tokenAuthentication,
		validateRequest({
			params: postIdSchema,
		}),
		getPostLikes
	);

postRouter
	.route('/:postId/comments')
	.get(
		tokenAuthentication,
		validateRequest({
			params: postIdSchema,
		}),
		getComments
	)
	.post(
		tokenAuthentication,
		validateRequest({
			params: postIdSchema,
			body: createCommentSchema,
		}),
		createNewComment
	);

postRouter.route('/:postId/comments/:commentId').delete(
	tokenAuthentication,
	validateRequest({
		params: deleteCommentSchema,
	}),
	deleteComment
);

postRouter.route('/user/:userId').get(
	tokenAuthentication,
	validateRequest({
		params: userIdSchema,
	}),
	getUserPosts
);

export default postRouter;
