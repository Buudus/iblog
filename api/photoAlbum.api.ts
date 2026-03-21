import { api } from '~/utils/util.fetch';
import type { PhotoAlbum, PaginationResponse } from './types';

// 相册管理API
export const photoAlbumApi = {
	// 获取相册列表
	getList: (params?: { page?: number; pageSize?: number; keywords?: string }) =>
		api.get<PaginationResponse<PhotoAlbum>>('/api/admin/photoAlbum/list', { query: params }),

	// 创建相册
	create: (data: Omit<PhotoAlbum, '_id' | 'createdAt' | 'updatedAt'>) =>
		api.post<PhotoAlbum>('/api/admin/photoAlbum/create', data),

	// 更新相册
	update: (id: string, data: Partial<PhotoAlbum>) =>
		api.put<PhotoAlbum>(`/api/admin/photoAlbum/update/${id}`, data),

	// 删除相册（支持单个或批量，使用query参数ids，逗号分隔）
	delete: (ids: string) => api.delete('/api/admin/photoAlbum/delete', { query: { ids } }),

	// 获取单个相册
	getById: (id: string) => api.get<PhotoAlbum>(`/api/admin/photoAlbum/${id}`),

	// 批量删除相册
	deleteMany: (ids: string[]) => api.post('/api/admin/photoAlbum/deleteMany', { ids }),

	// 更新状态
	updateStatus: (id: string, status: 'active' | 'inactive') =>
		api.put(`/api/admin/photoAlbum/status/${id}`, { status }),

	// 添加照片到相册
	addPhotos: (id: string, photoUrls: string[]) =>
		api.post(`/api/admin/photoAlbum/${id}/photos`, { photoUrls }),

	// 从相册删除照片
	removePhotos: (id: string, photoUrls: string[]) =>
		api.delete(`/api/admin/photoAlbum/${id}/photos`, { body: { photoUrls } }),

	// 上传照片到相册
	upload: (formData: FormData) => api.post<PhotoAlbum[]>('/api/admin/photoAlbum/upload', formData),
};

// 客户端相册API
export const clientPhotoAlbumApi = {
	// 获取相册列表
	getAlbums: (params?: { page?: number; pageSize?: number; keywords?: string }) =>
		api.get<{ data: PhotoAlbum[]; total: number }>('/api/client/photoAlbum/list', {
			query: params,
		}),

	// 获取单个相册
	getAlbum: (id: string) => api.get<PhotoAlbum>(`/api/client/photoAlbum/${id}`),

	// 获取所有标签
	getAlbumTags: () =>
		api.get<{ data: { tag: string; count: number }[]; total: number }>(
			'/api/client/photoAlbum/tags'
		),
};
