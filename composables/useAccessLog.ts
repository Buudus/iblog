import { ElMessage, ElMessageBox } from 'element-plus';
import { accessLogApi, type AccessLog } from '~/api';

export function useAccessLog() {
	// 表格数据
	const tableData = ref<AccessLog[]>([]);
	const loadingStatus = ref<boolean>(false);

	// 分页
	const total = ref<number>(0);
	const pageSize = ref<number>(20);
	const currentPage = ref<number>(1);
	const keywords = ref<string>('');
	const statusCode = ref<number | undefined>(undefined);

	// 加载表格数据
	const loadTableData = async (): Promise<void> => {
		loadingStatus.value = true;
		try {
			const result = await accessLogApi.getList({
				keywords: keywords.value || undefined,
				statusCode: statusCode.value,
				page: currentPage.value,
				pageSize: pageSize.value,
			});

			tableData.value = result.data?.list || [];
			total.value = result.data?.total || 0;
			loadingStatus.value = false;
		} catch (error: unknown) {
			loadingStatus.value = false;
			const errorMessage = error instanceof Error ? error.message : '加载数据失败';
			ElMessage.error(errorMessage);
		}
	};

	// 搜索
	const handleSearch = async (keyword: string): Promise<void> => {
		keywords.value = keyword;
		currentPage.value = 1;
		await loadTableData();
	};

	// 状态码筛选
	const handleStatusCodeFilter = async (code: number | undefined): Promise<void> => {
		statusCode.value = code;
		currentPage.value = 1;
		await loadTableData();
	};

	// 分页变化
	const handleCurrentChange = async (page: number): Promise<void> => {
		currentPage.value = page;
		await loadTableData();
	};

	const handleSizeChange = async (size: number): Promise<void> => {
		pageSize.value = size;
		currentPage.value = 1;
		await loadTableData();
	};

	// 删除单个
	const handleDelete = async (row: AccessLog): Promise<void> => {
		await ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const id = row._id as string;
				const result = await accessLogApi.delete(id);
				if (result.code === 200) {
					ElMessage.success(result.message || '删除成功');
					await loadTableData();
				} else {
					ElMessage.error(result.message || '删除失败');
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '取消删除' });
			});
	};

	// 批量删除
	const handleDeleteMany = async (rows: AccessLog[]): Promise<void> => {
		await ElMessageBox.confirm(
			`确定要删除选中的 ${rows.length} 条日志吗？删除后无法恢复。`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(async () => {
				const ids = rows.map((row) => row._id as string).join(',');
				const result = await accessLogApi.delete(ids);
				if (result.code === 200) {
					ElMessage.success(result.message || '删除成功');
					await loadTableData();
				} else {
					ElMessage.error(result.message || '删除失败');
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '取消删除' });
			});
	};

	// 清空所有日志
	const handleClear = async (): Promise<void> => {
		await ElMessageBox.confirm('确定要清空所有访问日志吗？此操作不可恢复！', '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const result = await accessLogApi.clear();
				if (result.code === 200) {
					ElMessage.success(result.message || '清空成功');
					await loadTableData();
				} else {
					ElMessage.error(result.message || '清空失败');
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '取消清空' });
			});
	};

	// 获取状态码标签类型
	const getStatusCodeType = (
		code: number
	): 'success' | 'info' | 'warning' | 'danger' | 'primary' => {
		if (code >= 200 && code < 300) return 'success';
		if (code >= 300 && code < 400) return 'info';
		if (code >= 400 && code < 500) return 'warning';
		if (code >= 500) return 'danger';
		return 'info';
	};

	return {
		// 数据
		tableData,
		loadingStatus,
		total,
		pageSize,
		currentPage,
		keywords,
		statusCode,
		// 方法
		loadTableData,
		handleSearch,
		handleStatusCodeFilter,
		handleCurrentChange,
		handleSizeChange,
		handleDelete,
		handleDeleteMany,
		handleClear,
		getStatusCodeType,
	};
}
