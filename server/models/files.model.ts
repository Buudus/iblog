import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

// 定义文件模型的接口
export interface IFile extends Document {
	name: string;
	originalName: string;
	mimetype: string;
	url: string;
	md5: string;
	size: number;
	createdAt: string;
	updatedAt: string;
}

// 定义文件模型的 Schema
const FileSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		originalName: {
			type: String,
			required: true,
			trim: true,
		},
		mimetype: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		md5: {
			type: String,
			required: true,
		},
		size: {
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
		collection: 'files',
	},
);

// 创建并导出模型
const FileModel = mongoose.model<IFile>('File', FileSchema);
export default FileModel;
