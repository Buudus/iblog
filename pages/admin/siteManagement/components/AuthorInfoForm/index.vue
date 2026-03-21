<template>
	<DataForm
		ref="formRef"
		:model-value="formData"
		:fields="fields"
		:rules="formRules"
		@update:model-value="handleUpdate"
		@upload="handleUpload" />
</template>

<script name="AuthorInfoForm" lang="ts" setup>
import type { AuthorInfo } from '~/api';
import type { FormRules } from 'element-plus';
import DataForm from '~/components/DataForm/index.vue';
import type { FormField } from '~/components/DataForm/index.vue';

interface Props {
	modelValue:
		| Omit<AuthorInfo, '_id' | 'createdAt' | 'updatedAt'>
		| Omit<AuthorInfo, 'createdAt' | 'updatedAt'>;
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
		label: '头像',
		prop: 'avatar',
		type: 'image',
		placeholder: '请输入图片链接，如：http://example.com/avatar.png',
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
		label: '签名',
		prop: 'ps',
		type: 'input',
		placeholder: '请输入个性签名',
		maxlength: 100,
		showWordLimit: true,
	},
	{
		label: '简介',
		prop: 'biography',
		type: 'textarea',
		placeholder: '请输入简介（支持 HTML）',
		rows: 3,
		maxlength: 300,
		showWordLimit: true,
	},
	{
		label: 'QQ',
		prop: 'qq',
		type: 'input',
		placeholder: '请输入QQ',
	},
	{
		label: '微信',
		prop: 'wechat',
		type: 'input',
		placeholder: '请输入微信',
	},
	{
		label: '邮箱',
		prop: 'email',
		type: 'input',
		placeholder: '请输入邮箱',
	},
	{
		label: 'GitHub',
		prop: 'github',
		type: 'input',
		placeholder: '请输入GitHub',
	},
	{
		label: '微博',
		prop: 'weibo',
		type: 'input',
		placeholder: '请输入微博',
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
	name: [
		{ required: true, message: '请输入名称', trigger: 'blur' },
		{ min: 1, max: 50, message: '名称长度在 1 到 50 个字符', trigger: 'blur' },
	],
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{
			pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
			message: '请输入正确的邮箱格式',
			trigger: 'blur',
		},
	],
	avatar: [{ required: true, message: '请输入头像链接或上传图片', trigger: 'blur' }],
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
