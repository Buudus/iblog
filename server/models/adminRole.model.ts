import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

// 定义管理员权限的接口
export interface IAdminRole extends Document {
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

// 定义管理员权限的Schema
const AdminRoleSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
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
		collection: 'admin_roles', // 指定集合名称
	}
);

// 创建并导出模型
const AdminRoleModel = mongoose.model<IAdminRole>('AdminRole', AdminRoleSchema);
export default AdminRoleModel;
