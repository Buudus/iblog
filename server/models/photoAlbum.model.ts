import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';
import dayjs from 'dayjs';

// 定义相册模型的接口
export interface IPhotoAlbum extends Document {
	title: string;
	url: string;
	path: string;
	description: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

// 定义相册模型的 Schema
const PhotoAlbumSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		url: {
			type: String,
			required: true,
			trim: true,
		},
		path: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			default: '',
		},
		tags: {
			type: [String],
			default: [],
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
		collection: 'photo_album', // 指定集合名称
	}
);

// 创建并导出模型
const PhotoAlbumModel = mongoose.model<IPhotoAlbum>('PhotoAlbum', PhotoAlbumSchema);
export default PhotoAlbumModel;
