<template>
	<el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" size="default">
		<el-form-item label="权限名称" prop="name">
			<el-input
				v-model="formData.name"
				placeholder="请输入权限名称，如：admin、editor"
				:disabled="nameReadonly"
				maxlength="15"
				show-word-limit
				clearable />
		</el-form-item>
		<el-form-item label="描述" prop="description">
			<el-input
				v-model="formData.description"
				type="textarea"
				:rows="3"
				placeholder="请输入权限描述"
				maxlength="200"
				show-word-limit />
		</el-form-item>
	</el-form>
</template>

<script name="RoleForm" lang="ts" setup>
import type { AdminRole } from '~/api';
import type { FormInstance, FormRules } from 'element-plus';

interface Props {
	modelValue: Pick<AdminRole, 'name' | 'description'>;
	/** 为 true 时权限名称不可编辑（用于编辑弹窗） */
	nameReadonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	nameReadonly: false,
});
const emit = defineEmits<{
	(e: 'update:modelValue', value: Pick<AdminRole, 'name' | 'description'>): void;
}>();

const formRef = useTemplateRef<FormInstance>('formRef');

const formData = reactive({
	name: props.modelValue.name,
	description: props.modelValue.description ?? '',
});

watch(
	() => props.modelValue,
	(val: Pick<AdminRole, 'name' | 'description'>) => {
		formData.name = val.name;
		formData.description = val.description ?? '';
	},
	{ immediate: true, deep: true },
);

watch(
	formData,
	(val: { name: string; description: string }) =>
		emit('update:modelValue', { name: val.name, description: val.description }),
	{ deep: true },
);

const formRules: FormRules = {
	name: [
		{ required: true, message: '请输入权限名称', trigger: 'blur' },
		{ min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' },
	],
	description: [{ max: 200, message: '描述不超过 200 个字符', trigger: 'blur' }],
};

const validate = (): Promise<boolean> => {
	return (
		formRef.value
			?.validate()
			.then(() => true)
			.catch(() => false) ?? Promise.resolve(false)
	);
};

const resetFields = (): void => {
	formRef.value?.resetFields();
};

/** 获取当前表单数据（提交时从子组件直接读取，避免 v-model 同步问题） */
const getFormData = (): Pick<AdminRole, 'name' | 'description'> => ({
	name: formData.name,
	description: formData.description,
});

defineExpose({
	validate,
	resetFields,
	getFormData,
});
</script>
