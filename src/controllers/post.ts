import { Request, Response } from 'express';
import {
	createPost,
	deletePost,
	getAllPosts,
	getPostByPostId,
	getPostByUserId,
	likePostByPostId,
} from '../services/posts';
import AppError, { HttpCode } from '../utils/AppError';
import AppResponse from '../utils/AppResponse';
import {
	CreatePostSchema,
	PaginationSchema,
	PostIdSchema,
} from '../validation/post';
import Post from '../models/posts';
import { UserIdSchema } from '../validation/user';
import { getUserByUserId } from '../services/user';

export const createNewPost = async (
	req: Request<{}, {}, CreatePostSchema>,
	res: Response
) => {
	const { user, body } = req;

	if (typeof user === 'undefined') {
		throw new AppError({
			httpCode: HttpCode.UNAUTHORIZED,
			message: 'Unauthorized',
		});
	}

	const post = await createPost({
		...body,
		user: user._id,
	});

	return AppResponse(res, post, 201);
};

export const getPost = async (req: Request<PostIdSchema>, res: Response) => {
	const { postId } = req.params;
	const post = await getPostByPostId(postId);
	return AppResponse(res, post, 200);
};

export const deletePostById = async (
	req: Request<PostIdSchema>,
	res: Response
) => {
	const { user, params } = req;

	if (typeof user === 'undefined') {
		throw new AppError({
			httpCode: HttpCode.UNAUTHORIZED,
			message: 'Unauthorized',
		});
	}
	await deletePost(params.postId, user._id);
	return AppResponse(res, null, 204);
};

export const likePost = async (req: Request<PostIdSchema>, res: Response) => {
	const { user, params } = req;

	if (typeof user === 'undefined') {
		throw new AppError({
			httpCode: HttpCode.UNAUTHORIZED,
			message: 'Unauthorized',
		});
	}

	const post = await likePostByPostId(params.postId, user._id);
	await post.save();
	return AppResponse(res, post, 200);
};

export const getPostLikes = async (
	req: Request<PostIdSchema>,
	res: Response
) => {
	const { postId } = req.params;
	const post = await Post.findById(postId).populate('likes', 'username').exec();
	if (post === null) {
		throw new AppError({
			httpCode: HttpCode.NOT_FOUND,
			message: 'Post not found',
		});
	}
	return AppResponse(res, { post, likesCount: post.likes.length }, 200);
};

export const getPosts = async (
	req: Request<PaginationSchema>,
	res: Response
) => {
	const { page, limit } = req.params;
	const posts = await getAllPosts(parseInt(page), parseInt(limit));
	return AppResponse(res, posts, 200);
};

export const getUserPosts = async (
	req: Request<UserIdSchema>,
	res: Response
) => {
	const { userId } = req.params;
	const user = await getUserByUserId(userId);
	const posts = await getPostByUserId(String(user._id));
	return AppResponse(res, posts, 200);
};
