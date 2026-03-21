import { error } from '~/server/utils/util.logger';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {post} /client/captcha/verify 校验验证码
 * @apiName 校验验证码
 * @apiGroup 验证码
 * @apiDescription 校验用户输入的验证码是否正确
 *
 * @apiSampleRequest /client/captcha/verify
 *
 * @apiBody {String} captcha 用户输入的验证码
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "验证码正确"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const captcha = (await readBody(event)).captcha;

		if (!captcha) {
			return resultFormat(400, '缺少验证码');
		}

		// 获取会话中的验证码
		const session = await getUserSession(event);

		if (!session?.captcha) {
			return resultFormat(400, '验证码已过期，请重新获取');
		}

		// 比较验证码（不区分大小写）
		if (captcha.toLowerCase() !== (session.captcha as string).toLowerCase()) {
			return resultFormat(400, '验证码错误');
		}

		// 验证成功后清除会话中的验证码
		await setUserSession(event, {
			captcha: null,
		});

		return resultFormat(200, '验证码正确');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
