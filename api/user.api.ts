import { api } from '~/utils/util.fetch';
import type { AdminUser, AdminRole } from './types';

// 管理员用户 API
export const adminUserApi = {
	// 获取用户列表
	getList: (params?: { keywords?: string; page?: number; limit?: number }) =>
		api.get<{ users: AdminUser[]; total: number }>('/api/admin/user/list', { query: params }),

	// 创建用户
	create: (
		data: Omit<AdminUser, '_id' | 'createdAt' | 'updatedAt' | 'password'> & { password: string }
	) => api.post('/api/admin/user/create', { user: data }),

	// 更新用户
	update: (data: Omit<AdminUser, '_id' | 'createdAt' | 'updatedAt' | 'password'>) =>
		api.put('/api/admin/user/update', { user: data }),

	// 更新个人资料
	updateSelf: (data: { avatar?: string; nickname?: string }) =>
		api.put('/api/admin/user/updateSelf', { user: data }),

	// 修改密码
	changePassword: (data: { oldPassword: string; newPassword: string }) =>
		api.put('/api/admin/user/changePassword', data),

	// 重置密码
	resetPassword: (username: string) => api.put('/api/admin/user/resetPassword', { username }),

	// 删除用户
	delete: (usernames: string) => api.delete(`/api/admin/user/delete?usernames=${usernames}`),

	// 登录
	login: (data: { username: string; password: string; captcha: string }) =>
		api.post<{ token: string; userInfo: AdminUser }>('/api/admin/user/login', data),
};

// 角色/权限 API
export const roleApi = {
	getList: (params?: { keywords?: string; page?: number; limit?: number }) =>
		api.get<{ list: AdminRole[]; total: number }>('/api/admin/role/list', { query: params }),
	create: (data: { role: Pick<AdminRole, 'name' | 'description'> }) =>
		api.post('/api/admin/role/create', data),
	update: (data: { name: string; description: string }) =>
		api.put('/api/admin/role/update', data),
	delete: (names: string) => api.delete(`/api/admin/role/delete?ids=${encodeURIComponent(names)}`),
};
