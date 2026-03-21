<template>
	<div>
		<!-- 工具栏 -->
		<div class="w-full flex justify-between items-center pb-2 border-b mb-2 dark:border-[#1e293b]">
			<div>
				<el-button icon="ArrowLeft" size="small" @click="handleToList">文章列表</el-button>
			</div>
		</div>

		<!-- 文章表单 -->
		<div v-loading="loading" class="w-full">
			<ArticleForm v-if="!loading" ref="formRef" v-model="formData" @upload="handleFileUpload" />
			<div class="flex items-center justify-end mt-4">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleConfirm">保存</el-button>
			</div>
		</div>
	</div>
</template>

<script name="EditArticle" lang="ts" setup>
import { useArticle, type Article } from '~/composables/useArticle';
import { articleApi } from '~/api';
import ArticleForm from '../components/ArticleForm/index.vue';

// 使用 composable
const { handleUpdate, handleUploadFile } = useArticle();

// 路由
const router = useRouter();
const route = useRoute();

// 表单引用
const formRef = useTemplateRef<InstanceType<typeof ArticleForm>>('formRef');

// 加载状态
const loading = ref<boolean>(true);

// 表单数据类型
interface FormData {
	_id: string;
	cover: string;
	title: string;
	content: string;
	category: string;
	subCategory: string;
	tags: string[];
	isPublished: boolean;
}

// 表单数据
const formData = ref<FormData>({
	_id: '',
	cover: '',
	title: '',
	content: '',
	category: '',
	subCategory: '',
	tags: [],
	isPublished: true,
});

// 加载文章数据
const loadArticleData = async () => {
	const articleId = route.params.id as string;
	if (!articleId) {
		ElMessage.error('文章ID不存在');
		router.push('/admin/articleManagement/allArticle');
		return;
	}

	loading.value = true;
	try {
		const result = await articleApi.getById(articleId);
		if (result.code === 200 && result.data) {
			// API 返回的 Article 类型可能和 composable 中的不同，需要类型断言
			const article = result.data as unknown as Article;

			// 提取分类ID（后端可能返回对象或字符串）
			const extractCategoryId = (cat: unknown): string => {
				if (!cat) return '';
				if (typeof cat === 'string') return cat;
				if (typeof cat === 'object' && cat !== null && '_id' in cat) {
					// 后端populate后返回对象，提取_id
					return String((cat as { _id: unknown })._id);
				}
				return '';
			};

			// 提取二级分类ID（后端可能返回对象或字符串）
			const extractSubCategoryId = (subCat: unknown): string => {
				if (!subCat) return '';
				if (typeof subCat === 'string') return subCat;
				if (typeof subCat === 'object' && subCat !== null && '_id' in subCat) {
					// 后端populate后返回对象，提取_id
					return String((subCat as { _id: unknown })._id);
				}
				return '';
			};

			const categoryId = extractCategoryId(article.category);
			const subCategoryId = extractSubCategoryId(article.subCategory);
			formData.value = {
				_id: String(article._id || articleId),
				cover: article.cover || '',
				title: article.title || '',
				content: article.content || '',
				category: categoryId,
				subCategory: subCategoryId,
				tags: Array.isArray(article.tags) ? article.tags : [],
				isPublished: article.isPublished !== undefined ? article.isPublished : true,
			};
		} else {
			ElMessage.error(result.message || '加载文章失败');
			router.push('/admin/articleManagement/allArticle');
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '加载文章失败';
		ElMessage.error(errorMessage);
		router.push('/admin/articleManagement/allArticle');
	} finally {
		loading.value = false;
	}
};

// 确认保存
const handleConfirm = async () => {
	if (!formRef.value) return;
	try {
		await formRef.value.validate();
		const formDataValue = formRef.value.getFormData ? formRef.value.getFormData() : formData.value;
		// handleUpdate 现在支持字符串类型的 category 和 subCategory
		const success = await handleUpdate({
			id: formDataValue._id,
			cover: formDataValue.cover,
			title: formDataValue.title,
			content: formDataValue.content,
			category: formDataValue.category,
			subCategory: formDataValue.subCategory,
			tags: formDataValue.tags || [],
			isPublished: formDataValue.isPublished,
		});
		if (success) {
			router.push('/admin/articleManagement/allArticle');
		}
	} catch {
		// 验证失败，不处理
	}
};

// 取消
const handleCancel = () => {
	router.push('/admin/articleManagement/allArticle');
};

// 返回
const handleToList = () => {
	router.push('/admin/articleManagement/allArticle');
};

// 处理文件上传
const handleFileUpload = async (file: File, field: string): Promise<void> => {
	const result = await handleUploadFile(file);
	if (result && field in formData.value) {
		(formData.value as Record<string, unknown>)[field] = result.url;
	}
};

// 初始化加载数据
onMounted(() => {
	loadArticleData();
});
</script>

<style lang="scss" scoped></style>
