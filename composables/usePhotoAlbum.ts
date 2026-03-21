import { ElMessage, ElMessageBox } from 'element-plus';
import { photoAlbumApi, type PhotoAlbum } from '~/api';
import type { UploadRawFile } from 'element-plus';

export function usePhotoAlbum() {
	// 表格数据
	const tableData = ref<PhotoAlbum[]>([]);
	const loadingStatus = ref<boolean>(false);

	// 分页
	const total = ref<number>(0);
	const pageSize = ref<number>(20);
	const currentPage = ref<number>(1);
	const keywords = ref<string>('');
	const totalSize = ref<number>(0); // 文件总大小（字节）

	// 加载表格数据
	const loadTableData = async (): Promise<void> => {
		loadingStatus.value = true;
		try {
			const result: any = await photoAlbumApi.getList({
				keywords: keywords.value || undefined,
				page: currentPage.value,
				pageSize: pageSize.value,
			});

			tableData.value = result.data?.list || [];
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
	const handleDelete = async (row: PhotoAlbum): Promise<void> => {
		await ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const id = row._id as string;
				const result = await photoAlbumApi.delete(id);
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
	const handleDeleteMany = async (rows: PhotoAlbum[]): Promise<void> => {
		await ElMessageBox.confirm(
			`确定要删除选中的 ${rows.length} 条记录吗？删除后无法恢复。`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(async () => {
				const ids = rows.map((row) => row._id as string).join(',');
				const result = await photoAlbumApi.delete(ids);
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

	// 上传照片
	const uploading = ref<boolean>(false);
	const uploadProgress = ref<number>(0);
	const uploadStatus = ref<'success' | 'exception' | 'warning' | ''>('');
	const uploadMessage = ref<string>('');

	const handleUpload = async (
		files: UploadRawFile[],
		title: string,
		description: string,
		tags: string[],
		onClearUpload?: () => void
	): Promise<void> => {
		if (!files || files.length === 0) {
			ElMessage.warning('请选择要上传的图片');
			return;
		}

		uploading.value = true;
		uploadProgress.value = 0;
		uploadStatus.value = '';
		uploadMessage.value = '正在上传图片...';

		try {
			// 创建FormData
			const formData = new FormData();
			files.forEach((file) => {
				formData.append('files', file);
			});
			if (title) formData.append('title', title);
			if (description) formData.append('description', description);
			if (tags && tags.length > 0) {
				tags.forEach((tag) => {
					formData.append('tags', tag);
				});
			}

			// 模拟上传进度
			const progressInterval = setInterval(() => {
				if (uploadProgress.value < 90) {
					uploadProgress.value += 10;
				}
			}, 200);

			// 调用上传API
			const result = await photoAlbumApi.upload(formData);

			clearInterval(progressInterval);
			uploadProgress.value = 100;

			if (result.code === 200 && result.data) {
				uploadStatus.value = 'success';
				uploadMessage.value = `成功上传 ${result.data.length} 张图片`;
				ElMessage.success(`成功上传 ${result.data.length} 张图片`);

				// 清空上传组件的文件列表
				if (onClearUpload) {
					onClearUpload();
				}

				// 刷新列表
				await loadTableData();

				// 2秒后重置进度条
				setTimeout(() => {
					uploading.value = false;
					uploadProgress.value = 0;
					uploadMessage.value = '';
				}, 2000);
			} else {
				throw new Error(result.message || '上传失败');
			}
		} catch (error: unknown) {
			uploadProgress.value = 100;
			uploadStatus.value = 'exception';
			const errorMessage = error instanceof Error ? error.message : '上传失败，请重试';
			uploadMessage.value = errorMessage;
			ElMessage.error(errorMessage);

			// 2秒后重置
			setTimeout(() => {
				uploading.value = false;
				uploadProgress.value = 0;
				uploadMessage.value = '';
			}, 2000);
		}
	};

	// 格式化文件大小
	const formatFileSize = (bytes: number): string => {
		if (!bytes) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
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
		handleSearch,
		handleCurrentChange,
		handleSizeChange,
		handleDelete,
		handleDeleteMany,
		// 上传相关
		uploading,
		uploadProgress,
		uploadStatus,
		uploadMessage,
		handleUpload,
		// 工具方法
		formatFileSize,
	};
}
