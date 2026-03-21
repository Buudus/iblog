<template>
	<el-form ref="formRef" :model="formData" :rules="formRules" :label-width="labelWidth">
		<el-form-item label="用户名" prop="username">
			<el-input
				v-model="formData.username"
				placeholder="请输入用户名"
				:disabled="!!formData._id"
				maxlength="20"
				show-word-limit />
		</el-form-item>

		<el-form-item v-if="!formData._id" label="密码" prop="password">
			<el-input
				v-model="formData.password"
				type="password"
				placeholder="请输入密码"
				show-password
				maxlength="50" />
		</el-form-item>

		<el-form-item label="昵称" prop="nickname">
			<el-input
				v-model="formData.nickname"
				placeholder="请输入昵称"
				maxlength="20"
				show-word-limit />
		</el-form-item>

		<el-form-item label="头像" prop="avatar">
			<div v-if="formData.avatar" class="h-[80px] mb-2">
				<el-image class="h-full" :src="formData.avatar" />
			</div>
			<el-input
				v-model="formData.avatar"
				placeholder="请输入头像链接，如：http://example.com/avatar.png" />
			<div class="mt-2">
				<SingleUpload :handleUpload="handleAvatarUpload" />
			</div>
		</el-form-item>

		<el-form-item label="角色" prop="role">
			<el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
				<el-option
					v-for="role in roleOptions"
					:key="role.value"
					:label="role.label"
					:value="role.value" />
			</el-select>
		</el-form-item>
	</el-form>
</template>

<script name="AdminUserForm" lang="ts" setup>
import type { AdminUser } from '~/api';
import type { FormInstance, FormRules } from 'element-plus';
import SingleUpload from '~/components/Upload/SingleUpload/index.vue';
import { api } from '~/utils/util.fetch';

interface Props {
	modelValue: Omit<AdminUser, 'createdAt' | 'updatedAt' | 'password'> & { password?: string };
}

interface Emits {
	(e: 'update:modelValue', value: Props['modelValue']): void;
	(e: 'upload', file: File, field: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = useTemplateRef<FormInstance>('formRef');
const labelWidth = '100px';

// 表单数据 - 使用 reactive 来支持双向绑定
const formData = reactive<Props['modelValue']>(props.modelValue);

// 角色选项
const roleOptions = ref<Array<{ label: string; value: string }>>([]);

// 加载角色列表
const loadRoles = async () => {
	try {
		// 从角色API获取角色列表
		const result = await api.get<{ list: Array<{ name: string; description: string }> }>(
			'/api/admin/role/list',
			{ query: { limit: 100 } }
		);
		if (result.data && result.data.list) {
			roleOptions.value = result.data.list.map((role: { name: string; description: string }) => ({
				label: role.description || role.name,
				value: role.name,
			}));
		} else {
			// 如果加载失败，使用默认选项
			roleOptions.value = [
				{ label: '管理员', value: 'admin' },
				{ label: '编辑', value: 'editor' },
				{ label: '查看者', value: 'viewer' },
			];
		}
	} catch {
		// 如果加载失败，使用默认选项
		roleOptions.value = [
			{ label: '管理员', value: 'admin' },
			{ label: '编辑', value: 'editor' },
			{ label: '查看者', value: 'viewer' },
		];
	}
};

// 表单验证规则
const formRules: FormRules = {
	username: [
		{ required: true, message: '请输入用户名', trigger: 'blur' },
		{ min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 6, max: 50, message: '密码长度在 6 到 50 个字符', trigger: 'blur' },
	],
	nickname: [
		{ required: true, message: '请输入昵称', trigger: 'blur' },
		{ min: 1, max: 20, message: '昵称长度在 1 到 20 个字符', trigger: 'blur' },
	],
	avatar: [{ message: '请输入头像链接', trigger: 'blur' }],
	role: [{ required: true, message: '请选择角色', trigger: 'change' }],
};

// 文件上传
const handleUpload = (file: File, field: string) => {
	emit('upload', file, field);
};

// 头像上传处理
const handleAvatarUpload = (file: File) => {
	handleUpload(file, 'avatar');
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

// 初始化加载角色
onMounted(() => {
	loadRoles();
});
</script>
