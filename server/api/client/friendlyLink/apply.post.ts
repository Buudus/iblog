import { error } from '~/server/utils/util.logger';
import FriendlyLinkModel from '~/server/models/friendlyLink.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {post} /client/friendlyLink/apply 友链申请
 * @apiName 友链申请
 * @apiGroup 博客前台
 * @apiDescription 用户提交友链申请，需要验证码校验（字段格式校验由前端完成）
 *
 * @apiSampleRequest /client/friendlyLink/apply
 *
 * @apiBody {Object} friendlyLink 友链对象
 * @apiBody {String} friendlyLink.name 网站名称
 * @apiBody {String} friendlyLink.url 网站链接
 * @apiBody {String} [friendlyLink.icon] 网站图标
 * @apiBody {String} [friendlyLink.description] 网站描述
 * @apiBody {String} friendlyLink.email 联系邮箱
 * @apiBody {String} [friendlyLink.remark] 备注信息
 * @apiBody {String} captcha 验证码（由验证码中间件校验）
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "code": 201,
 *       "message": "友链申请提交成功，请等待审核"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { friendlyLink } = body;

		// 参数校验
		if (!friendlyLink) {
			return resultFormat(400, '缺少友链参数');
		}

		const { name, url, icon, description, email, remark } = friendlyLink;

		// 必填字段校验
		if (!name || !url || !email) {
			return resultFormat(400, '网站名称、链接和邮箱为必填项');
		}

		// 检查是否已存在相同的友链申请（相同URL或邮箱）
		const existingLink = await FriendlyLinkModel.findOne({
			$or: [{ url }, { email }],
		});

		if (existingLink) {
			return resultFormat(400, '该网站或邮箱已提交过友链申请');
		}

		// 创建友链申请
		await FriendlyLinkModel.create({
			name,
			url,
			icon,
			description,
			email,
			remark,
			status: 'pending', // 默认待审核状态
		});

		return resultFormat(201, '友链申请提交成功，请等待审核');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		console.error('友链申请提交失败:', err);
		return resultFormat(500, errorMessage);
	}
});
