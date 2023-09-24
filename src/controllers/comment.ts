import { Request, Response } from 'express';
import { getPostByPostId } from '../services/posts';
import {
	createComment,
	getComment,
	isCommentOwner,
	removeComment,
} from '../services/comment';
import AppError, { HttpCode } from '../utils/AppError';
import AppResponse from '../utils/AppResponse';
import { PostIdSchema } from '../validation/post';
import {
	CreateCommentSchema,
	DeleteCommentSchema,
} from '../validation/comment';
import { Types } from 'mongoose';
import Post from '../models/posts';

export const createNewComment = async (
	req: Request<PostIdSchema, {}, CreateCommentSchema>,
	res: Response
) => {
	const { user, body, params } = req;

	if (typeof user === 'undefined') {
		throw new AppError({
			httpCode: HttpCode.UNAUTHORIZED,
			message: 'Unauthorized',
		});
	}
	const post = await getPostByPostId(params.postId);
	const comment = await createComment({
		...body,
		user: user._id,
		post: post._id as string,
	});
	post.comments = post.comments.concat(comment._id as Types.ObjectId);
	await post.save();
	return AppResponse(res, comment, 201);
};

export const getComments = async (
	req: Request<PostIdSchema>,
	res: Response
) => {
	const { postId } = req.params;
	const post = await Post.findById(postId).populate('comments', '').exec();
	if (post === null) {
		throw new AppError({
			httpCode: HttpCode.NOT_FOUND,
			message: 'Post not found',
		});
	}

	return AppResponse(res, { post, commentsCount: post.comments.length }, 200);
};

export const deleteComment = async (
	req: Request<DeleteCommentSchema>,
	res: Response
) => {
	const { user, params } = req;

	if (typeof user === 'undefined') {
		throw new AppError({
			httpCode: HttpCode.UNAUTHORIZED,
			message: 'Unauthorized',
		});
	}

	const post = await getPostByPostId(params.postId);
	const comment = await getComment(params.commentId);
	const isOwner = await isCommentOwner(params.commentId, user._id);

	if (isOwner) {
		await removeComment(String(comment._id), String(post._id));
	}

	return AppResponse(res, null, 204);
};
