import { error } from '~/server/utils/util.logger';
import AccessLogModel from '~/server/models/accessLog.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {delete} /admin/accessLog/delete 删除访问日志
 * @apiName 删除访问日志
 * @apiGroup 访问日志
 * @apiDescription 删除指定的访问日志，支持批量删除
 *
 * @apiPermission admin
 *
 * @apiQuery {String} ids 以 , 分隔的日志ID字符串，例如：id1,id2,id3
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "删除成功，共删除 5 条日志",
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const logIds = String(query.ids || '')
			.split(',')
			.filter(Boolean);

		if (!logIds || logIds.length === 0) {
			return resultFormat(400, '请求参数错误');
		}

		const result = await AccessLogModel.deleteMany({ _id: { $in: logIds } });

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 条日志`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
