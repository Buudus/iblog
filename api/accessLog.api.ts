import { api } from '~/utils/util.fetch';
import type { PaginationResponse } from './types';

// 访问日志类型
export interface AccessLog {
	_id?: string;
	ip: string;
	userAgent: string;
	path: string; // 后端模型中使用的是path，不是url
	method: string;
	isAdmin?: boolean;
	adminId?: string | null;
	regionInfo: {
		country: string;
		province: string;
		city: string;
		isp: string;
	};
	statusCode: number;
	createdAt?: string;
	updatedAt?: string;
}

// 访问日志API
export const accessLogApi = {
	// 获取访问日志列表
	getList: (params?: {
		page?: number;
		pageSize?: number;
		keywords?: string;
		statusCode?: number;
	}) => api.get<PaginationResponse<AccessLog>>('/api/admin/accessLog/list', { query: params }),

	// 删除访问日志（支持单个或批量，使用query参数ids，逗号分隔）
	delete: (ids: string) => api.delete('/api/admin/accessLog/delete', { query: { ids } }),

	// 清空访问日志
	clear: () => api.delete('/api/admin/accessLog/clear'),
};
