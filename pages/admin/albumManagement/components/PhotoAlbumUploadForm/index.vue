<template>
	<div class="photo-album-upload-form">
		<el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
			<el-form-item label="标题" prop="title">
				<el-input v-model="formData.title" placeholder="请输入标题（可选，不填则使用文件名）" />
			</el-form-item>
			<el-form-item label="描述" prop="description">
				<el-input
					v-model="formData.description"
					type="textarea"
					:rows="3"
					placeholder="请输入描述（可选）" />
			</el-form-item>
			<el-form-item label="标签" prop="tags">
				<el-input
					v-model="tagsInput"
					placeholder="请输入标签，多个标签用逗号分隔（可选）"
					@blur="handleTagsBlur" />
				<div v-if="formData.tags.length > 0" class="mt-2">
					<el-tag
						v-for="tag in formData.tags"
						:key="tag"
						size="small"
						closable
						class="mr-2 mb-2"
						@close="removeTag(tag)">
						{{ tag }}
					</el-tag>
				</div>
			</el-form-item>
			<el-form-item label="图片" prop="files" required>
				<div class="flex items-center gap-3">
					<SingleUpload ref="singleUploadRef" accept="image/*" :handle-upload="handleFileSelect" />
					<span v-if="formData.files.length" class="text-xs text-gray-500">
						已选择：{{ formData.files[0]?.name }}
					</span>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<script name="PhotoAlbumUploadForm" lang="ts" setup>
import { ElMessage } from 'element-plus';
import type { ElForm, UploadRawFile } from 'element-plus';
import SingleUpload from '~/components/Upload/SingleUpload/index.vue';

interface Props {
	modelValue?: {
		title?: string;
		description?: string;
		tags?: string[];
		files?: UploadRawFile[];
	};
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: () => ({}),
});

const emit = defineEmits<{
	'update:modelValue': [value: Props['modelValue']];
	upload: [files: UploadRawFile[], title: string, description: string, tags: string[]];
}>();

const formRef = useTemplateRef<InstanceType<typeof ElForm>>('formRef');
const singleUploadRef = useTemplateRef<InstanceType<typeof SingleUpload>>('singleUploadRef');

const formData = reactive({
	title: '',
	description: '',
	tags: [] as string[],
	files: [] as UploadRawFile[],
});

const tagsInput = ref<string>('');

const rules = {
	title: [],
	description: [],
	tags: [],
	files: [
		{
			required: true,
			message: '请选择要上传的图片',
			trigger: 'change',
			validator: (_rule: unknown, _value: unknown, callback: (error?: Error) => void) => {
				if (formData.files.length === 0) {
					callback(new Error('请选择要上传的图片'));
				} else {
					callback();
				}
			},
		},
	],
};

// 处理标签输入
const handleTagsBlur = (): void => {
	if (tagsInput.value.trim()) {
		const newTags = tagsInput.value
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag && !formData.tags.includes(tag));
		formData.tags.push(...newTags);
		tagsInput.value = '';
	}
};

// 移除标签
const removeTag = (tag: string): void => {
	const index = formData.tags.indexOf(tag);
	if (index > -1) {
		formData.tags.splice(index, 1);
	}
};

// 处理文件选择
const handleFileSelect = (file: UploadRawFile): void => {
	formData.files = file ? [file] : [];
	emit('update:modelValue', { ...formData });
};

// 监听props变化
watch(
	() => props.modelValue,
	(newValue) => {
		if (newValue) {
			Object.assign(formData, {
				title: newValue.title || '',
				description: newValue.description || '',
				tags: newValue.tags || [],
				files: newValue.files || [],
			});
		}
	},
	{ deep: true, immediate: true }
);

// 监听formData变化
watch(
	formData,
	(newValue) => {
		emit('update:modelValue', { ...newValue });
	},
	{ deep: true }
);

// 验证表单
const validate = async (): Promise<boolean> => {
	if (!formRef.value) return false;
	try {
		await formRef.value.validate();
		return true;
	} catch {
		return false;
	}
};

// 重置表单
const resetFields = (): void => {
	formData.title = '';
	formData.description = '';
	formData.tags = [];
	formData.files = [];
	tagsInput.value = '';
	if (formRef.value) {
		formRef.value.resetFields();
	}
	(singleUploadRef.value as any).clearFiles();
};

// 获取表单数据
const getFormData = () => {
	return {
		title: formData.title,
		description: formData.description,
		tags: formData.tags,
		files: formData.files,
	};
};

// 触发上传
const triggerUpload = async (): Promise<void> => {
	const isValid = await validate();
	if (!isValid) return;

	if (formData.files.length === 0) {
		ElMessage.warning('请选择要上传的图片');
		return;
	}

	emit('upload', formData.files, formData.title, formData.description, formData.tags);
};

defineExpose({
	validate,
	resetFields,
	getFormData,
	triggerUpload,
});
</script>

<style lang="scss" scoped>
.photo-album-upload-form {
	padding: 16px 0;
}
</style>
