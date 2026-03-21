import { api } from '~/utils/util.fetch';
import type { FriendlyLink, PaginationResponse } from './types';

// 友情链接管理API
export const friendlyLinkApi = {
	// 获取友情链接列表
	getList: (params?: { page?: number; limit?: number; keywords?: string; status?: string }) =>
		api.get<PaginationResponse<FriendlyLink>>('/api/admin/friendlyLink/list', { query: params }),

	// 创建友情链接
	create: (data: Omit<FriendlyLink, '_id' | 'createdAt' | 'updatedAt'>) =>
		api.post<FriendlyLink>('/api/admin/friendlyLink/create', { friendlyLink: data }),

	// 更新友情链接
	update: (id: string, data: Partial<FriendlyLink>) =>
		api.put<FriendlyLink>(`/api/admin/friendlyLink/update`, { friendlyLink: { ...data, id } }),

	// 删除友情链接
	delete: (ids: string) => api.delete(`/api/admin/friendlyLink/delete?ids=${ids}`),

	// 更新状态
	updateStatus: (id: string, status: 'active' | 'inactive') =>
		api.put(`/api/admin/friendlyLink/status/${id}`, { status }),

	// 批量更新状态
	updateStatusMany: (ids: string[], status: 'pending' | 'approved' | 'rejected') =>
		api.put('/api/admin/friendlyLink/statusMany', { ids, status }),
};

// 客户端友情链接API
export const clientFriendlyLinkApi = {
	// 获取友情链接列表（只返回已审核通过的）
	getFriendlyLinks: () => api.get<FriendlyLink[]>('/api/client/friendlyLink/list'),

	// 申请友链
	apply: (data: {
		friendlyLink: Omit<FriendlyLink, '_id' | 'status' | 'createdAt' | 'updatedAt'>;
		captcha: string;
	}) => api.post('/api/client/friendlyLink/apply', data),
};
