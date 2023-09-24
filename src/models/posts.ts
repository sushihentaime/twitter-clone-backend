import { Document, Schema, Types, model } from 'mongoose';

export interface IPost extends Document {
	text: string;
	media?: Array<string>;
	user: Types.ObjectId;
	likes: Array<Types.ObjectId>;
	comments: Array<Types.ObjectId>;
}

const postSchema = new Schema<IPost>(
	{
		text: {
			type: String,
			trim: true,
			required: true,
		},
		media: [
			{
				type: String,
			},
		],
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_doc, ret) => {
				const obj = { ...ret };
				delete obj.__v;
				return obj;
			},
		},
	}
);

const Post = model<IPost>('Post', postSchema);

export default Post;
