import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

// 定义管理员用户的接口
export interface IAdminUser extends Document {
	avatar: string;
	nickname: string;
	username: string;
	password: string;
	role: string;
	createdAt: string;
	updatedAt: string;
}

// 定义管理员用户的 Schema
const AdminUserSchema: Schema = new Schema(
	{
		avatar: {
			type: String,
			required: true,
			trim: true,
		},
		nickname: {
			type: String,
			required: true,
			trim: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
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
		collection: 'admin_users',
	},
);

// 创建并导出模型
const AdminUserModel = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
export default AdminUserModel;
