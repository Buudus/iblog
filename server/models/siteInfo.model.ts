import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

// 定义站点信息配置的接口
export interface ISiteInfo extends Document {
	title: string;
	keywords: string;
	description: string;
	globalStyle: string;
	globalScript: string;
	domain: string;
	logo: string;
	isUse: 'yes' | 'no';
	createdAt?: string;
	updatedAt?: string;
}

// 定义站点信息配置的 Schema
const SiteInfoSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		keywords: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		globalStyle: {
			type: String,
			default: '',
		},
		globalScript: {
			type: String,
			default: '',
		},
		domain: {
			type: String,
			required: true,
			trim: true,
		},
		logo: {
			type: String,
			default: '',
		},
		isUse: {
			type: String,
			enum: ['yes', 'no'],
			default: 'no',
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
		collection: 'site_info', // 指定集合名称
	}
);

// 创建并导出模型
const SiteInfoModel = mongoose.model<ISiteInfo>('SiteInfo', SiteInfoSchema);
export default SiteInfoModel;
