import dayjs from 'dayjs';
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

// 定义博客文章的接口
export interface IArticleBehavior extends Document {
	articleId: mongoose.Types.ObjectId;
	ip: string;
	user: string;
	like: boolean;
	browseProgress: number; // 百分比，0-100
	browsingDuration: number; // 单位：秒
	createdAt: string;
	updatedAt: string;
}

// 定义博客文章的Schema
const ArticleBehaviorSchema: Schema = new Schema(
	{
		articleId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Article', // 关联到 Article 模型
		},
		ip: {
			type: String,
			default: '未知',
		},
		user: {
			type: String,
			default: '未知游客',
		},
		like: {
			type: Boolean,
			default: false,
		},
		browseProgress: {
			// 百分比，0-100
			type: Number,
			default: 0,
		},
		browsingDuration: {
			// 单位：秒
			type: Number,
			default: 0,
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
		collection: 'article_behavior', // 指定集合名称
	}
);

// 创建并导出模型
const ArticleBehaviorModel = mongoose.model<IArticleBehavior>(
	'ArticleBehavior',
	ArticleBehaviorSchema
);
export default ArticleBehaviorModel;
