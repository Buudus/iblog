import { ElMessage } from 'element-plus';
import { adminUserApi } from '~/api';
import type { AdminUser } from '~/api/types';

export interface LoginForm {
	username: string;
	password: string;
	captcha: string;
}

export interface LoginResponse {
	token: string;
	userInfo: AdminUser;
}

export function useAdminAuth() {
	const router = useRouter();
	const token = useCookie<string>('token', {
		maxAge: 60 * 60 * 24 * 7, // 7天
		secure: true,
		sameSite: 'strict',
	});
	const userInfo = useCookie<AdminUser | null>('userInfo', {
		maxAge: 60 * 60 * 24 * 7, // 7天
		secure: true,
		sameSite: 'strict',
	});

	// 是否已登录
	const isLoggedIn = computed(() => !!token.value && !!userInfo.value);

	// 登录
	const login = async (formData: LoginForm): Promise<boolean> => {
		try {
			const result = await adminUserApi.login(formData);

			if (result.code === 200 && result.data) {
				// 保存 token 和用户信息
				token.value = result.data.token;
				userInfo.value = result.data.userInfo;

				ElMessage.success(result.message || '登录成功');
				return true;
			} else {
				ElMessage.error(result.message || '登录失败');
				return false;
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '登录失败，请重试';
			ElMessage.error(errorMessage);
			return false;
		}
	};

	// 登出
	const logout = async (): Promise<void> => {
		token.value = '';
		userInfo.value = null;
		ElMessage.success('已退出登录');
		await router.push('/admin/login');
	};

	// 检查登录状态
	const checkAuth = (): boolean => {
		if (!isLoggedIn.value) {
			ElMessage.warning('请先登录');
			router.push('/admin/login');
			return false;
		}
		return true;
	};

	// 更新本地缓存的用户信息（例如个人中心修改头像/昵称后）
	const updateUserInfo = (payload: Partial<AdminUser>): void => {
		if (!userInfo.value) return;
		userInfo.value = {
			...userInfo.value,
			...payload,
		};
	};

	return {
		token: readonly(token),
		userInfo: readonly(userInfo),
		isLoggedIn,
		login,
		logout,
		checkAuth,
		updateUserInfo,
	};
}
