import { api } from '~/utils/util.fetch';
import type { Category } from './types';

// 分类类型（包含文章数量和子分类）
export interface CategoryWithChildren extends Category {
	articleCount?: number;
	children?: SubCategoryWithCount[];
}

export interface SubCategoryWithCount {
	_id?: string;
	name: string;
	description: string;
	parentId: string;
	articleCount?: number;
	createdAt?: string;
	updatedAt?: string;
}

// 分类管理API
export const categoryApi = {
	// 获取分类列表（树形结构，包含文章数量，使用客户端接口，逻辑相同）
	getList: async () => {
		const result = await api.get<CategoryWithChildren[]>('/api/client/category/list');
		// API 返回格式是 { code, message, data }，提取 data 字段
		if (result && result.code === 200 && result.data) {
			return result.data;
		}
		return [] as CategoryWithChildren[];
	},

	// 创建一级分类
	createParent: (data: { name: string; description: string }) =>
		api.post('/api/admin/category/createParent', { category: data }),

	// 创建二级分类
	createSub: (data: { name: string; description: string; parentId: string }) =>
		api.post('/api/admin/category/createSub', { subCategory: data }),

	// 更新一级分类
	updateParent: (data: { id: string; name?: string; description?: string }) =>
		api.put('/api/admin/category/updateParent', { category: data }),

	// 更新二级分类
	updateSub: (data: { id: string; name?: string; description?: string }) =>
		api.put('/api/admin/category/updateSub', { category: data }),

	// 删除一级分类（会删除其下的所有二级分类）
	deleteParent: (ids: string) => api.delete(`/api/admin/category/deleteParent?ids=${ids}`),

	// 删除二级分类
	deleteSub: (ids: string) => api.delete(`/api/admin/category/deleteSub?ids=${ids}`),
};

// 客户端分类API
export const clientCategoryApi = {
	// 获取分类列表
	getCategories: () => api.get<Category[]>('/api/client/category'),
};
