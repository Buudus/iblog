import { ElMessage, ElMessageBox } from 'element-plus';
import { roleApi, type AdminRole } from '~/api';

export function useRole() {
	const tableData = ref<AdminRole[]>([]);
	const loadingStatus = ref<boolean>(false);

	const total = ref<number>(0);
	const pageSize = ref<number>(20);
	const currentPage = ref<number>(1);
	const keywords = ref<string>('');

	const loadTableData = async (): Promise<void> => {
		loadingStatus.value = true;
		try {
			const result = await roleApi.getList({
				keywords: keywords.value || undefined,
				page: currentPage.value,
				limit: pageSize.value,
			});
			tableData.value = result.data?.list ?? [];
			total.value = result.data?.total ?? 0;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '加载数据失败';
			ElMessage.error(errorMessage);
		} finally {
			loadingStatus.value = false;
		}
	};

	const handleSearch = async (keyword: string): Promise<void> => {
		keywords.value = keyword;
		currentPage.value = 1;
		await loadTableData();
	};

	const handleCurrentChange = async (page: number): Promise<void> => {
		currentPage.value = page;
		await loadTableData();
	};

	const handleSizeChange = async (size: number): Promise<void> => {
		pageSize.value = size;
		currentPage.value = 1;
		await loadTableData();
	};

	const handleCreate = async (
		formData: Pick<AdminRole, 'name' | 'description'>
	): Promise<boolean> => {
		try {
			const result = await roleApi.create({ role: formData });
			if (result.code === 201 || result.code === 200) {
				ElMessage.success(result.message ?? '创建成功');
				await loadTableData();
				return true;
			}
			ElMessage.error(result.message ?? '创建失败');
			return false;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '创建失败，请重试';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	const handleUpdate = async (formData: {
		name: string;
		description: string;
	}): Promise<boolean> => {
		try {
			const result = await roleApi.update({
				name: formData.name,
				description: formData.description,
			});
			if (result.code === 200) {
				ElMessage.success(result.message ?? '更新成功');
				await loadTableData();
				return true;
			}
			ElMessage.error(result.message ?? '更新失败');
			return false;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '更新失败，请重试';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	const handleDelete = async (row: AdminRole): Promise<void> => {
		await ElMessageBox.confirm(
			`确定要删除权限「${row.name}」吗？删除后无法恢复。`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(async () => {
				const result = await roleApi.delete(row.name);
				if (result.code === 200) {
					ElMessage.success(result.message);
					await loadTableData();
				} else {
					ElMessage.error(result.message ?? '删除失败');
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '已取消' });
			});
	};

	const handleDeleteMany = async (rows: AdminRole[]): Promise<void> => {
		if (rows.length === 0) {
			ElMessage.warning('请先选择要删除的项');
			return;
		}
		const names = rows.map((r) => r.name);
		if (names.includes('admin')) {
			ElMessage.error('禁止删除超级管理员权限');
			return;
		}
		await ElMessageBox.confirm(
			`确定要删除选中的 ${rows.length} 项权限吗？删除后无法恢复。`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(async () => {
				const result = await roleApi.delete(names.join(','));
				if (result.code === 200) {
					ElMessage.success(result.message);
					await loadTableData();
				} else {
					ElMessage.error(result.message ?? '删除失败');
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '已取消' });
			});
	};

	return {
		tableData,
		loadingStatus,
		total,
		pageSize,
		currentPage,
		loadTableData,
		handleSearch,
		handleCurrentChange,
		handleSizeChange,
		handleCreate,
		handleUpdate,
		handleDelete,
		handleDeleteMany,
	};
}
