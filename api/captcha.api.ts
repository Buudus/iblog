import { api } from '~/utils/util.fetch';

// 验证码 API
export const captchaApi = {
	// 获取验证码
	getCaptcha: () =>
		api.get<{ captcha: string }>('/api/client/captcha/getCaptcha', { showLoading: false }),

	// 校验验证码
	verify: (captcha: string) => api.post('/api/client/captcha/verify', { captcha }),
};
