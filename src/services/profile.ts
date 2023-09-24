import { Types } from 'mongoose';
import Profile from '../models/profiles';
import AppError, { HttpCode } from '../utils/AppError';
import { UpdateProfileSchema } from '../validation/profile';

export const initProfile = async (userId: string) => {
	const profile = await Profile.findOne({ user: userId });
	if (!profile) {
		return createProfile(userId);
	}
	return profile;
};

export const createProfile = async (userId: string) => {
	return Profile.create({ user: userId });
};

export const getProfile = async (userId: string) => {
	const profile = await Profile.findOne({ user: userId });
	if (!profile) {
		throw new AppError({
			httpCode: HttpCode.NOT_FOUND,
			message: 'Profile not found',
		});
	}
	return profile;
};

export const updateProfile = async (
	userId: string,
	body: UpdateProfileSchema
) => {
	const profile = await Profile.findOneAndUpdate(
		{ user: userId },
		{ ...body },
		{ new: true, runValidators: true }
	);
	return profile;
};

export const toggleFollowing = (
	array: Types.ObjectId[] | undefined,
	element: Types.ObjectId
) => {
	if (typeof array === 'undefined') {
		throw new AppError({
			httpCode: HttpCode.INTERNAL_SERVER_ERROR,
			message: 'followers array is undefined',
		});
	}
	const index = array.findIndex(
		(item) => item.toString() === element.toString()
	);

	if (index !== -1) {
		array.splice(index, 1);
	} else {
		array.push(element);
	}
};

export const followUsers = async (userId: string, userToFollowId: string) => {
	const profile = await getProfile(userId);
	const userToFollowProfile = await getProfile(userToFollowId);

	toggleFollowing(profile.following, userToFollowProfile._id as Types.ObjectId);
	toggleFollowing(userToFollowProfile.followers, profile._id as Types.ObjectId);

	await profile.save();
	await userToFollowProfile.save();

	return { profile, userToFollowProfile };
};
