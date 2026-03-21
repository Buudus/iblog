import { error } from '~/server/utils/util.logger';
import AdminUserModel from '~/server/models/adminUser.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /admin/user/list 获取用户列表
 * @apiName 获取用户列表
 * @apiGroup 后台用户管理
 * @apiDescription 获取后台管理用户列表，支持按用户名或昵称进行模糊搜索，并支持分页查询
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/user/list
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配用户名或昵称）
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [limit=10] 每页显示数量
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Object[]} data.users 用户列表
 * @apiSuccess {Number} data.total 总记录数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "users": [
 *           {
 *             "username": "admin",
 *             "nickname": "管理员",
 *             "role": "superadmin"
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
			filter.$or = [{ username: regex }, { nickname: regex }];
		}

		const users = await AdminUserModel.find(filter)
			.skip((page - 1) * limit)
			.limit(limit);

		const total = await AdminUserModel.countDocuments(filter);

		return resultFormat(200, '获取成功', {
			users,
			total,
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		console.error(err);
		return resultFormat(500, errorMessage);
	}
});
