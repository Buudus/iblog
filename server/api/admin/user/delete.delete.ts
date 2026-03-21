import { error } from '~/server/utils/util.logger';
import AdminUserModel from '~/server/models/adminUser.model';

/**
 * @api {delete} /admin/user/delete 删除管理员用户
 * @apiName 删除管理员用户
 * @apiGroup 后台用户管理
 * @apiDescription 删除后台管理用户，但不能删除用户名为 admin 的用户
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/user/delete
 *
 * @apiQuery {String} usernames 以 , 分隔的用户名字符串，例如：user1,user2
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
		// 获取用户名（统一为 ids，逗号分隔）
		const query = getQuery(event);
		const usernames = String(query.usernames || '')
			.split(',')
			.filter(Boolean);

		if (!usernames.length) {
			return resultFormat(400, '请求参数错误');
		}

		if (usernames.includes('admin')) {
			return resultFormat(403, '不能删除超级管理员用户');
		}

		// 删除用户（支持批量）
		const result = await AdminUserModel.deleteMany({ username: { $in: usernames } });

		if (result.deletedCount === 0) {
			return resultFormat(404, '用户不存在');
		}

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 个用户`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
