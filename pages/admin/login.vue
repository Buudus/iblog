<template>
	<div class="login-page">
		<div class="login-container">
			<div class="login-box">
				<!-- Logo 和标题 -->
				<div class="login-header">
					<div class="logo">
						<i class="bi bi-journal-text text-5xl text-blue-500" />
					</div>
					<h1 class="title">蓝云博客</h1>
					<p class="subtitle">管理员登录</p>
				</div>

				<!-- 登录表单 -->
				<el-form
					ref="loginFormRef"
					:model="loginForm"
					:rules="loginRules"
					class="login-form"
					label-position="top"
					size="large">
					<!-- 用户名 -->
					<el-form-item label="用户名" prop="username">
						<el-input
							v-model="loginForm.username"
							placeholder="请输入用户名"
							clearable
							@keyup.enter="handleLogin">
							<template #prefix>
								<el-icon><User /></el-icon>
							</template>
						</el-input>
					</el-form-item>

					<!-- 密码 -->
					<el-form-item label="密码" prop="password">
						<el-input
							v-model="loginForm.password"
							type="password"
							placeholder="请输入密码"
							show-password
							clearable
							@keyup.enter="handleLogin">
							<template #prefix>
								<el-icon><Lock /></el-icon>
							</template>
						</el-input>
					</el-form-item>

					<!-- 验证码 -->
					<el-form-item label="验证码" prop="captcha">
						<div class="captcha-wrapper">
							<el-input
								v-model="loginForm.captcha"
								placeholder="请输入验证码"
								clearable
								class="captcha-input"
								@keyup.enter="handleLogin">
								<template #prefix>
									<el-icon><Key /></el-icon>
								</template>
							</el-input>
							<div class="captcha-image" :title="'点击刷新验证码'" @click="refreshCaptcha">
								<div v-if="captchaLoading" class="captcha-loading">
									<el-icon class="is-loading">
										<Loading />
									</el-icon>
								</div>
								<div v-else-if="captchaSvg" class="captcha-svg" v-html="captchaSvg" />
								<div v-else class="captcha-placeholder">
									<el-icon><Picture /></el-icon>
									<span>点击获取验证码</span>
								</div>
							</div>
						</div>
					</el-form-item>

					<!-- 登录按钮 -->
					<el-form-item>
						<el-button
							type="primary"
							class="login-button"
							:loading="loginLoading"
							@click="handleLogin">
							{{ loginLoading ? '登录中...' : '登录' }}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script name="LoginPage" lang="ts" setup>
import md5 from 'md5';
import { captchaApi } from '~/api';
import { useAdminAuth } from '~/composables/useAdminAuth';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

// 登录页面不需要认证，且只在客户端渲染
definePageMeta({
	middleware: [],
	ssr: false, // 禁用服务端渲染，避免 SSR 问题
});

// 路由
const router = useRouter();
const route = useRoute();

// 登录相关
const { login, isLoggedIn } = useAdminAuth();

// 表单引用
const loginFormRef = ref<FormInstance>();

// 表单数据
const loginForm = reactive({
	username: '',
	password: '',
	captcha: '',
});

// 表单验证规则
const loginRules: FormRules = {
	username: [
		{ required: true, message: '请输入用户名', trigger: 'blur' },
		{ min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
	],
	captcha: [
		{ required: true, message: '请输入验证码', trigger: 'blur' },
		{ min: 4, max: 6, message: '验证码长度为 4-6 个字符', trigger: 'blur' },
	],
};

// 验证码相关
const captchaSvg = ref<string>('');
const captchaLoading = ref<boolean>(false);

// 登录状态
const loginLoading = ref<boolean>(false);

// 加载验证码
const loadCaptcha = async (): Promise<void> => {
	captchaLoading.value = true;
	try {
		const result = await captchaApi.getCaptcha();
		if (result.code === 200 && result.data?.captcha) {
			captchaSvg.value = result.data.captcha;
		} else {
			throw new Error(result.message || '获取验证码失败');
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '获取验证码失败';
		ElMessage.error(errorMessage);
		captchaSvg.value = '';
	} finally {
		captchaLoading.value = false;
	}
};

// 刷新验证码
const refreshCaptcha = async (): Promise<void> => {
	loginForm.captcha = '';
	await loadCaptcha();
};

// 处理登录
const handleLogin = async (): Promise<void> => {
	if (!loginFormRef.value) return;

	// 表单验证
	await loginFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return;
		}

		loginLoading.value = true;
		try {
			const success = await login({
				...loginForm,
				password: md5(loginForm.password),
			});
			if (success) {
				// 登录成功，等待 Cookie 更新后再跳转
				await nextTick();
				// 使用 navigateTo 进行跳转，它会等待路由准备就绪
				const redirect = (route.query.redirect as string) || '/admin';
				await navigateTo(redirect, { replace: true });
			} else {
				// 登录失败，刷新验证码
				await refreshCaptcha();
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '登录失败';
			ElMessage.error(errorMessage);
			await refreshCaptcha();
		} finally {
			loginLoading.value = false;
		}
	});
};

// 如果已登录，直接跳转（仅在客户端执行）
if (process.client && isLoggedIn.value) {
	router.replace('/admin');
}

// 仅在客户端加载验证码
onMounted(async () => {
	await loadCaptcha();
});
</script>

<style lang="scss" scoped>
.login-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 20px;
}

.login-container {
	width: 100%;
	max-width: 420px;
}

.login-box {
	background: var(--el-bg-color);
	border-radius: 12px;
	padding: 40px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
	text-align: center;
	margin-bottom: 32px;

	.logo {
		margin-bottom: 16px;
	}

	.title {
		font-size: 28px;
		font-weight: 600;
		color: var(--el-text-color-primary);
		margin: 0 0 8px 0;
	}

	.subtitle {
		font-size: 14px;
		color: var(--el-text-color-secondary);
		margin: 0;
	}
}

.login-form {
	:deep(.el-form-item__label) {
		font-weight: 500;
		color: var(--el-text-color-primary);
		padding-bottom: 8px;
	}

	:deep(.el-input__wrapper) {
		border-radius: 8px;
	}
}

.captcha-wrapper {
	display: flex;
	gap: 12px;
	align-items: flex-start;

	.captcha-input {
		flex: 1;
	}

	.captcha-image {
		width: 120px;
		height: 40px;
		border: 1px solid var(--el-border-color);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		background: var(--el-bg-color-page);
		transition: all 0.3s;
		overflow: hidden;
		flex-shrink: 0;

		&:hover {
			border-color: var(--el-color-primary);
			box-shadow: 0 0 0 1px var(--el-color-primary-light-8);
		}

		.captcha-loading {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;

			.el-icon {
				font-size: 20px;
				color: var(--el-color-primary);
			}
		}

		.captcha-svg {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			:deep(svg) {
				width: 100%;
				height: 100%;
			}
		}

		.captcha-placeholder {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 4px;
			color: var(--el-text-color-placeholder);
			font-size: 12px;

			.el-icon {
				font-size: 18px;
			}
		}
	}
}

.login-button {
	width: 100%;
	height: 44px;
	font-size: 16px;
	font-weight: 500;
	border-radius: 8px;
	margin-top: 8px;
}

// 暗色模式适配
.dark {
	.login-box {
		background: var(--el-bg-color);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}

	.captcha-image {
		background: var(--el-bg-color-page);
	}
}
</style>
