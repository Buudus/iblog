/**
 * 验证码校验中间件
 * 用于需要验证码校验的接口
 * 在请求体中必须包含 captcha 字段
 * 只对特定路径的 POST 请求进行验证码校验
 */

// 需要验证码校验的路径
const CAPTCHA_REQUIRED_PATHS = [
	'/api/client/friendlyLink/apply',
	'/api/admin/user/login',
	'/api/client/leaveMessage/publish',
];

export default defineEventHandler(async (event) => {
	// 检查当前路径是否需要验证码校验
	const currentPath = event.path;
	const needsCaptcha = CAPTCHA_REQUIRED_PATHS.some((path) => currentPath.includes(path));

	if (!needsCaptcha) return;

	// 获取请求体中的验证码
	const body = await readBody(event);
	const captcha = body.captcha;

	if (!captcha) {
		throw createError({
			statusCode: 400,
			statusMessage: '缺少验证码',
		});
	}

	// 获取会话中的验证码
	const session = await getUserSession(event);
	if (!session?.captcha) {
		throw createError({
			statusCode: 400,
			statusMessage: '验证码已过期，请重新获取',
		});
	}

	// 比较验证码（不区分大小写）
	if (captcha.toLowerCase() !== (session.captcha as string).toLowerCase()) {
		throw createError({
			statusCode: 400,
			statusMessage: '验证码错误',
		});
	}

	// 验证成功后清除会话中的验证码
	await setUserSession(event, {
		captcha: null,
	});

	// 验证通过，继续处理请求
});
