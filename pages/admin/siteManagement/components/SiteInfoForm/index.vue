<template>
	<DataForm
		ref="formRef"
		:model-value="formData"
		:fields="fields"
		:rules="formRules"
		@update:model-value="handleUpdate"
		@upload="handleUpload" />
</template>

<script name="SiteInfoForm" lang="ts" setup>
import type { SiteInfo } from '~/api';
import type { FormRules } from 'element-plus';
import DataForm from '~/components/DataForm/index.vue';
import type { FormField } from '~/components/DataForm/index.vue';

interface Props {
	modelValue:
		| Omit<SiteInfo, '_id' | 'createdAt' | 'updatedAt'>
		| Omit<SiteInfo, 'createdAt' | 'updatedAt'>;
}

interface Emits {
	(e: 'update:modelValue', value: Props['modelValue']): void;
	(e: 'upload', file: File, field: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = useTemplateRef<InstanceType<typeof DataForm>>('formRef');

// 表单数据 - 使用 reactive 来支持双向绑定
const formData = reactive(props.modelValue);

// 更新表单数据
const handleUpdate = (value: Record<string, any>) => {
	Object.assign(formData, value);
	emit('update:modelValue', { ...formData } as Props['modelValue']);
};

// 表单字段配置
const fields: FormField[] = [
	{
		label: 'Logo',
		prop: 'logo',
		type: 'image',
		placeholder: '请输入图片链接，如：http://example.com/logo.png',
	},
	{
		label: '标题',
		prop: 'title',
		type: 'input',
		placeholder: '请输入站点标题',
		maxlength: 50,
		showWordLimit: true,
	},
	{
		label: '域名',
		prop: 'domain',
		type: 'input',
		placeholder: '请输入域名，如：http://example.com',
	},
	{
		label: '关键词',
		prop: 'keywords',
		type: 'input',
		placeholder: '请输入关键词，多个关键词用逗号分隔',
		maxlength: 100,
		showWordLimit: true,
	},
	{
		label: '描述',
		prop: 'description',
		type: 'textarea',
		placeholder: '请输入站点描述',
		rows: 3,
		maxlength: 200,
		showWordLimit: true,
	},
	{
		label: '全局样式',
		prop: 'globalStyle',
		type: 'textarea',
		placeholder: '请输入全局CSS样式',
		rows: 4,
	},
	{
		label: '全局脚本',
		prop: 'globalScript',
		type: 'textarea',
		placeholder: '请输入全局JavaScript脚本',
		rows: 4,
	},
	{
		label: '是否启用',
		prop: 'isUse',
		type: 'radio',
		options: [
			{ label: '启用', value: 'yes' },
			{ label: '不启用', value: 'no' },
		],
	},
];

// 表单验证规则
const formRules: FormRules = {
	title: [
		{ required: true, message: '请输入站点标题', trigger: 'blur' },
		{ min: 1, max: 50, message: '标题长度在 1 到 50 个字符', trigger: 'blur' },
	],
	keywords: [
		{ required: true, message: '请输入关键词', trigger: 'blur' },
		{ min: 1, max: 100, message: '关键词长度在 1 到 100 个字符', trigger: 'blur' },
	],
	description: [
		{ required: true, message: '请输入站点描述', trigger: 'blur' },
		{ min: 1, max: 200, message: '描述长度在 1 到 200 个字符', trigger: 'blur' },
	],
	domain: [
		{ required: true, message: '请输入域名', trigger: 'blur' },
		{
			pattern: /^https?:\/\/.+/,
			message: '请输入正确的域名格式，如：http://example.com',
			trigger: 'blur',
		},
	],
	logo: [{ message: '请输入图片链接', trigger: 'blur' }],
	isUse: [{ required: true, message: '请选择是否启用', trigger: 'change' }],
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
