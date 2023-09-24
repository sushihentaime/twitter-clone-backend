import { Types } from 'mongoose';
import Post, { IPost } from '../models/posts';
import AppError, { HttpCode } from '../utils/AppError';
import { getUserByUserId } from './user';

export const getPostByPostId = async (postId: string) => {
	const post = await Post.findById(postId);
	if (!post) {
		throw new AppError({
			httpCode: HttpCode.NOT_FOUND,
			message: 'Post not found',
		});
	}
	return post;
};

export const getPostByUserId = async (userId: string) => {
	const posts = await Post.find({ user: userId });
	if (!posts) {
		throw new AppError({
			httpCode: HttpCode.NOT_FOUND,
			message: 'User not found',
		});
	}
	return posts;
};

export interface PostBody {
	text: string;
	media?: string[];
	user: string;
}

export const createPost = async (postBody: PostBody) => {
	return Post.create(postBody);
};

export const deletePost = async (postId: string, userId: string) => {
	const post = await getPostByPostId(postId);
	const isPostOwner = post.user.equals(userId);
	if (!isPostOwner) {
		throw new AppError({
			httpCode: HttpCode.FORBIDDEN,
			message: 'You are not the owner of this post',
		});
	}
	await Post.findByIdAndRemove(postId);
	return true;
};

export const likePostByPostId = async (postId: string, userId: string) => {
	const post = await getPostByPostId(postId);
	const user = await getUserByUserId(userId);
	if (post.likes.includes(user._id as Types.ObjectId)) {
		post.likes = post.likes.filter(
			(id) => id.toString() !== (user._id as Types.ObjectId).toString()
		);
	} else {
		post.likes = post.likes.concat(user._id as Types.ObjectId);
	}
	return post;
};

export const getAllPosts = async (page: number, limit: number) => {
	if (limit > 10) {
		limit = 10;
	}

	type Results = {
		next?: { page: number; limit: number };
		previous?: { page: number; limit: number };
		data: Array<IPost>;
	};

	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const results: Results = {
		data: [],
	};

	if (endIndex < (await Post.countDocuments().exec())) {
		results.next = {
			page: page + 1,
			limit: limit,
		};
	}

	if (startIndex > 0) {
		results.previous = {
			page: page - 1,
			limit: limit,
		};
	}

	try {
		results.data = await Post.find().limit(limit).skip(startIndex).exec();
	} catch (error) {
		if (error instanceof Error) {
			throw new AppError({
				httpCode: HttpCode.INTERNAL_SERVER_ERROR,
				message: error.message,
			});
		} else {
			throw new AppError({
				httpCode: HttpCode.INTERNAL_SERVER_ERROR,
				message: JSON.stringify(error),
			});
		}
	}

	return results;
};
