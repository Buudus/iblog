import { error } from '~/server/utils/util.logger';
import AccessLogModel from '~/server/models/accessLog.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /admin/dashboard/recentAccessLogs 获取最近访问日志
 * @apiName 获取最近访问日志
 * @apiGroup 仪表盘
 * @apiDescription 获取最近的访问日志列表，按创建时间倒序，用于仪表盘快捷展示
 *
 * @apiPermission admin
 *
 * @apiQuery {Number} [limit=10] 返回数量，默认 10
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 访问日志列表
 * @apiSuccess {String} data._id 日志ID
 * @apiSuccess {String} data.ip IP 地址
 * @apiSuccess {String} data.path 请求路径
 * @apiSuccess {String} data.method 请求方法
 * @apiSuccess {Number} data.statusCode HTTP 状态码
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": [
 *         {
 *           "_id": "60c72b2f9b1d8e001c8e4b8a",
 *           "ip": "192.168.1.100",
 *           "path": "/api/client/article/list",
 *           "method": "GET",
 *           "statusCode": 200,
 *           "createdAt": "2024-01-20T10:30:00.000Z"
 *         }
 *       ]
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const limit = query.limit ? Number(query.limit) : 10;

		const logs = await AccessLogModel.find({})
			.sort({ createdAt: -1 })
			.limit(limit)
			.select('ip path method statusCode createdAt');

		return resultFormat(200, '获取成功', logs);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		return resultFormat(500, errorMessage);
	}
});
