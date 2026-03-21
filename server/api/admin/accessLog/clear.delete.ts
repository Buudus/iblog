import { error } from '~/server/utils/util.logger';
import AccessLogModel from '~/server/models/accessLog.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {delete} /admin/accessLog/clear 清空访问日志
 * @apiName 清空访问日志
 * @apiGroup 访问日志
 * @apiDescription 清空所有访问日志
 *
 * @apiPermission admin
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "日志已清空"
 *     }
 */
export default defineEventHandler(async () => {
	try {
		await AccessLogModel.deleteMany({});

		return resultFormat(200, '日志已清空');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
