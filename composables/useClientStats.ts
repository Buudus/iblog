import { siteStatsApi, type ClientSiteStats } from '~/api';

export function useClientStats() {
	const stats = useState<ClientSiteStats | null>('client-site-stats', () => null);
	const loading = useState<boolean>('client-site-stats-loading', () => false);

	const fetchStats = async (force = false): Promise<void> => {
		if (loading.value) return;
		if (stats.value && !force) return;
		loading.value = true;
		try {
			const result = await siteStatsApi.getStats();
			if (result.code === 200 && result.data) {
				stats.value = result.data;
			}
		} catch (error) {
			console.error('获取站点统计失败', error);
		} finally {
			loading.value = false;
		}
	};

	const formatted = computed(() => {
		const formatNumber = (value?: number): string => {
			if (value === undefined || value === null) return '--';
			if (value === 0) return '0';
			if (value >= 10000) return `${(value / 10000).toFixed(1)}W`;
			if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
			return String(value);
		};

		return {
			article: formatNumber(stats.value?.articleCount),
			category: formatNumber(stats.value?.categoryCount),
			visit: formatNumber(stats.value?.visitCount),
		};
	});

	return {
		stats,
		loading,
		formatted,
		fetchStats,
	};
}
