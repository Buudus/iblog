import { ElMessage, ElMessageBox } from 'element-plus';
import { leaveMessageApi, type LeaveMessage } from '~/api';

export function useLeaveMessage() {
	// 表格数据
	const tableData = ref<LeaveMessage[]>([]);
	const loadingStatus = ref<boolean>(false);

	// 分页
	const total = ref<number>(0);
	const pageSize = ref<number>(20);
	const currentPage = ref<number>(1);
	const keywords = ref<string>('');

	// 加载表格数据
	const loadTableData = async (): Promise<void> => {
		loadingStatus.value = true;
		try {
			const result = await leaveMessageApi.getList({
				keywords: keywords.value,
				page: currentPage.value,
				pageSize: pageSize.value,
			});

			tableData.value = result.data.list;
			total.value = result.data.total;
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
	const handleDelete = async (row: LeaveMessage): Promise<void> => {
		await ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				// 后端 API 使用 query 参数 ids（逗号分隔）
				const ids = row._id as string;
				const result = await leaveMessageApi.delete(ids);
				if (result.code === 200) {
					ElMessage.success(result.message);
					await loadTableData();
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '取消删除' });
			});
	};

	// 批量删除
	const handleDeleteMany = async (rows: LeaveMessage[]): Promise<void> => {
		await ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				// 后端 API 使用 query 参数 ids（逗号分隔）
				const ids: string = rows.map((row) => row._id as string).join(',');
				const result = await leaveMessageApi.delete(ids);

				if (result.code === 200) {
					ElMessage.success(result.message);
					await loadTableData();
				} else {
					ElMessage.error(result.message || '删除失败');
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '取消删除' });
			});
	};

	return {
		// 数据
		tableData,
		loadingStatus,
		total,
		pageSize,
		currentPage,
		keywords,
		// 方法
		loadTableData,
		handleSearch,
		handleCurrentChange,
		handleSizeChange,
		handleDelete,
		handleDeleteMany,
	};
}
