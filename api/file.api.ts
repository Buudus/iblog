import { api } from '~/utils/util.fetch';
import type { FileView, PaginationResponse } from './types';

// 文件管理API
export const fileApi = {
	// 上传文件
	upload: (files: FormData) => api.post<FileView[]>('/api/admin/file/upload', files),

	// 获取文件列表
	getList: (params?: { page?: number; limit?: number; keywords?: string; mimetype?: string }) =>
		api.get<PaginationResponse<FileView>>('/api/admin/file/list', { query: params }),

	// 删除文件
	delete: (ids: string) => api.delete(`/api/admin/file/delete?ids=${ids}`),

	// 获取图片文件列表
	getImageList: (params?: { page?: number; pageSize?: number }) =>
		api.get<PaginationResponse<FileView>>('/api/admin/file/imgFiles', { query: params }),
};

// 向后兼容的导出
export const uploadFileApi = fileApi.upload;
