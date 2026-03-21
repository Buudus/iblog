import { api } from '~/utils/util.fetch';
import type { AuthorInfo, PaginationResponse } from './types';

// 作者信息 API
export const authorInfoApi = {
	// 获取作者信息列表
	getList: (params?: { keywords?: string; page?: number; pageSize?: number }) =>
		api.get<PaginationResponse<AuthorInfo>>('/api/admin/authorInfo/list', { query: params }),

	// 创建作者信息
	create: (data: Omit<AuthorInfo, '_id' | 'createdAt' | 'updatedAt'>) =>
		api.post<AuthorInfo>('/api/admin/authorInfo/create', { authorInfo: data }),

	// 更新作者信息
	update: (data: Partial<AuthorInfo>) =>
		api.put<AuthorInfo>('/api/admin/authorInfo/update', { authorInfo: data }),

	// 删除作者信息（支持批量）
	delete: (ids: string) => api.delete(`/api/admin/authorInfo/delete?ids=${ids}`),
};

// 客户端作者信息API
export const clientAuthorInfoApi = {
	// 获取正在使用的作者信息
	getAuthorInfo: () => api.get<AuthorInfo>('/api/client/authorInfo/active'),
};
