import { ElMessage, ElMessageBox } from 'element-plus';
import { fileApi, type FileView } from '~/api';

// 扩展 FileView 类型，添加 mimetype 字段
export interface ExtendedFileView extends FileView {
	mimetype?: string;
	originalName?: string;
	path?: string;
	md5?: string;
}

export function useFile() {
	// 表格数据
	const tableData = ref<ExtendedFileView[]>([]);
	const loadingStatus = ref<boolean>(false);

	// 分页
	const total = ref<number>(0);
	const pageSize = ref<number>(20);
	const currentPage = ref<number>(1);
	const keywords = ref<string>('');
	const totalSize = ref<number>(0); // 文件总大小（字节）

	// 加载表格数据（所有文件）
	const loadTableData = async (mimetype?: string): Promise<void> => {
		loadingStatus.value = true;
		try {
			const result: any = await fileApi.getList({
				page: currentPage.value,
				limit: pageSize.value,
				keywords: keywords.value || undefined,
				mimetype: mimetype || undefined,
			});

			// 转换数据格式
			const files = result.data?.list || [];
			tableData.value = files.map((file: any) => ({
				...file,
				id: file.id || file._id || '',
				mimetype: file.mimetype || file.type || '',
				originalName: file.originalName,
				path: file.path,
				md5: file.md5,
			}));
			total.value = result.data?.total || 0;
			totalSize.value = result.data?.totalSize || 0;
			loadingStatus.value = false;
		} catch (error: unknown) {
			loadingStatus.value = false;
			const errorMessage = error instanceof Error ? error.message : '加载数据失败';
			ElMessage.error(errorMessage);
		}
	};

	// 加载图片文件列表
	const loadImageList = async (): Promise<void> => {
		loadingStatus.value = true;
		try {
			const result: any = await fileApi.getImageList({
				page: currentPage.value,
				pageSize: pageSize.value,
			});

			// 转换数据格式
			const files = result.data?.list || [];
			tableData.value = files.map((file: any) => ({
				...file,
				id: file.id || file._id || '',
				mimetype: file.mimetype || file.type || '',
				originalName: file.originalName,
				path: file.path,
				md5: file.md5,
			}));
			total.value = result.data?.total || 0;
			totalSize.value = result.data?.totalSize || 0;
			loadingStatus.value = false;
		} catch (error: unknown) {
			loadingStatus.value = false;
			const errorMessage = error instanceof Error ? error.message : '加载数据失败';
			ElMessage.error(errorMessage);
		}
	};

	// 搜索
	const handleSearch = async (keyword: string, mimetype?: string): Promise<void> => {
		keywords.value = keyword;
		currentPage.value = 1;
		if (mimetype === 'image') {
			await loadImageList();
		} else {
			await loadTableData(mimetype);
		}
	};

	// 分页变化
	const handleCurrentChange = async (page: number, mimetype?: string): Promise<void> => {
		currentPage.value = page;
		if (mimetype === 'image') {
			await loadImageList();
		} else {
			await loadTableData(mimetype);
		}
	};

	const handleSizeChange = async (size: number, mimetype?: string): Promise<void> => {
		pageSize.value = size;
		currentPage.value = 1;
		if (mimetype === 'image') {
			await loadImageList();
		} else {
			await loadTableData(mimetype);
		}
	};

	// 删除单个文件
	const handleDelete = async (row: ExtendedFileView, mimetype?: string): Promise<void> => {
		await ElMessageBox.confirm(`确定要删除文件 "${row.name}" 吗？`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const result = await fileApi.delete(row._id);
				if (result.code === 200) {
					ElMessage.success(result.message || '删除成功');
					if (mimetype === 'image') {
						await loadImageList();
					} else {
						await loadTableData(mimetype);
					}
				} else {
					ElMessage.error(result.message || '删除失败');
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '取消删除' });
			});
	};

	// 批量删除文件
	const handleDeleteMany = async (rows: ExtendedFileView[], mimetype?: string): Promise<void> => {
		await ElMessageBox.confirm(
			`确定要删除选中的 ${rows.length} 个文件吗？删除后无法恢复。`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			},
		)
			.then(async () => {
				const ids = rows.map((row) => row._id).join(',');
				const result = await fileApi.delete(ids);
				if (result.code === 200) {
					ElMessage.success(result.message || '删除成功');
					if (mimetype === 'image') {
						await loadImageList();
					} else {
						await loadTableData(mimetype);
					}
				} else {
					ElMessage.error(result.message || '删除失败');
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '取消删除' });
			});
	};

	// 判断是否为图片
	const isImage = (mimetype?: string): boolean => {
		return mimetype?.startsWith('image/') || false;
	};

	// 格式化文件大小
	const formatFileSize = (bytes: number): string => {
		if (!bytes) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	};

	return {
		// 数据
		tableData,
		loadingStatus,
		total,
		pageSize,
		currentPage,
		keywords,
		totalSize,
		// 方法
		loadTableData,
		loadImageList,
		handleSearch,
		handleCurrentChange,
		handleSizeChange,
		handleDelete,
		handleDeleteMany,
		isImage,
		formatFileSize,
	};
}
