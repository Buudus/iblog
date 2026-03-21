import { ElMessage, ElMessageBox } from 'element-plus';
import { categoryApi, type CategoryWithChildren, type SubCategoryWithCount } from '~/api';

export function useCategory() {
	// 表格数据
	const tableData = ref<CategoryWithChildren[]>([]);
	const loadingStatus = ref<boolean>(false);

	// 加载表格数据
	const loadTableData = async (): Promise<void> => {
		loadingStatus.value = true;
		try {
			const result = await categoryApi.getList();
			// getList 已经返回数组，直接使用
			tableData.value = result;
			loadingStatus.value = false;
		} catch (error: unknown) {
			loadingStatus.value = false;
			const errorMessage = error instanceof Error ? error.message : '加载数据失败';
			ElMessage.error(errorMessage);
		}
	};

	// 创建一级分类
	const handleCreateParent = async (data: {
		name: string;
		description: string;
	}): Promise<boolean> => {
		try {
			const result = await categoryApi.createParent(data);
			if (result.code === 200 || result.code === 201) {
				ElMessage.success(result.message || '创建成功');
				await loadTableData();
				return true;
			} else {
				ElMessage.error(result.message || '创建失败');
				return false;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '操作失败，请重试';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	// 创建二级分类
	const handleCreateSub = async (data: {
		name: string;
		description: string;
		parentId: string;
	}): Promise<boolean> => {
		try {
			const result = await categoryApi.createSub(data);
			if (result.code === 200 || result.code === 201) {
				ElMessage.success(result.message || '创建成功');
				await loadTableData();
				return true;
			} else {
				ElMessage.error(result.message || '创建失败');
				return false;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '操作失败，请重试';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	// 更新一级分类
	const handleUpdateParent = async (data: {
		id: string;
		name?: string;
		description?: string;
	}): Promise<boolean> => {
		try {
			const result = await categoryApi.updateParent(data);
			if (result.code === 200) {
				ElMessage.success(result.message || '更新成功');
				await loadTableData();
				return true;
			} else {
				ElMessage.error(result.message || '更新失败');
				return false;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '操作失败，请重试';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	// 更新二级分类
	const handleUpdateSub = async (data: {
		id: string;
		name?: string;
		description?: string;
	}): Promise<boolean> => {
		try {
			const result = await categoryApi.updateSub(data);
			if (result.code === 200) {
				ElMessage.success(result.message || '更新成功');
				await loadTableData();
				return true;
			} else {
				ElMessage.error(result.message || '更新失败');
				return false;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '操作失败，请重试';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	// 删除一级分类
	const handleDeleteParent = async (row: CategoryWithChildren): Promise<void> => {
		await ElMessageBox.confirm(
			`删除一级分类 "${row.name}" 将同时删除其下的所有二级分类，删除后无法恢复，是否确认删除？`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(async () => {
				const result = await categoryApi.deleteParent(row._id as string);
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

	// 删除二级分类
	const handleDeleteSub = async (row: SubCategoryWithCount): Promise<void> => {
		await ElMessageBox.confirm(`删除二级分类 "${row.name}" 后无法恢复，是否确认删除？`, '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const result = await categoryApi.deleteSub(row._id as string);
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

	// 批量删除一级分类
	const handleDeleteManyParent = async (rows: CategoryWithChildren[]): Promise<void> => {
		await ElMessageBox.confirm(
			`删除选中的 ${rows.length} 个一级分类将同时删除其下的所有二级分类，删除后无法恢复，是否确认删除？`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(async () => {
				const ids: string = rows.map((row) => row._id as string).join(',');
				const result = await categoryApi.deleteParent(ids);

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
		handleCreateParent,
		handleCreateSub,
		handleUpdateParent,
		handleUpdateSub,
		handleDeleteParent,
		handleDeleteSub,
		handleDeleteManyParent,
	};
}
