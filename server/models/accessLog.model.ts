import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

// 定义访问日志的接口
export interface IAccessLog extends Document {
	ip: string;
	userAgent: string;
	path: string;
	method: string;
	statusCode: number;
	createdAt: string;
	updatedAt: string;
}

// 定义访问日志的 Schema
const AccessLogSchema: Schema = new Schema(
	{
		ip: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		adminId: {
			type: String,
			default: null,
		},
		regionInfo: {
			type: Object,
			required: false,
			default: { country: '未知', province: '未知', city: '未知', isp: '未知' },
		},
		userAgent: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
		method: {
			type: String,
			required: true,
		},
		statusCode: {
			type: Number,
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
		collection: 'access_logs', // 指定集合名称
	},
);

// 创建并导出模型
const AccessLogModel = mongoose.model<IAccessLog>('AccessLog', AccessLogSchema);
export default AccessLogModel;
