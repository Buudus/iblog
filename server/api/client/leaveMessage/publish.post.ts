import { getHeader } from 'h3';
import { error } from '~/server/utils/util.logger';
import { getClientIp } from '~/server/utils/util.ipTool';
import LeaveMessageModel from '~/server/models/leaveMessage.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {post} /client/leaveMessage/publish 发布留言
 * @apiName 发布留言
 * @apiGroup 留言
 * @apiDescription 发布一条新的留言
 *
 * @apiBody {Object} leaveMessage 留言对象
 * @apiBody {String} leaveMessage.concat 联系人
 * @apiBody {String} leaveMessage.content 留言内容
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 留言数据
 * @apiSuccess {String} data._id 留言ID
 * @apiSuccess {String} data.concat 联系人
 * @apiSuccess {String} data.content 留言内容
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {String} data.updatedAt 更新时间
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "code": 201,
 *       "message": "留言发布成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);

		if (!body || typeof body !== 'object' || !body.leaveMessage) {
			return resultFormat(400, '请求体必须包含 leaveMessage 对象');
		}

		const { leaveMessage } = body;
		const { concat = '', content = '' } = leaveMessage ?? {};

		if (!concat.trim() || !content.trim()) {
			return resultFormat(400, '联系人和留言内容不能为空');
		}

		const ip = getClientIp(event);
		const userAgent = getHeader(event, 'user-agent') || 'Unknown';

		await LeaveMessageModel.create({
			...leaveMessage,
			concat: concat.trim(),
			content: content.trim(),
			ip,
			userAgent,
		});

		return resultFormat(201, '留言发布成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
