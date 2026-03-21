import { error } from '~/server/utils/util.logger';
import FriendlyLinkModel from '~/server/models/friendlyLink.model';

/**
 * @api {delete} /admin/friendlyLink/delete 删除友链
 * @apiName 删除友链
 * @apiGroup 友链管理
 * @apiDescription 删除一个或多个友链，支持批量删除
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/friendlyLink/delete
 *
 * @apiQuery {String} ids 以 , 分隔的 ID 字符串，例如： id1,id2,id3
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "删除成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);

		const ids = String(query.ids).split(',');

		if (!ids || ids.length < 1) {
			return resultFormat(400, '请求参数错误');
		}

		const result = await FriendlyLinkModel.deleteMany({ _id: { $in: ids } });

		if (result.deletedCount < 1) {
			return resultFormat(404, '未找到要删除的友链');
		}

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 条记录`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
