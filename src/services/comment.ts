import Comment from '../models/comments';
import AppError, { HttpCode } from '../utils/AppError';
import { getPostByPostId } from './posts';

interface CommentBody {
	text: string;
	media?: Array<string>;
	user: string;
	post: string;
}

export const createComment = async (commentBody: CommentBody) => {
	const newComment = await Comment.create(commentBody);
	return newComment;
};

export const getComment = async (commentId: string) => {
	const comment = await Comment.findById(commentId);
	if (!comment) {
		throw new AppError({
			httpCode: HttpCode.NOT_FOUND,
			message: 'Comment not found',
		});
	}
	return comment;
};

export const isCommentOwner = async (commentId: string, userId: string) => {
	const comment = await getComment(commentId);
	const isOwner: boolean = comment.user.equals(userId);
	if (!isOwner) {
		throw new AppError({
			httpCode: HttpCode.FORBIDDEN,
			message: "Not allowed to delete other's people message",
		});
	}
	return true;
};

export const removeComment = async (commentId: string, postId: string) => {
	await Comment.findByIdAndRemove(commentId);
	const post = await getPostByPostId(postId);
	post.comments = post.comments.filter((id) => id.toString() !== commentId);
	await post.save();
	return true;
};
