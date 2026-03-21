<template>
	<el-form ref="formRef" :model="formData" :rules="formRules" :label-width="labelWidth">
		<el-form-item label="封面" prop="cover">
			<div v-if="formData.cover" class="h-[80px] mb-2">
				<el-image class="h-full" :src="formData.cover" />
			</div>
			<el-input
				v-model="formData.cover"
				placeholder="请输入封面链接，如：http://example.com/cover.png" />
			<div class="mt-2">
				<SingleUpload :handleUpload="handleCoverUpload" />
			</div>
		</el-form-item>

		<el-form-item label="标题" prop="title">
			<el-input
				v-model="formData.title"
				placeholder="请输入文章标题"
				maxlength="100"
				show-word-limit />
		</el-form-item>

		<el-form-item label="一级分类" prop="category">
			<el-select
				v-model="formData.category"
				placeholder="请选择一级分类"
				style="width: 100%"
				@change="handleCategoryChange">
				<el-option
					v-for="cat in categoryOptions"
					:key="String(cat._id)"
					:label="cat.name"
					:value="String(cat._id)" />
			</el-select>
		</el-form-item>

		<el-form-item label="二级分类" prop="subCategory">
			<el-select
				v-model="formData.subCategory"
				placeholder="请选择二级分类"
				style="width: 100%"
				:disabled="!formData.category">
				<el-option
					v-for="sub in subCategoryOptions"
					:key="String(sub._id)"
					:label="sub.name"
					:value="String(sub._id)" />
			</el-select>
		</el-form-item>

		<el-form-item label="标签" prop="tags">
			<el-select
				v-model="formData.tags"
				multiple
				filterable
				allow-create
				default-first-option
				placeholder="请输入或选择标签"
				style="width: 100%">
				<el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag" />
			</el-select>
		</el-form-item>

		<el-form-item label="内容" prop="content">
			<MdEditor
				@onUploadImg="onUploadImg"
				v-model="formData.content"
				:theme="mdTheme"
				language="zh-CN"
				preview-theme="github"
				code-theme="github"
				style="height: 500px" />
		</el-form-item>

		<el-form-item label="发布状态" prop="isPublished">
			<el-radio-group v-model="formData.isPublished">
				<el-radio :value="true">立即发布</el-radio>
				<el-radio :value="false">保存为草稿</el-radio>
			</el-radio-group>
		</el-form-item>
	</el-form>
</template>

<script name="ArticleForm" lang="ts" setup>
import 'md-editor-v3/lib/style.css';
import { MdEditor } from 'md-editor-v3';
import type { FormInstance, FormRules } from 'element-plus';
import SingleUpload from '~/components/Upload/SingleUpload/index.vue';
import { categoryApi, clientArticleApi, fileApi } from '~/api';
import type { CategoryWithChildren, SubCategoryWithCount } from '~/api';
import { useThemeStore } from '~/stores/themeStore';

interface Props {
	modelValue: {
		_id?: string;
		cover?: string;
		title?: string;
		content?: string;
		category?: string;
		subCategory?: string;
		tags?: string[];
		isPublished?: boolean;
	};
}

interface Emits {
	(e: 'update:modelValue', value: Props['modelValue']): void;
	(e: 'upload', file: File, field: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = useTemplateRef<FormInstance>('formRef');
const labelWidth = '120px';
const themeStore = useThemeStore();

// 表单数据
const formData = reactive<Props['modelValue']>({
	cover: '',
	title: '',
	content: '',
	category: '',
	subCategory: '',
	tags: [],
	isPublished: true,
	...props.modelValue,
});

// 监听 props.modelValue 变化
watch(
	() => props.modelValue,
	(newValue: Props['modelValue']) => {
		const hasChanged = Object.keys(newValue || {}).some((key: string) => {
			const formDataKey = key as keyof typeof formData;
			const newValueKey = key as keyof typeof newValue;
			return formData[formDataKey] !== newValue?.[newValueKey];
		});
		if (hasChanged) {
			Object.assign(formData, newValue);
			// 如果设置了category，需要加载对应的二级分类
			// 使用nextTick确保分类选项已加载完成
			if (newValue?.category) {
				if (categoryOptions.value.length > 0) {
					nextTick(() => {
						updateSubCategoryOptions(newValue.category || '');
					});
				}
			}
		}
	},
	{ deep: true, immediate: true },
);

// 监听表单数据变化
watch(
	formData,
	(newValue: Props['modelValue']) => {
		emit('update:modelValue', { ...newValue });
	},
	{ deep: true },
);

// 监听一级分类变化，自动加载二级分类
watch(
	() => formData.category,
	(newCategory: string | undefined) => {
		if (newCategory && categoryOptions.value.length > 0) {
			updateSubCategoryOptions(newCategory);
		} else {
			subCategoryOptions.value = [];
			formData.subCategory = '';
		}
	},
);

// 表单验证规则
const formRules: FormRules = {
	cover: [{ required: true, message: '请输入封面链接', trigger: 'blur' }],
	title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
	content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
	category: [{ required: true, message: '请选择一级分类', trigger: 'change' }],
	subCategory: [{ required: true, message: '请选择二级分类', trigger: 'change' }],
};

// 分类选项
const categoryOptions = ref<CategoryWithChildren[]>([]);
const subCategoryOptions = ref<SubCategoryWithCount[]>([]);

// 标签选项
const tagOptions = ref<string[]>([]);

// Markdown编辑器主题
const mdTheme = computed<'dark' | 'light'>(() => {
	return themeStore.currentTheme === 'dark' ? 'dark' : 'light';
});

// 加载分类数据
const loadCategories = async () => {
	try {
		const result = await categoryApi.getList();
		categoryOptions.value = Array.isArray(result) ? result : [];
		// 如果表单已经设置了category，需要加载对应的二级分类
		if (formData.category && categoryOptions.value.length > 0) {
			// 使用nextTick确保数据已更新
			nextTick(() => {
				updateSubCategoryOptions(formData.category || '');
			});
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '加载分类失败';
		console.error('加载分类失败:', errorMessage);
	}
};

// 监听分类选项加载完成，如果有预设的category，需要加载对应的二级分类
watch(
	() => categoryOptions.value.length,
	(newLength: number) => {
		if (newLength > 0 && formData.category) {
			nextTick(() => {
				updateSubCategoryOptions(formData.category || '');
			});
		}
	},
);

// 加载标签数据
const loadTags = async () => {
	try {
		const result = await clientArticleApi.getTags();
		// result 是 ApiResponse 类型，需要访问 data 属性
		const tags = result.data || [];
		tagOptions.value = Array.isArray(tags) ? tags.map((tag: { name: string }) => tag.name) : [];
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '加载标签失败';
		console.error('加载标签失败:', errorMessage);
	}
};

// 更新二级分类选项
const updateSubCategoryOptions = (categoryId: string) => {
	if (!categoryId) {
		subCategoryOptions.value = [];
		return;
	}
	// 统一转为字符串进行比较
	const compareId = String(categoryId);
	const selectedCategory = categoryOptions.value.find((cat: CategoryWithChildren) => {
		// 支持通过_id或字符串ID匹配
		const catId = cat._id ? String(cat._id) : '';
		return catId === compareId;
	});
	subCategoryOptions.value = selectedCategory?.children || [];
};

// 处理分类变化
const handleCategoryChange = () => {
	// 清空二级分类选择
	formData.subCategory = '';
	// 更新二级分类选项
	updateSubCategoryOptions(formData.category || '');
};

// 封面上传处理
const handleCoverUpload = async (file: File) => {
	emit('upload', file, 'cover');
};

const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
	console.log('files: ', files);
	const form = new FormData();
	files.forEach((file) => {
		form.append('files', file);
	});
	const res = await fileApi.upload(form);
	callback(res.data.map((item) => item.url));
};

// 暴露方法
defineExpose({
	validate: () => formRef.value?.validate(),
	resetFields: () => formRef.value?.resetFields(),
	getFormData: () => ({ ...formData }),
});

// 初始化加载数据
onMounted(() => {
	loadCategories();
	loadTags();
});
</script>
