<template>
	<div>
		<!-- 工具栏 -->
		<div class="w-full flex justify-between items-center pb-2 border-b mb-2 dark:border-[#1e293b]">
			<div>
				<el-button icon="ArrowLeft" size="small" @click="handleToList">文章列表</el-button>
			</div>
		</div>

		<!-- 文章表单 -->
		<div class="w-full">
			<ArticleForm
				ref="formRef"
				v-model="formData"
				@upload="
					async (file: File) => {
						const result = await handleUploadFile(file);
						if (result) {
							formData.cover = result.url;
						}
					}
				" />
			<div class="flex items-center justify-end mt-4">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleConfirm">发布</el-button>
			</div>
		</div>
	</div>
</template>

<script name="PublishArticle" lang="ts" setup>
import { useArticle } from '~/composables/useArticle';
import ArticleForm from './components/ArticleForm/index.vue';

// 使用 composable
const { handlePublish, handleUploadFile } = useArticle();

// 路由
const router = useRouter();

// 表单引用
const formRef = useTemplateRef<any>('formRef');

// 表单数据
const formData = ref({
	cover: '',
	title: '',
	content: '',
	category: '',
	subCategory: '',
	tags: [],
	isPublished: true,
});

// 确认发布
const handleConfirm = async () => {
	if (!formRef.value) return;
	try {
		await formRef.value.validate();
		const formDataValue = formRef.value.getFormData ? formRef.value.getFormData() : formData.value;
		const success = await handlePublish({
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
</script>
