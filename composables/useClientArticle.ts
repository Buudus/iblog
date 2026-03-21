import { clientArticleApi, type Article } from '~/api';

export interface ClientArticle extends Article {
	likes: number;
	category?: { _id: string; name: string } | string;
	subCategory?: { _id: string; name: string } | string;
	author?: { _id: string; nickname: string; username: string; avatar: string } | string;
	isPublished?: boolean;
}

export function useClientArticle() {
	// 文章列表
	const articles = ref<ClientArticle[]>([]);
	const loading = ref<boolean>(false);

	// 分页
	const total = ref<number>(0);
	const pageSize = ref<number>(20);
	const currentPage = ref<number>(1);
	const keywords = ref<string>('');
	const category = ref<string>('');
	const subCategory = ref<string>('');

	// 加载文章列表
	const loadArticles = async (): Promise<void> => {
		loading.value = true;
		try {
			const result = await clientArticleApi.getArticles({
				page: currentPage.value,
				limit: pageSize.value,
				keywords: keywords.value || undefined,
				category: category.value || undefined,
				subCategory: subCategory.value || undefined,
			});

			if (result.code === 200 && result.data) {
				articles.value = result.data.articles || [];
				total.value = result.data.total || 0;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '加载文章失败';
			console.error(errorMessage);
		} finally {
			loading.value = false;
		}
	};

	// 搜索
	const handleSearch = async (keyword: string): Promise<void> => {
		keywords.value = keyword;
		currentPage.value = 1;
		await loadArticles();
	};

	// 分页变化
	const handlePageChange = async (page: number): Promise<void> => {
		currentPage.value = page;
		await loadArticles();
		// 滚动到顶部
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	// 设置分类筛选
	const setCategoryFilter = async (catId: string, subCatId?: string): Promise<void> => {
		category.value = catId;
		subCategory.value = subCatId || '';
		currentPage.value = 1;
		await loadArticles();
	};

	// 清除筛选
	const clearFilters = async (): Promise<void> => {
		keywords.value = '';
		category.value = '';
		subCategory.value = '';
		currentPage.value = 1;
		await loadArticles();
	};

	// 清除搜索关键词
	const clearSearch = async (): Promise<void> => {
		keywords.value = '';
		currentPage.value = 1;
		await loadArticles();
	};

	// 格式化日期（从"2025年09月30日 12:00:00"转换为"2025-09-30"）
	const formatDate = (dateStr: string): string => {
		if (!dateStr) return '';
		// 匹配"2025年09月30日 12:00:00"格式
		const match = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日/);
		if (match) {
			return `${match[1]}-${match[2]}-${match[3]}`;
		}
		return dateStr;
	};

	// 格式化浏览量
	const formatViews = (views: number): string => {
		if (!views) return '0';
		if (views < 1000) return String(views);
		if (views < 10000) return `${(views / 1000).toFixed(1)}K`;
		return `${(views / 10000).toFixed(1)}W`;
	};

	// 获取文章摘要（从content中提取，去除HTML标签）
	const getSummary = (content: string, maxLength: number = 150): string => {
		if (!content) return '';
		// 去除HTML标签
		const text = content
			.replace(/<[^>]*>/g, '')
			.replace(/\s+/g, ' ')
			.trim();
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + '...';
	};

	// 获取分类名称
	const getCategoryName = (cat: ClientArticle['category']): string => {
		if (!cat) return '未分类';
		if (typeof cat === 'string') return cat;
		return cat.name || '未分类';
	};

	return {
		// 数据
		articles,
		loading,
		total,
		pageSize,
		currentPage,
		keywords,
		category,
		subCategory,
		// 方法
		loadArticles,
		handleSearch,
		handlePageChange,
		setCategoryFilter,
		clearFilters,
		clearSearch,
		// 工具方法
		formatDate,
		formatViews,
		getSummary,
		getCategoryName,
	};
}
