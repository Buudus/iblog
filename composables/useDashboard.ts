import { ElMessage } from 'element-plus';
import { dashboardApi, type DashboardStats, type RecentArticle, type AccessLog } from '~/api';

export function useDashboard() {
	// 统计数据
	const stats = ref<DashboardStats>({
		totalVisits: 0,
		todayVisits: 0,
		totalArticleViews: 0,
		todayArticleViews: 0,
		articleCount: 0,
		todayArticles: 0,
		publishedArticles: 0,
		draftArticles: 0,
		totalMessages: 0,
		todayMessages: 0,
		totalFiles: 0,
		totalFileSize: 0,
		imageFiles: 0,
		totalCategories: 0,
		totalTags: 0,
	});

	// 最近文章
	const recentArticles = ref<RecentArticle[]>([]);

	// 最近访问日志
	const recentAccessLogs = ref<AccessLog[]>([]);

	// 加载状态
	const loading = ref<boolean>(false);

	// 加载统计数据
	const loadStats = async (): Promise<void> => {
		try {
			const result = await dashboardApi.getStats();
			if (result.code === 200 && result.data) {
				stats.value = result.data;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '加载统计数据失败';
			ElMessage.error(errorMessage);
		}
	};

	// 加载最近文章
	const loadRecentArticles = async (limit: number = 7): Promise<void> => {
		try {
			const result = await dashboardApi.getRecentArticles(limit);
			if (result.code === 200 && result.data) {
				recentArticles.value = result.data;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '加载最近文章失败';
			console.error(errorMessage);
		}
	};

	// 加载最近访问日志
	const loadRecentAccessLogs = async (limit: number = 10): Promise<void> => {
		try {
			const result = await dashboardApi.getRecentAccessLogs(limit);
			if (result.code === 200 && result.data) {
				recentAccessLogs.value = result.data;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '加载最近访问日志失败';
			console.error(errorMessage);
		}
	};

	// 加载所有数据
	const loadAll = async (): Promise<void> => {
		loading.value = true;
		try {
			await Promise.all([loadStats(), loadRecentArticles(7), loadRecentAccessLogs(10)]);
		} finally {
			loading.value = false;
		}
	};

	// 格式化文件大小
	const formatFileSize = (bytes: number): string => {
		if (!bytes) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	};

	// 获取状态码标签类型
	const getStatusCodeType = (code: number): 'success' | 'info' | 'warning' | 'danger' | '' => {
		if (code >= 200 && code < 300) return 'success';
		if (code >= 300 && code < 400) return 'info';
		if (code >= 400 && code < 500) return 'warning';
		if (code >= 500) return 'danger';
		return '';
	};

	return {
		stats,
		recentArticles,
		recentAccessLogs,
		loading,
		loadStats,
		loadRecentArticles,
		loadRecentAccessLogs,
		loadAll,
		formatFileSize,
		getStatusCodeType,
	};
}
