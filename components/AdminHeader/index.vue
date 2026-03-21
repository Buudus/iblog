<template>
	<div class="admin-header w-full h-full">
		<div class="flex items-center justify-between shadow relative z-20">
			<div class="left flex items-center">
				<!-- 折叠侧边栏 -->
				<div
					class="w-[60px] h-[60px] flex items-center justify-center cursor-pointer hover:bg-gray-100"
					@click="collapseSideNavigation">
					<i
						v-show="!adminAsideStore.asideCollapse"
						class="bi bi-text-indent-right text-xl text-gray-600" />
					<i
						v-show="adminAsideStore.asideCollapse"
						class="bi bi-text-indent-left text-xl text-gray-600" />
				</div>
				<nuxt-link to="/admin">
					<div class="logo w-fit h-7 flex items-center ml-2">
						<img
							class="w-7 h-7 rounded-full shadow"
							src="/favicon.ico"
							alt="logo"
							title="蓝云博客后台管理系统" />
						<h1
							class="admin-title ml-2 text-sm text-shadow-xs text-blue-500 w-36 duration-300 truncate">
							蓝云博客后台管理系统
						</h1>
					</div>
				</nuxt-link>
			</div>
			<div class="right pr-5 flex items-center">
				<div class="theme mx-2 flex items-center gap-2 cursor-pointer" @click="toggleTheme">
					<el-icon v-show="!isDarkTheme" :size="18" color="var(--admin-muted-text-color)">
						<i class="bi bi-moon-stars" />
					</el-icon>
					<el-icon v-show="isDarkTheme" :size="18" color="var(--admin-muted-text-color)">
						<i class="bi bi-sun" />
					</el-icon>
				</div>
				<div class="full-screen flex items-center mx-3 cursor-pointer" @click="screenfullToggle">
					<el-icon :size="17" color="var(--admin-muted-text-color)"><FullScreen /></el-icon>
				</div>
				<div class="setting flex items-center mx-3 cursor-pointer">
					<nuxt-link to="/admin/systemSettings">
						<el-icon :size="17" color="var(--admin-muted-text-color)"><Setting /></el-icon>
					</nuxt-link>
				</div>
				<el-dropdown trigger="click">
					<div class="user flex items-center cursor-pointer hover:opacity-80 duration-300 ml-2">
						<div class="avatar w-8 h-8 rounded-full overflow-hidden shadow">
							<img
								class="w-full h-full"
								:src="userInfo?.avatar"
								:alt="userInfo?.nickname || 'avatar'" />
						</div>
						<span class="nickname text-[#666] ml-2 font-bold">
							{{ userInfo?.nickname }}
						</span>
						<el-icon class="el-icon--right"><arrow-down /></el-icon>
					</div>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="handleGoProfile">个人中心</el-dropdown-item>
							<el-dropdown-item @click="changePasswordVisible = true">修改密码</el-dropdown-item>
							<el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
		<div class="w-full page-tags relative shadow z-10">
			<el-scrollbar class="w-full">
				<TagPageList />
			</el-scrollbar>
			<div
				class="close-all w-5 h-full absolute top-0 right-0 bg-white flex items-center justify-center z-0">
				<el-icon
					class="cursor-pointer"
					color="var(--admin-muted-text-color)"
					title="关闭所有标签"
					@click="adminAsideStore.closeAllTab">
					<CloseBold />
				</el-icon>
			</div>
		</div>
		<el-drawer v-model="drawerNavVisible" direction="ltr" :with-header="false" size="220px">
			<template #default>
				<AdminAside :is-collapse="false" />
			</template>
		</el-drawer>
	</div>
	<ElsDialog v-model="changePasswordVisible" title="修改密码">
		<el-form
			ref="changePasswordFormRef"
			:model="changePasswordForm"
			:rules="changePasswordRules"
			label-position="top"
			size="default">
			<el-form-item label="旧密码" prop="oldPassword">
				<el-input
					v-model="changePasswordForm.oldPassword"
					type="password"
					placeholder="请输入旧密码"
					show-password
					clearable
					autocomplete="off" />
			</el-form-item>
			<el-form-item label="新密码" prop="newPassword">
				<el-input
					v-model="changePasswordForm.newPassword"
					type="password"
					placeholder="请输入新密码"
					show-password
					clearable
					autocomplete="new-password" />
			</el-form-item>
			<el-form-item label="确认新密码" prop="confirmPassword">
				<el-input
					v-model="changePasswordForm.confirmPassword"
					type="password"
					placeholder="请再次输入新密码"
					show-password
					clearable
					autocomplete="new-password" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="flex items-center justify-end gap-2">
				<el-button @click="handleChangePasswordCancel">取消</el-button>
				<el-button
					type="primary"
					:loading="changePasswordLoading"
					@click="handleChangePasswordSubmit">
					确认
				</el-button>
			</div>
		</template>
	</ElsDialog>
</template>

<script lang="ts">
import md5 from 'md5';
import screenfull from 'screenfull';
import { storeToRefs } from 'pinia';
import { adminUserApi } from '~/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAdminAuth } from '~/composables/useAdminAuth';
import type { FormInstance, FormRules } from 'element-plus';

export default defineComponent({
	name: 'AdminHeader',
	setup() {
		const router = useRouter();
		const screenStore = useScreenStore();
		const themeStore = useThemeStore();
		const adminAsideStore = useAdminAsideStore();

		// 使用登录认证 composable
		const { userInfo, logout } = useAdminAuth();

		const drawerNavVisible = ref<boolean>(false);
		watch(
			() => screenStore.screenMode,
			(val): void => {
				if (val !== 'mobile') {
					drawerNavVisible.value = false;
				}
			},
		);

		// 折叠侧边栏
		const collapseSideNavigation = (): void => {
			if (screenStore.screenMode === 'mobile') {
				drawerNavVisible.value = true;
				return;
			}

			adminAsideStore.asideCollapse = !adminAsideStore.asideCollapse;
		};

		const screenfullToggle = (): void => {
			if (screenfull.isEnabled) {
				screenfull.toggle();
			} else {
				ElMessage({
					message: '当前浏览器不支持全屏操作',
					type: 'warning',
				});
			}
		};

		const { currentTheme } = storeToRefs(themeStore);
		const isDarkTheme = computed(() => currentTheme.value === 'dark');
		const toggleTheme = () => {
			themeStore.toggleTheme();
		};

		// 处理退出登录
		const handleLogout = async (): Promise<void> => {
			try {
				await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				});
				await logout();
			} catch {
				// 用户取消，不做任何操作
			}
		};

		// 跳转个人中心
		const handleGoProfile = (): void => {
			router.push('/admin/profile');
		};

		// 修改密码弹窗
		const changePasswordVisible = ref<boolean>(false);
		const changePasswordFormRef = useTemplateRef<FormInstance>('changePasswordFormRef');
		const changePasswordLoading = ref<boolean>(false);
		const changePasswordForm = reactive({
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
		});

		const changePasswordRules: FormRules = {
			oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
			newPassword: [
				{ required: true, message: '请输入新密码', trigger: 'blur' },
				{ min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
			],
			confirmPassword: [
				{ required: true, message: '请再次输入新密码', trigger: 'blur' },
				{
					validator: (_rule, value, callback) => {
						if (value !== changePasswordForm.newPassword) {
							callback(new Error('两次输入的新密码不一致'));
						} else {
							callback();
						}
					},
					trigger: 'blur',
				},
			],
		};

		const resetChangePasswordForm = (): void => {
			changePasswordForm.oldPassword = '';
			changePasswordForm.newPassword = '';
			changePasswordForm.confirmPassword = '';
			changePasswordFormRef.value?.clearValidate();
		};

		const handleChangePasswordCancel = (): void => {
			changePasswordVisible.value = false;
			resetChangePasswordForm();
		};

		const handleChangePasswordSubmit = async (): Promise<void> => {
			if (!changePasswordFormRef.value) return;
			const valid = await changePasswordFormRef.value.validate().catch(() => false);
			if (!valid) return;

			changePasswordLoading.value = true;
			try {
				const result = await adminUserApi.changePassword({
					oldPassword: md5(changePasswordForm.oldPassword),
					newPassword: md5(changePasswordForm.newPassword),
				});
				if (result.code === 200) {
					ElMessage.success(result.message ?? '密码修改成功');
					changePasswordVisible.value = false;
					resetChangePasswordForm();
				} else {
					ElMessage.error(result.message ?? '修改失败');
				}
			} catch (err: unknown) {
				const msg = err instanceof Error ? err.message : '修改失败';
				ElMessage.error(String(msg));
			} finally {
				changePasswordLoading.value = false;
			}
		};

		return {
			userInfo,
			isDarkTheme,
			adminAsideStore,
			drawerNavVisible,
			changePasswordVisible,
			changePasswordForm,
			changePasswordRules,
			changePasswordLoading,
			toggleTheme,
			handleLogout,
			handleGoProfile,
			handleChangePasswordCancel,
			handleChangePasswordSubmit,
			screenfullToggle,
			collapseSideNavigation,
		};
	},
});
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
	.admin-title {
		width: 0;
	}
}

.admin-header {
	color: var(--admin-text-color);

	> .flex {
		background-color: var(--admin-card-bg);
		border-bottom: 1px solid var(--admin-border-color);
	}
}

.admin-header .admin-title {
	color: var(--admin-text-color);
}

.admin-header .right :deep(.el-icon) {
	color: var(--admin-muted-text-color);
}

.page-tags {
	background-color: var(--admin-card-bg);
	border-bottom: 1px solid var(--admin-border-color);
	color: var(--admin-text-color);
}

.page-tags .close-all {
	background-color: var(--admin-card-bg);
	border-left: 1px solid var(--admin-border-color);
}

:deep(.el-scrollbar__view) {
	padding: 5px 0;
}
</style>
