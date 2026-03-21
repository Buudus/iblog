import { defineStore } from 'pinia';
import { categoryApi, type CategoryWithChildren } from '~/api';

export const useCategoryStore = defineStore('category', {
	state: () => ({
		categories: [] as CategoryWithChildren[],
		loading: false,
	}),

	actions: {
		// 加载分类列表
		async loadCategories(): Promise<void> {
			this.loading = true;
			try {
				const result = await categoryApi.getList();
				this.categories = Array.isArray(result) ? result : [];
			} catch (error: unknown) {
				console.error('加载分类列表失败:', error);
				this.categories = [];
			} finally {
				this.loading = false;
			}
		},
	},
});
