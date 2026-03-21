import svgCaptcha from 'svg-captcha';
import { error } from '~/server/utils/util.logger';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /client/captcha/getCaptcha 获取验证码
 * @apiName 获取验证码
 * @apiGroup 验证码
 * @apiDescription 获取一个新的验证码，并将验证码文本存储在会话中
 *
 * @apiSampleRequest /client/captcha/getCaptcha
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 验证码数据
 * @apiSuccess {String} data.captcha 验证码的SVG字符串
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取验证码成功",
 *       "data": {
 *         "captcha": "<svg>...</svg>"
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const captcha = svgCaptcha.create({
			size: 6, // 验证码长度
			ignoreChars: '0o1i', // 排除容易混淆的字符
			noise: 2, // 干扰线条数
			color: true, // 是否使用颜色
		});

		// 将验证码文本存储在会话中
		await setUserSession(event, {
			captcha: captcha.text,
		});

		return resultFormat(200, '获取验证码成功', {
			captcha: captcha.data, // SVG 字符串
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务器错误';
		error(err);
		return resultFormat(500, errorMessage);
	}
});
