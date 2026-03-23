import { ElMessage } from 'element-plus';
import { dashboardApi, type DataViewResponse } from '~/api';

export function useDataView() {
	const data = ref<DataViewResponse>({
		todayVisits: 0,
		hotArticles: [],
		lineChart: { category: [], data: [], title: '最近七天文章浏览时长(分钟)' },
		barChart: { category: [], data: [], title: '最近七天浏览量最高的分类 TOP5' },
		mapSubTitle: '暂无访问数据',
		mapData: [],
	});

	const loading = ref(false);

	const loadData = async (): Promise<void> => {
		loading.value = true;
		try {
			const result = await dashboardApi.getDataView();
			if (result.code === 200 && result.data) {
				data.value = result.data;
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : '加载数据概览失败';
			ElMessage.error(msg);
		} finally {
			loading.value = false;
		}
	};

	return {
		data,
		loading,
		loadData,
	};
}
