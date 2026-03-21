import { ElMessage, ElMessageBox } from 'element-plus';
import { fileApi, type FileView } from '~/api';
import type { UploadRawFile } from 'element-plus';

// 扩展FileView类型，添加mimetype和originalName字段
export interface ExtendedFileView extends FileView {
	mimetype?: string;
	originalName?: string;
}

export function useFileUpload() {
	// 已上传的文件列表
	const uploadedFiles = ref<ExtendedFileView[]>([]);

	// 上传状态
	const uploading = ref<boolean>(false);
	const uploadProgress = ref<number>(0);
	const uploadStatus = ref<'success' | 'exception' | 'warning' | ''>('');
	const uploadMessage = ref<string>('');

	// 判断是否为图片
	const isImage = (mimetype: string): boolean => {
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

	// 复制文件URL
	const copyFileUrl = async (url: string): Promise<void> => {
		try {
			const fullUrl = `${window.location.origin}${url}`;
			await navigator.clipboard.writeText(fullUrl);
			ElMessage.success('链接已复制到剪贴板');
		} catch {
			ElMessage.error('复制失败');
		}
	};

	// 处理文件上传
	const handleFileUpload = async (
		files: UploadRawFile[],
		onClearUpload?: () => void
	): Promise<void> => {
		if (!files || files.length === 0) {
			ElMessage.warning('请选择要上传的文件');
			return;
		}

		uploading.value = true;
		uploadProgress.value = 0;
		uploadStatus.value = '';
		uploadMessage.value = '正在上传文件...';

		try {
			// 创建FormData
			const formData = new FormData();
			files.forEach((file) => {
				formData.append('files', file);
			});

			// 模拟上传进度
			const progressInterval = setInterval(() => {
				if (uploadProgress.value < 90) {
					uploadProgress.value += 10;
				}
			}, 200);

			// 调用上传API
			const result = await fileApi.upload(formData);

			clearInterval(progressInterval);
			uploadProgress.value = 100;

			if (result.code === 201 && result.data) {
				// 转换服务器返回的数据格式为FileView格式
				interface ServerFile {
					_id?: string;
					id?: string;
					url?: string;
					fileUrl?: string;
					name?: string;
					fileName?: string;
					size: number;
					mimetype?: string;
					type?: string;
					createdAt: string;
					originalName?: string;
				}
				const newFiles: ExtendedFileView[] = result.data.map((file: ServerFile) => ({
					_id: file._id || file.id || '',
					url: file.url || file.fileUrl || '',
					name: file.name || file.fileName || '',
					size: file.size,
					type: file.mimetype || file.type || '',
					createdAt: file.createdAt,
					originalName: file.originalName,
					mimetype: file.mimetype,
				}));

				// 添加到已上传列表
				uploadedFiles.value.push(...newFiles);

				uploadStatus.value = 'success';
				uploadMessage.value = `成功上传 ${newFiles.length} 个文件`;
				ElMessage.success(`成功上传 ${newFiles.length} 个文件`);

				// 清空上传组件的文件列表
				if (onClearUpload) {
					onClearUpload();
				}

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

	// 删除文件
	const handleDeleteFile = async (file: ExtendedFileView): Promise<void> => {
		try {
			await ElMessageBox.confirm(`确定要删除文件 "${file.name}" 吗？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			});

			const result = await fileApi.delete(file._id);
			if (result.code === 200) {
				// 从列表中移除
				const index = uploadedFiles.value.findIndex((f: ExtendedFileView) => f._id === file._id);
				if (index > -1) {
					uploadedFiles.value.splice(index, 1);
				}
				ElMessage.success('删除成功');
			} else {
				ElMessage.error(result.message || '删除失败');
			}
		} catch (error: unknown) {
			if (error !== 'cancel') {
				const errorMessage = error instanceof Error ? error.message : '删除失败';
				ElMessage.error(errorMessage);
			}
		}
	};

	// 清空所有文件
	const clearAllFiles = (): void => {
		uploadedFiles.value = [];
		ElMessage.success('已清空文件列表');
	};

	return {
		// 数据
		uploadedFiles,
		uploading,
		uploadProgress,
		uploadStatus,
		uploadMessage,
		// 方法
		isImage,
		formatFileSize,
		copyFileUrl,
		handleFileUpload,
		handleDeleteFile,
		clearAllFiles,
	};
}
