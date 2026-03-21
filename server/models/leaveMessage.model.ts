import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';
import dayjs from 'dayjs';

// 定义留言的接口
export interface ILeaveMessage extends Document {
	concat: string;
	content: string;
	ip: string;
	userAgent: string;
	createdAt: string;
	updatedAt: string;
}

// 定义留言的 Schema
const LeaveMessageSchema: Schema = new Schema(
	{
		concat: {
			type: String,
			required: true,
			trim: true,
		},
		content: {
			type: String,
			required: true,
		},
		ip: {
			type: String,
			required: true,
		},
		userAgent: {
			type: String,
			required: false,
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
		collection: 'leave_messages', // 指定集合名称
	}
);

// 创建并导出模型
const LeaveMessageModel = mongoose.model<ILeaveMessage>('LeaveMessage', LeaveMessageSchema);
export default LeaveMessageModel;
