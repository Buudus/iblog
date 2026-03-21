import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

/**
 * pending - 待审核
 * approved - 已通过
 * rejected - 已拒绝
 */

// 定义友链的接口
export interface IFriendlyLink extends Document {
	name: string;
	url: string;
	icon: string;
	status: 'pending' | 'approved' | 'rejected';
	description: string;
	email: string;
	remark: string;
	createdAt?: string;
	updatedAt?: string;
}

// 定义友链的 Schema
const FriendlyLinkSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		url: {
			type: String,
			required: true,
			trim: true,
		},
		icon: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
		description: {
			type: String,
			default: '',
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		remark: {
			type: String,
			default: '',
		},
		createdAt: {
			type: String,
			default: () => dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
		},
		updatedAt: {
			type: String,
			default: () => dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
		},
	},
	{
		collection: 'friendly_links', // 指定集合名称
	}
);

// 创建并导出模型
const FriendlyLinkModel = mongoose.model<IFriendlyLink>('FriendlyLink', FriendlyLinkSchema);
export default FriendlyLinkModel;
