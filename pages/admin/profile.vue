<template>
	<div class="p-4 max-w-3xl mx-auto">
		<LyCard>
			<div class="p-4 space-y-6">
				<h2 class="text-xl font-semibold mb-2">个人中心</h2>

				<el-form
					ref="profileFormRef"
					:model="profileForm"
					:rules="profileRules"
					label-width="80px"
					status-icon>
					<!-- 用户名（只读） -->
					<el-form-item label="用户名">
						<el-input v-model="profileForm.username" disabled />
					</el-form-item>

					<!-- 角色（只读） -->
					<el-form-item label="角色">
						<el-input v-model="profileForm.role" disabled />
					</el-form-item>

					<!-- 昵称 -->
					<el-form-item label="昵称" prop="nickname">
						<el-input
							v-model="profileForm.nickname"
							placeholder="请输入昵称"
							maxlength="20"
							show-word-limit />
					</el-form-item>

					<!-- 头像 -->
					<el-form-item label="头像" prop="avatar">
						<div class="flex items-center gap-4">
							<el-avatar :size="64" :src="profileForm.avatar" />
							<div class="flex-1 space-y-2">
								<el-input v-model="profileForm.avatar" placeholder="请输入头像地址或通过下方上传" />
								<SingleUpload :handleUpload="handleAvatarUpload" />
							</div>
						</div>
					</el-form-item>

					<!-- 创建/更新时间（只读） -->
					<el-form-item label="创建时间" v-if="profileForm.createdAt">
						<el-input v-model="profileForm.createdAt" disabled />
					</el-form-item>
					<el-form-item label="更新时间" v-if="profileForm.updatedAt">
						<el-input v-model="profileForm.updatedAt" disabled />
					</el-form-item>

					<el-form-item>
						<el-button type="primary" :loading="saving" @click="handleSave">保存修改</el-button>
						<el-button @click="handleReset">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</LyCard>
	</div>
</template>

<script name="AdminProfile" lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import SingleUpload from '~/components/Upload/SingleUpload/index.vue';
import { adminUserApi, fileApi } from '~/api';
import type { AdminUser, FileView } from '~/api';
import { useAdminAuth } from '~/composables/useAdminAuth';

const { userInfo, updateUserInfo } = useAdminAuth();

const profileFormRef = useTemplateRef<FormInstance>('profileFormRef');
const saving = ref(false);

interface ProfileForm {
	username: string;
	nickname: string;
	avatar: string;
	role: string;
	createdAt?: string;
	updatedAt?: string;
}

const profileForm = reactive<ProfileForm>({
	username: userInfo.value?.username || '',
	nickname: userInfo.value?.nickname || '',
	avatar: userInfo.value?.avatar || '',
	role: userInfo.value?.role || '',
	createdAt: userInfo.value?.createdAt,
	updatedAt: userInfo.value?.updatedAt,
});

const profileRules: FormRules<ProfileForm> = {
	nickname: [
		{ required: true, message: '昵称不能为空', trigger: 'blur' },
		{ min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' },
	],
	avatar: [{ required: true, message: '请设置头像', trigger: 'blur' }],
};

// 头像上传
const handleAvatarUpload = async (file: File): Promise<void> => {
	try {
		const formData = new FormData();
		formData.append('files', file as unknown as Blob);
		const result = await fileApi.upload(formData);
		const list = result.data as FileView[];
		const first = Array.isArray(list) ? list[0] : null;
		if (first?.url) {
			profileForm.avatar = first.url;
			ElMessage.success('头像上传成功');
		} else {
			ElMessage.error('头像上传失败');
		}
	} catch (error: unknown) {
		const msg = error instanceof Error ? error.message : '头像上传失败';
		ElMessage.error(msg);
	}
};

// 保存
const handleSave = async (): Promise<void> => {
	if (!profileFormRef.value) return;
	const valid = await profileFormRef.value.validate().catch(() => false);
	if (!valid) return;

	saving.value = true;
	try {
		const result = await adminUserApi.updateSelf({
			avatar: profileForm.avatar,
			nickname: profileForm.nickname,
		});
		if (result.code === 200) {
			ElMessage.success(result.message || '保存成功');
			// 同步更新本地缓存的用户信息，保证头部和其他地方立即生效
			updateUserInfo({
				avatar: profileForm.avatar,
				nickname: profileForm.nickname,
			});
		} else {
			ElMessage.error(result.message || '保存失败');
		}
	} catch (error: unknown) {
		const msg = error instanceof Error ? error.message : '保存失败';
		ElMessage.error(msg);
	} finally {
		saving.value = false;
	}
};

// 重置表单为当前 userInfo
const handleReset = (): void => {
	profileForm.username = userInfo.value?.username || '';
	profileForm.nickname = userInfo.value?.nickname || '';
	profileForm.avatar = userInfo.value?.avatar || '';
	profileForm.role = userInfo.value?.role || '';
	profileForm.createdAt = userInfo.value?.createdAt;
	profileForm.updatedAt = userInfo.value?.updatedAt;
	profileFormRef.value?.clearValidate();
};
</script>

<style lang="scss" scoped></style>
