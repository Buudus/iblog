import { api } from '~/utils/util.fetch';
import type { AccessLog } from './accessLog.api';

// 最近文章类型（简化版）
export interface RecentArticle {
	_id?: string;
	title: string;
	views?: number;
	isPublished?: boolean;
	createdAt?: string;
}

// 统计数据接口
export interface DashboardStats {
	totalVisits: number;
	todayVisits: number;
	totalArticleViews: number;
	todayArticleViews: number;
	articleCount: number;
	todayArticles: number;
	publishedArticles: number;
	draftArticles: number;
	totalMessages: number;
	todayMessages: number;
	totalFiles: number;
	totalFileSize: number;
	imageFiles: number;
	totalCategories: number;
	totalTags: number;
}

// 数据概览页类型
export interface DataViewHotArticle {
	_id: string;
	cover: string;
	title: string;
	views: number;
	likes: number;
	totalBrowsingDurationMinutes: number;
}

export interface DataViewResponse {
	todayVisits: number;
	hotArticles: DataViewHotArticle[];
	lineChart: {
		category: string[];
		data: number[];
		title: string;
	};
	barChart: {
		category: string[];
		data: number[];
		title: string;
	};
	mapSubTitle: string;
	mapData: Array<{ name: string; value: number }>;
}

// 后台首页API
export const dashboardApi = {
	// 获取统计数据
	getStats: () => api.get<DashboardStats>('/api/admin/dashboard/stats'),

	// 获取最近文章
	getRecentArticles: (limit?: number) =>
		api.get<RecentArticle[]>('/api/admin/dashboard/recentArticles', {
			query: { limit: limit || 7 },
		}),

	// 获取最近访问日志
	getRecentAccessLogs: (limit?: number) =>
		api.get<AccessLog[]>('/api/admin/dashboard/recentAccessLogs', {
			query: { limit: limit || 10 },
		}),

	// 获取数据概览
	getDataView: () => api.get<DataViewResponse>('/api/admin/dashboard/dataView'),
};
