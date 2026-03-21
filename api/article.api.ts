import { api } from '~/utils/util.fetch';
import type { Article, PaginationResponse } from './types';

// 文章管理API
export const articleApi = {
	// 获取文章列表
	getList: (params?: {
		page?: number;
		pageSize?: number;
		status?: string;
		categoryId?: string;
		keywords?: string;
	}) => api.get<PaginationResponse<Article>>('/api/admin/article/list', { query: params }),

	// 创建文章
	create: (data: Omit<Article, '_id' | 'likes' | 'views' | 'createdAt' | 'updatedAt'>) =>
		api.post<Article>('/api/admin/article/create', data),

	// 更新文章
	update: (data: { article: Record<string, unknown> }) =>
		api.put<Article>(`/api/admin/article/update`, data),

	// 删除文章
	delete: (id: string) => api.delete('/api/admin/article/delete', { query: { ids: id } }),

	// 获取单个文章
	getById: (id: string) => api.get<Article>(`/api/admin/article/${id}`),

	// 发布文章
	publish: (data: { article: Partial<Article> }) => api.post('/api/admin/article/publish', data),

	// 批量删除文章
	deleteMany: (ids: string[]) =>
		api.delete('/api/admin/article/delete', { query: { ids: ids.join(',') } }),

	// 批量发布文章
	publishMany: (ids: string[]) => api.post('/api/admin/article/publishMany', { ids }),
};

// 客户端文章API
export const clientArticleApi = {
	// 获取文章列表
	getArticles: (params?: {
		page?: number;
		limit?: number;
		category?: string;
		subCategory?: string;
		keywords?: string;
	}) =>
		api.get<{ articles: Article[]; total: number }>('/api/client/article/list', {
			query: params,
		}),

	// 获取文章详情
	getArticle: (id: string) =>
		api.get<import('~/composables/useClientArticle').ClientArticle>('/api/client/article/details', {
			query: { id },
		}),

	// 获取热门文章 TOP3
	getHotArticles: () => api.get<Article[]>('/api/client/article/article_top3'),

	// 获取标签列表
	getTags: () => api.get<Array<{ name: string; count: number }>>('/api/client/article/tags'),

	recordBehavior: (data: {
		articleId: string;
		like?: boolean;
		browseProgress?: number;
		browsingDuration?: number;
	}) => api.post('/api/client/article/record_behavior', data),
};
