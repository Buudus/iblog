import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

// 定义博客文章的接口
export interface IArticle extends Document {
	cover: string;
	title: string;
	content: string;
	author: mongoose.Types.ObjectId;
	category: mongoose.Types.ObjectId;
	subCategory: mongoose.Types.ObjectId;
	tags: string[];
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
}

// 定义博客文章的Schema
const ArticleSchema: Schema = new Schema(
	{
		cover: {
			type: String,
			default: '',
			required: true,
			trim: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		content: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'AdminUser',
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		subCategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SubCategory',
			required: true,
		},
		tags: {
			type: [String],
			default: [],
		},
		isPublished: {
			type: Boolean,
			default: false,
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
		collection: 'articles', // 指定集合名称
	},
);

// 创建并导出模型
const ArticleModel = mongoose.model<IArticle>('Article', ArticleSchema);
export default ArticleModel;
