import { api } from '~/utils/util.fetch';
import type { SiteInfo, PaginationResponse } from './types';

// 站点信息 API
export const siteInfoApi = {
	// 获取站点信息列表
	getList: (params?: { keywords?: string; page?: number; pageSize?: number }) =>
		api.get<PaginationResponse<SiteInfo>>('/api/admin/siteInfo/list', { query: params }),

	// 创建站点信息
	create: (data: Omit<SiteInfo, '_id' | 'createdAt' | 'updatedAt'>) =>
		api.post<SiteInfo>('/api/admin/siteInfo/create', { siteInfo: data }),

	// 更新站点信息
	update: (data: Partial<SiteInfo>) =>
		api.put<SiteInfo>('/api/admin/siteInfo/update', { siteInfo: data }),

	// 删除站点信息
	delete: (ids: string) => api.delete(`/api/admin/siteInfo/delete?ids=${ids}`),
};

// 客户端站点信息API
export const clientSiteInfoApi = {
	// 获取正在使用的站点信息
	getSiteInfo: () => api.get<SiteInfo>('/api/client/siteInfo/active'),
};
