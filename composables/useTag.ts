import { ElMessage, ElMessageBox } from 'element-plus';
import { tagApi, type Tag } from '~/api';

export function useTag() {
	// 表格数据
	const tableData = ref<Tag[]>([]);
	const loadingStatus = ref<boolean>(false);

	// 加载表格数据
	const loadTableData = async (): Promise<void> => {
		loadingStatus.value = true;
		try {
			const result = await tagApi.getList();
			tableData.value = result.data || [];
			loadingStatus.value = false;
		} catch (error: unknown) {
			loadingStatus.value = false;
			const errorMessage = error instanceof Error ? error.message : '加载数据失败';
			ElMessage.error(errorMessage);
		}
	};

	// 删除单个标签
	const handleDelete = async (row: Tag): Promise<void> => {
		await ElMessageBox.confirm(
			`删除标签 "${row.name}" 将删除所有包含该标签的文章（共 ${row.count} 篇），删除后无法恢复，是否确认删除？`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(async () => {
				const result = await tagApi.delete(row.name);
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

	// 批量删除标签
	const handleDeleteMany = async (rows: Tag[]): Promise<void> => {
		const totalCount = rows.reduce((sum, row) => sum + row.count, 0);
		await ElMessageBox.confirm(
			`删除选中的 ${rows.length} 个标签将删除所有包含这些标签的文章（共 ${totalCount} 篇），删除后无法恢复，是否确认删除？`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(async () => {
				const tags: string = rows.map((row) => row.name).join(',');
				const result = await tagApi.delete(tags);

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
		// 方法
		loadTableData,
		handleDelete,
		handleDeleteMany,
	};
}
