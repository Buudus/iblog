import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';
import dayjs from 'dayjs';

// 定义分类的接口
export interface ICategory extends Document {
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

// 定义分类的 Schema
const CategorySchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
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
		collection: 'categories', // 指定集合名称
	}
);

// 创建并导出模型
const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
export default CategoryModel;
