import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';
import dayjs from 'dayjs';

// 定义作者信息模型的接口
export interface IAuthorInfo extends Document {
	avatar: string;
	name: string;
	ps: string;
	biography: string;
	qq: string;
	wechat: string;
	email: string;
	github: string;
	weibo: string;
	isUse: 'yes' | 'no';
	createdAt: string;
	updatedAt: string;
}

// 定义作者信息模型的 Schema
const AuthorInfoSchema: Schema = new Schema(
	{
		avatar: {
			type: String,
			required: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		ps: {
			type: String,
			default: '',
		},
		biography: {
			type: String,
			default: '',
		},
		qq: {
			type: String,
			default: '',
		},
		wechat: {
			type: String,
			default: '',
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		github: {
			type: String,
			default: '',
		},
		weibo: {
			type: String,
			default: '',
		},
		isUse: {
			type: String,
			enum: ['yes', 'no'],
			default: 'yes',
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
		collection: 'author_info', // 指定集合名称
	}
);

// 创建并导出模型
const AuthorInfoModel = mongoose.model<IAuthorInfo>('AuthorInfo', AuthorInfoSchema);
export default AuthorInfoModel;
