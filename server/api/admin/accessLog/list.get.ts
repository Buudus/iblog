import { error } from '~/server/utils/util.logger';
import AccessLogModel from '~/server/models/accessLog.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /admin/accessLog/list 获取访问日志列表
 * @apiName 获取访问日志列表
 * @apiGroup 访问日志
 * @apiDescription 获取访问日志列表，支持按 userAgent、path、method、ip 进行模糊搜索，按 statusCode 精确筛选，并支持分页
 *
 * @apiPermission admin
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配 userAgent、path、method、ip 任一字段）
 * @apiQuery {Number} [statusCode] 按 statusCode 精确筛选
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [pageSize=10] 每页条数
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 响应数据
 * @apiSuccess {String} data._id 日志ID
 * @apiSuccess {String} data.ip IP地址
 * @apiSuccess {String} data.userAgent 用户代理
 * @apiSuccess {String} data.path 请求路径
 * @apiSuccess {String} data.method 请求方法
 * @apiSuccess {Number} data.statusCode 状态码
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {String} data.updatedAt 更新时间
 * @apiSuccess {Number} total 总条数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 * 				"list": [
 * 					{
 * 						"_id": "60c72b2f9b1d8e001c8e4b8a",
 * 						"ip": "127.0.0.1",
 * 						"path": "/api/admin/accessLog/list",
 * 						"method": "GET",
 * 						"statusCode": 200,
 * 						"createdAt": "2021-04-25T09:55:03.000Z",
 * 						"updatedAt": "2021-04-25T09:55:03.000Z"
 * 					},
 * 					{
 * 						"_id": "60c72b2f9b1d8e001c8e4b8b",
 * 						"ip": "127.0.0.1",
 * 						"path": "/api/admin/accessLog/list",
 * 						"method": "GET",
 * 						"statusCode": 200,
 * 						"createdAt": "2021-04-25T09:55:03.000Z",
 * 						"updatedAt": "2021-04-25T09:55:03.000Z"
 * 					}
 * 				],
 *       	"total": 2
 * 			  },
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const keywords = query.keywords ? String(query.keywords) : '';
		const statusCode = query.statusCode ? Number(query.statusCode) : undefined;
		const page = query.page ? Number(query.page) : 1;
		const pageSize = query.pageSize ? Number(query.pageSize) : 10;

		const filter: Record<string, unknown> = {};
		if (keywords) {
			const escaped = String(keywords).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = { $regex: escaped, $options: 'i' };
			filter.$or = [{ userAgent: regex }, { path: regex }, { method: regex }, { ip: regex }];
		}
		if (statusCode) filter.statusCode = Number(statusCode);

		const skip = (Number(page) - 1) * Number(pageSize);
		const limit = Number(pageSize);

		const [data, total] = await Promise.all([
			AccessLogModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
			AccessLogModel.countDocuments(filter),
		]);

		return resultFormat(200, '获取成功', { list: data, total });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
