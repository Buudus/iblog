import { api } from '~/utils/util.fetch';
import type { LeaveMessage, PaginationResponse } from './types';

// 留言管理API
export const leaveMessageApi = {
	// 获取留言列表
	getList: (params?: { page?: number; pageSize?: number; keywords?: string }) =>
		api.get<PaginationResponse<LeaveMessage>>('/api/admin/leaveMessage/list', { query: params }),

	// 删除留言（支持单个和批量，ids 为逗号分隔的字符串）
	delete: (ids: string) => api.delete(`/api/admin/leaveMessage/delete?ids=${ids}`),

	// 获取单个留言
	getById: (id: string) => api.get<LeaveMessage>(`/api/admin/leaveMessage/${id}`),

	// 批量删除留言
	deleteMany: (ids: string[]) => api.post('/api/admin/leaveMessage/deleteMany', { ids }),

	// 更新留言状态
	updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected') =>
		api.put(`/api/admin/leaveMessage/status/${id}`, { status }),

	// 批量更新状态
	updateStatusMany: (ids: string[], status: 'pending' | 'approved' | 'rejected') =>
		api.post('/api/admin/leaveMessage/statusMany', { ids, status }),
};

// 客户端留言API
interface ClientLeaveMessagePayload {
	concat: string;
	content: string;
	captcha: string;
}

export const clientLeaveMessageApi = {
	// 提交留言
	submit: (data: ClientLeaveMessagePayload) =>
		api.post<LeaveMessage>('/api/client/leaveMessage/publish', {
			captcha: data.captcha,
			leaveMessage: {
				concat: data.concat,
				content: data.content,
			},
		}),

	// 获取留言列表（已审核的，预留）
	getMessages: (params?: { page?: number; pageSize?: number }) =>
		api.get<PaginationResponse<LeaveMessage>>('/api/client/leaveMessage', { query: params }),
};
