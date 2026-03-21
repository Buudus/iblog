import { ElMessage, ElMessageBox } from 'element-plus';
import { authorInfoApi, fileApi, type AuthorInfo, type FileView } from '~/api';

export function useAuthorInfo() {
	// 表格数据
	const tableData = ref<AuthorInfo[]>([]);
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
			const result = await authorInfoApi.getList({
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

	// 创建
	const handleCreate = async (
		formData: Omit<AuthorInfo, '_id' | 'createdAt' | 'updatedAt'>
	): Promise<boolean> => {
		try {
			await authorInfoApi.create(formData);
			ElMessage.success('添加成功');
			await loadTableData();
			return true;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '操作失败，请重试';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	// 更新
	const handleUpdate = async (
		formData: Omit<AuthorInfo, 'createdAt' | 'updatedAt'>
	): Promise<boolean> => {
		try {
			const result = await authorInfoApi.update(formData);
			if (result.code === 200) {
				ElMessage.success('更新成功');
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

	// 删除单个
	const handleDelete = async (row: AuthorInfo): Promise<void> => {
		await ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const result = await authorInfoApi.delete(row._id as string);
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
	const handleDeleteMany = async (rows: AuthorInfo[]): Promise<void> => {
		await ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const ids: string = rows.map((row) => row._id).join(',');
				const result = await authorInfoApi.delete(ids);

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
	};
}
