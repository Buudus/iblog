import { ElMessage, ElMessageBox } from 'element-plus';
import { adminUserApi, fileApi, type AdminUser, type FileView } from '~/api';

export function useAdminUser() {
	// 表格数据
	const tableData = ref<AdminUser[]>([]);
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
			const result = await adminUserApi.getList({
				keywords: keywords.value,
				page: currentPage.value,
				limit: pageSize.value,
			});

			tableData.value = result.data.users || [];
			total.value = result.data.total || 0;
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

	// 创建
	const handleCreate = async (
		formData: Omit<AdminUser, '_id' | 'createdAt' | 'updatedAt' | 'password'> & { password: string }
	): Promise<boolean> => {
		try {
			const result = await adminUserApi.create(formData);
			if (result.code === 201 || result.code === 200) {
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

	// 更新
	const handleUpdate = async (
		formData: Omit<AdminUser, '_id' | 'createdAt' | 'updatedAt' | 'password'>
	): Promise<boolean> => {
		try {
			const result = await adminUserApi.update(formData);
			if (result.code === 200) {
				ElMessage.success(result.message || '更新成功');
				await loadTableData();
				return true;
			} else {
				ElMessage.error(result.message || '更新失败');
				return false;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '更新失败';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	// 重置密码
	const handleResetPassword = async (username: string): Promise<boolean> => {
		try {
			const result = await adminUserApi.resetPassword(username);
			if (result.code === 200) {
				ElMessage.success(result.message || '重置成功');
				return true;
			} else {
				ElMessage.error(result.message || '重置失败');
				return false;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '重置失败';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	// 删除单个
	const handleDelete = async (row: AdminUser): Promise<void> => {
		await ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const result = await adminUserApi.delete(row.username);
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
	const handleDeleteMany = async (rows: AdminUser[]): Promise<void> => {
		await ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const usernames: string = rows.map((row) => row.username).join(',');
				const result = await adminUserApi.delete(usernames);

				if (result.code === 200) {
					ElMessage.success(result.message);
					await loadTableData();
					return;
				}

				ElMessage.error(result.message || '删除失败');
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '取消删除' });
			});
	};

	// 文件上传
	const handleUpload = async (file: File, onSuccess: (url: string) => void): Promise<void> => {
		try {
			const form = new FormData();
			form.append('files', file);

			const result = await fileApi.upload(form);
			const url = (result.data as FileView[])[0].url;
			onSuccess(url);
			ElMessage.success('图片上传成功');
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '文件上传失败';
			ElMessage.error(errorMessage);
		}
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
		handleCreate,
		handleUpdate,
		handleDelete,
		handleDeleteMany,
		handleUpload,
		handleResetPassword,
	};
}
