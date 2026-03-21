/**
 * 后台路由守卫（全局中间件）
 * 保护所有 /admin 路由（除了登录页）
 * 全局中间件会自动应用到所有路由
 */
export default defineNuxtRouteMiddleware((to) => {
	// 排除登录页
	if (to.path === '/admin/login') {
		return;
	}

	// 检查是否是后台路由
	if (to.path.startsWith('/admin')) {
		// 在服务端和客户端都检查登录状态
		const token = useCookie<string>('token');
		const userInfo = useCookie('userInfo');

		// 如果未登录，跳转到登录页
		if (!token.value || !userInfo.value) {
			return navigateTo({
				path: '/admin/login',
				query: {
					redirect: to.fullPath,
				},
			});
		}
	}
});
