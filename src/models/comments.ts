import { Schema, Document, Types, model } from 'mongoose';

interface IComment extends Document {
	text: string;
	media?: Array<string>;
	user: Types.ObjectId;
	likes: Array<Types.ObjectId>;
	post: Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
	{
		text: {
			type: String,
			trim: true,
			required: true,
		},
		media: {
			type: String,
			trim: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		post: {
			type: Schema.Types.ObjectId,
			ref: 'Post',
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
		toJSON: {
			transform: (doc, ret) => {
				const obj = { ...ret };
				delete obj.__v;
				return obj;
			},
		},
	}
);

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
