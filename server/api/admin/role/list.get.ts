import AdminRoleModel from '~/server/models/adminRole.model';
import { error } from '~/server/utils/util.logger';

/**
 * @api {get} /admin/role/list 获取权限列表
 * @apiName 获取权限列表
 * @apiGroup 后台权限管理
 * @apiDescription 获取后台管理权限列表，支持按名称或描述进行模糊搜索，并支持分页查询
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/role/list
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配名称或描述）
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [limit=20] 每页显示数量
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Object[]} data.roles 权限列表
 * @apiSuccess {Number} data.total 总记录数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "list": [
 *           {
 *             "name": "admin",
 *             "description": "管理员权限"
 *           }
 *         ],
 *         "total": 1
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const keywords = query.keywords ? String(query.keywords) : '';
		const page = query.page ? parseInt(String(query.page), 10) : 1;
		const limit = query.limit ? parseInt(String(query.limit), 10) : 10;

		const filter: Record<string, unknown> = {};
		if (keywords) {
			const escaped = keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = { $regex: escaped, $options: 'i' };
			filter.$or = [{ name: regex }, { description: regex }];
		}

		const roles = await AdminRoleModel.find(filter)
			.skip((page - 1) * limit)
			.limit(limit);

		const total = await AdminRoleModel.countDocuments(filter);

		return resultFormat(200, '获取成功', { list: roles, total });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
