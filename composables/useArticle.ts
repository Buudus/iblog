import { ElMessage, ElMessageBox } from 'element-plus';
import { articleApi, fileApi, type FileView } from '~/api';

// 文章类型定义（基于模型）
export interface Article {
	_id?: string;
	cover: string;
	title: string;
	content: string;
	category: string | { _id: string; name?: string };
	subCategory: string | { _id: string; name?: string };
	tags: string[];
	views?: number;
	likes?: number;
	isPublished: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export function useArticle() {
	// 表格数据
	const tableData = ref<Article[]>([]);
	const loadingStatus = ref<boolean>(false);

	// 分页
	const total = ref<number>(0);
	const pageSize = ref<number>(20);
	const currentPage = ref<number>(1);
	const keywords = ref<string>('');
	const status = ref<string>(''); // published/draft/空字符串（全部）
	const categoryId = ref<string>('');

	// 加载表格数据
	const loadTableData = async (): Promise<void> => {
		loadingStatus.value = true;
		try {
			const result = await articleApi.getList({
				keywords: keywords.value,
				page: currentPage.value,
				pageSize: pageSize.value,
				status: status.value || undefined,
				categoryId: categoryId.value || undefined,
			});

			// API 返回的 Article 类型与 composable 中的不同，需要进行类型转换
			const apiArticles = result.data?.list || [];
			tableData.value = apiArticles.map((apiArticle) => {
				// 处理category：后端可能返回对象（populate后）或字符串
				// 为了显示，保留对象格式；如果只是字符串ID，也保留
				const processCategory = (cat: unknown): string | { _id: string; name?: string } => {
					if (!cat) return '';
					if (typeof cat === 'string') return cat;
					if (typeof cat === 'object' && cat !== null && '_id' in cat) {
						// 保留对象格式，用于显示名称
						return cat as { _id: string; name?: string };
					}
					return '';
				};

				// 处理subCategory：后端可能返回对象（populate后）或字符串
				const processSubCategory = (subCat: unknown): string | { _id: string; name?: string } => {
					if (!subCat) return '';
					if (typeof subCat === 'string') return subCat;
					if (typeof subCat === 'object' && subCat !== null && '_id' in subCat) {
						// 保留对象格式，用于显示名称
						return subCat as { _id: string; name?: string };
					}
					return '';
				};

				// 将 API 返回的 Article 转换为 composable 中的 Article 类型
				return {
					_id: apiArticle._id,
					cover: apiArticle.cover,
					title: apiArticle.title,
					content: apiArticle.content,
					author: (apiArticle as unknown as Article).author || '',
					category: processCategory((apiArticle as unknown as Article).category),
					subCategory: processSubCategory((apiArticle as unknown as Article).subCategory),
					tags: apiArticle.tags || [],
					views: (apiArticle as unknown as Article).views || 0,
					likes: (apiArticle as unknown as Article).likes || 0,
					isPublished: (apiArticle as unknown as Article).isPublished ?? false,
					createdAt: apiArticle.createdAt,
					updatedAt: apiArticle.updatedAt,
				} as Article;
			});
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

	// 创建文章
	const handleCreate = async (formData: {
		cover: string;
		title: string;
		content: string;
		category: string;
		subCategory?: string;
		tags: string[];
		isPublished: boolean;
	}): Promise<boolean> => {
		try {
			// API 的 create 方法需要 summary 字段，从 content 中提取或使用空字符串
			const result = await articleApi.create({
				cover: formData.cover,
				title: formData.title,
				content: formData.content,
				categoryId: formData.category,
				tags: formData.tags,
				status: formData.isPublished ? 'published' : 'draft',
			});
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

	// 发布文章（使用publish接口）
	const handlePublish = async (formData: {
		cover: string;
		title: string;
		content: string;
		category: string;
		subCategory?: string;
		tags: string[];
		isPublished: boolean;
	}): Promise<boolean> => {
		try {
			// publish API 期望的 article 对象格式
			const result = await articleApi.publish({
				article: {
					cover: formData.cover,
					title: formData.title,
					content: formData.content,
					category: formData.category,
					subCategory: formData.subCategory,
					tags: formData.tags,
					isPublished: formData.isPublished,
				} as Record<string, unknown>,
			});
			if (result.code === 200 || result.code === 201) {
				ElMessage.success(result.message || '发布成功');
				await loadTableData();
				return true;
			} else {
				ElMessage.error(result.message || '发布失败');
				return false;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '操作失败，请重试';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	// 更新文章
	interface UpdateArticleData extends Partial<Omit<Article, 'category' | 'subCategory'>> {
		id?: string;
		category?: string | { _id: string; name?: string };
		subCategory?: string | { _id: string; name?: string };
	}

	const handleUpdate = async (article: UpdateArticleData): Promise<boolean> => {
		try {
			// 提取category ID（前端ID永远是字符串）
			const extractCategoryId = (cat: unknown): string | undefined => {
				return typeof cat === 'string' ? cat : undefined;
			};

			// 提取subCategory ID（前端ID永远是字符串）
			const extractSubCategoryId = (subCat: unknown): string | undefined => {
				return typeof subCat === 'string' ? subCat : undefined;
			};

			// 转换 category 和 subCategory 为字符串ID
			const updateData = {
				id: article.id,
				cover: article.cover,
				title: article.title,
				content: article.content,
				category: extractCategoryId(article.category),
				subCategory: extractSubCategoryId(article.subCategory),
				tags: article.tags,
				isPublished: article.isPublished,
			};
			const result = await articleApi.update({ article: updateData });
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

	// 删除文章
	const handleDelete = async (row: Article): Promise<void> => {
		await ElMessageBox.confirm(`删除文章 "${row.title}" 后无法恢复，是否确认删除？`, '警告', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				const result = await articleApi.delete(row._id as string);
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

	// 批量删除文章
	const handleDeleteMany = async (rows: Article[]): Promise<void> => {
		await ElMessageBox.confirm(
			`删除选中的 ${rows.length} 篇文章后无法恢复，是否确认删除？`,
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(async () => {
				const ids = rows.map((row) => row._id as string);
				const result = await articleApi.deleteMany(ids);
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

	// 批量发布文章
	const handlePublishMany = async (rows: Article[]): Promise<void> => {
		await ElMessageBox.confirm(`确认发布选中的 ${rows.length} 篇文章？`, '确认', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'info',
		})
			.then(async () => {
				const ids = rows.map((row) => row._id as string);
				const result = await articleApi.publishMany(ids);
				if (result.code === 200) {
					ElMessage.success(result.message);
					await loadTableData();
				} else {
					ElMessage.error(result.message || '发布失败');
				}
			})
			.catch(() => {
				ElMessage({ type: 'info', message: '取消发布' });
			});
	};

	// 文件上传
	const handleUploadFile = async (file: File): Promise<FileView | null> => {
		try {
			const formData = new FormData();
			formData.append('files', file);
			const result = await fileApi.upload(formData);
			if (
				(result.code === 200 || result.code === 201) &&
				result.data &&
				Array.isArray(result.data) &&
				result.data.length > 0
			) {
				return result.data[0];
			} else {
				ElMessage.error(result.message || '上传失败');
				return null;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '上传失败';
			ElMessage.error(errorMessage);
			return null;
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
		status,
		categoryId,
		// 方法
		loadTableData,
		handleSearch,
		handleCurrentChange,
		handleSizeChange,
		handleCreate,
		handlePublish,
		handleUpdate,
		handleDelete,
		handleDeleteMany,
		handlePublishMany,
		handleUploadFile,
	};
}
