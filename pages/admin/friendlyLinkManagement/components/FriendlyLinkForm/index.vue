<template>
	<DataForm
		ref="formRef"
		:model-value="formData"
		:fields="fields"
		:rules="formRules"
		@update:model-value="handleUpdate"
		@upload="handleUpload" />
</template>

<script name="FriendlyLinkForm" lang="ts" setup>
import type { FriendlyLink } from '~/api';
import type { FormRules } from 'element-plus';
import DataForm from '~/components/DataForm/index.vue';
import type { FormField } from '~/components/DataForm/index.vue';

interface Props {
	modelValue:
		| Omit<FriendlyLink, '_id' | 'createdAt' | 'updatedAt'>
		| Omit<FriendlyLink, 'createdAt' | 'updatedAt'>;
}

interface Emits {
	(e: 'update:modelValue', value: Props['modelValue']): void;
	(e: 'upload', file: File, field: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = useTemplateRef<InstanceType<typeof DataForm>>('formRef');

// 表单数据
const formData = computed(() => props.modelValue);

// 更新表单数据
const handleUpdate = (value: Record<string, any>) => {
	emit('update:modelValue', value as Props['modelValue']);
};

// 表单字段配置
const fields: FormField[] = [
	{
		label: 'Logo',
		prop: 'icon',
		type: 'image',
		placeholder: '请输入图片链接，如：http://example.com/logo.png',
	},
	{
		label: '名称',
		prop: 'name',
		type: 'input',
		placeholder: '请输入名称',
		maxlength: 50,
		showWordLimit: true,
	},
	{
		label: '链接',
		prop: 'url',
		type: 'input',
		placeholder: '请输入链接，如：http://example.com',
	},
	{
		label: '描述',
		prop: 'description',
		type: 'textarea',
		placeholder: '请输入描述',
		rows: 3,
		maxlength: 200,
		showWordLimit: true,
	},
	{
		label: '邮箱',
		prop: 'email',
		type: 'input',
		placeholder: '请输入联系邮箱',
	},
	{
		label: '备注',
		prop: 'remark',
		type: 'textarea',
		placeholder: '请输入备注（可选）',
		rows: 2,
		maxlength: 200,
		showWordLimit: true,
	},
	{
		label: '状态',
		prop: 'status',
		type: 'radio',
		options: [
			{ label: '待审核', value: 'pending' },
			{ label: '已通过', value: 'approved' },
			{ label: '已拒绝', value: 'rejected' },
		],
	},
];

// 表单验证规则
const formRules: FormRules = {
	name: [
		{ required: true, message: '请输入名称', trigger: 'blur' },
		{ min: 1, max: 50, message: '名称长度在 1 到 50 个字符', trigger: 'blur' },
	],
	url: [
		{ required: true, message: '请输入链接', trigger: 'blur' },
		{
			pattern: /^https?:\/\/.+/,
			message: '请输入正确的链接格式，如：http://example.com',
			trigger: 'blur',
		},
	],
	description: [{ max: 200, message: '描述长度不能超过200字符', trigger: 'blur' }],
	icon: [{ message: '请输入图片链接或上传图片', trigger: 'blur' }],
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{
			pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
			message: '请输入正确的邮箱格式',
			trigger: 'blur',
		},
	],
	remark: [{ max: 200, message: '备注长度不能超过200字符', trigger: 'blur' }],
	status: [{ required: true, message: '请选择状态（待审核/已通过/已拒绝）', trigger: 'change' }],
};

// 文件上传
const handleUpload = (file: File, field: string) => {
	emit('upload', file, field);
};

// 暴露方法
defineExpose({
	validate: () => formRef.value?.validate(),
	resetFields: () => formRef.value?.resetFields(),
});
</script>
