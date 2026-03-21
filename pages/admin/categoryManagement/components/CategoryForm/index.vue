<template>
	<el-form ref="formRef" :model="formData" :rules="formRules" :label-width="labelWidth">
		<el-form-item label="分类名称" prop="name">
			<el-input
				v-model="formData.name"
				placeholder="请输入分类名称"
				maxlength="50"
				show-word-limit />
		</el-form-item>

		<el-form-item label="分类描述" prop="description">
			<el-input
				v-model="formData.description"
				type="textarea"
				:rows="4"
				placeholder="请输入分类描述"
				maxlength="200"
				show-word-limit />
		</el-form-item>
	</el-form>
</template>

<script name="CategoryForm" lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

interface Props {
	modelValue: {
		_id?: string;
		name: string;
		description: string;
	};
	isSub: boolean;
	parentId?: string;
}

interface Emits {
	(e: 'update:modelValue', value: Props['modelValue']): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = useTemplateRef<FormInstance>('formRef');
const labelWidth = '100px';

// 表单数据
const formData = reactive<Props['modelValue']>(props.modelValue);

// 表单验证规则
const formRules: FormRules = {
	name: [
		{ required: true, message: '请输入分类名称', trigger: 'blur' },
		{ min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' },
	],
	description: [
		{ required: true, message: '请输入分类描述', trigger: 'blur' },
		{ max: 200, message: '分类描述不能超过 200 个字符', trigger: 'blur' },
	],
};

// 获取当前表单数据
const getFormData = () => {
	return { ...formData };
};

// 暴露方法
defineExpose({
	validate: () => formRef.value?.validate(),
	resetFields: () => {
		formRef.value?.resetFields();
		Object.assign(formData, props.modelValue);
	},
	getFormData,
});
</script>
