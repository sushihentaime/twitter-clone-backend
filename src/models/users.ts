import { Document, Model, Schema, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
	name: string;
	username: string;
	email: string;
	passwordHash: string;
}

interface IUserMethods {
	isValidPassword(password: string): Promise<boolean>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
	isNameTaken(name: string, excludedUserId?: Types.ObjectId): Promise<boolean>;
	isUsernameTaken(
		username: string,
		excludedUserId?: Types.ObjectId
	): Promise<boolean>;
	isEmailTaken(
		email: string,
		excludedUserId?: Types.ObjectId
	): Promise<boolean>;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
	{
		name: {
			type: String,
			trim: true,
			unique: true,
			required: true,
		},
		username: {
			type: String,
			trim: true,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			required: true,
		},
		passwordHash: {
			type: String,
			trim: true,
			unique: true,
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_doc, ret) => {
				const obj = { ...ret };
				delete obj.__v;
				delete obj.passwordHash;
				return obj;
			},
		},
	}
);

userSchema.statics.isNameTaken = async function (
	name: string,
	excludedUserId?: Types.ObjectId
) {
	const user: unknown = await this.findOne({
		name,
		_id: { $ne: excludedUserId },
	});
	return !!user;
};

userSchema.statics.isUsernameTaken = async function (
	username: string,
	excludedUserId?: Types.ObjectId
) {
	const user: unknown = await this.findOne({
		username,
		_id: { $ne: excludedUserId },
	});
	return !!user;
};

userSchema.statics.isEmailTaken = async function (
	email: string,
	excludedUserId?: Types.ObjectId
) {
	const user: unknown = await this.findOne({
		email,
		_id: { $ne: excludedUserId },
	});
	return !!user;
};

userSchema.methods.isValidPassword = async function (password: string) {
	return bcrypt.compare(password, this.passwordHash as string);
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;
