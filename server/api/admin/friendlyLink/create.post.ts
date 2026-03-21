import { error } from '~/server/utils/util.logger';
import FriendlyLinkModel from '~/server/models/friendlyLink.model';

/**
 * @api {post} /admin/friendlyLink/create 创建友链
 * @apiName 创建友链
 * @apiGroup 后台友链管理
 * @apiDescription 创建新的友链（管理员权限）
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/friendlyLink/create
 *
 * @apiHeader {String} Authorization 用户授权 Token
 *
 * @apiBody {Object} friendlyLink 友链对象（也支持直接传平铺对象）
 * @apiBody {String} friendlyLink.name 友链名称
 * @apiBody {String} friendlyLink.url 友链地址
 * @apiBody {String="pending","approved","rejected"} [friendlyLink.status=pending] 友链状态
 * @apiBody {String} [friendlyLink.icon] 友链图标
 * @apiBody {String} [friendlyLink.description] 友链描述
 * @apiBody {String} friendlyLink.email 联系邮箱
 * @apiBody {String} [friendlyLink.remark] 备注
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "code": 201,
 *       "message": "创建成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);

		const friendlyLink = body?.friendlyLink;

		if (!friendlyLink || typeof friendlyLink !== 'object') {
			return resultFormat(400, '请求参数错误');
		}

		const { name, url, email } = friendlyLink;

		// 必填校验
		if (!name || !url || !email) {
			return resultFormat(400, '缺少必要参数：name、url、email');
		}

		// 创建记录（其余字段交由模型默认值与枚举校验）
		await FriendlyLinkModel.create({
			name: String(name).trim(),
			url: String(url).trim(),
			icon: friendlyLink.icon ?? '',
			status: friendlyLink.status ?? 'pending',
			description: friendlyLink.description ?? '',
			email: String(email).trim(),
			remark: friendlyLink.remark ?? '',
		});

		return resultFormat(201, '创建成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
