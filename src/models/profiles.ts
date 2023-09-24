import { Document, Schema, Types, model } from 'mongoose';

interface IProfile extends Document {
	bio?: string;
	profilePic?: string;
	coverPic?: string;
	location?: string;
	birthDate?: Date;
	user: Types.ObjectId;
	followers: Array<Types.ObjectId>;
	following: Array<Types.ObjectId>;
	bookmarks: Array<Types.ObjectId>;
}

const profileSchema = new Schema<IProfile>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		bio: {
			type: String,
			maxLength: 150,
			trim: true,
		},
		profilePic: {
			type: String,
		},
		coverPic: {
			type: String,
		},
		location: {
			type: String,
		},
		birthDate: {
			type: Date,
		},
		followers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		following: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		bookmarks: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post',
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

const Profile = model<IProfile>('Profile', profileSchema);

export default Profile;
