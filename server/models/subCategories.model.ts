import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

// 定义二级分类的接口
export interface ISubCategory extends Document {
	name: string;
	description: string;
	parentId: mongoose.Types.ObjectId;
	createdAt: string;
	updatedAt: string;
}

// 定义二级分类的 Schema
const SubCategorySchema: Schema = new Schema(
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
		parentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Categories',
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
		collection: 'sub_categories', // 指定集合名称
	}
);

// 创建并导出模型
const SubCategoryModel = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);
export default SubCategoryModel;
