import { error } from '~/server/utils/util.logger';
import LeaveMessageModel from '~/server/models/leaveMessage.model';

/**
 * @api {delete} /admin/leaveMessage/delete 删除留言
 * @apiName 删除留言
 * @apiGroup 留言管理
 * @apiDescription 删除指定的留言，支持批量删除
 *
 * @apiPermission admin
 *
 * @apiQuery {String} ids 以 , 分隔的留言ID字符串，例如：id1,id2,id3
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "删除成功，共删除 5 条留言"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const messageIds = String(query.ids || '')
			.split(',')
			.filter(Boolean);

		if (!messageIds || messageIds.length < 1) {
			return resultFormat(400, '请求参数错误');
		}

		const result = await LeaveMessageModel.deleteMany({ _id: { $in: messageIds } });

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 条留言`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
