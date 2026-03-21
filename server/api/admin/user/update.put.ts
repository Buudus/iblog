import { error } from '~/server/utils/util.logger';
import AdminUserModel from '~/server/models/adminUser.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {put} /admin/user/update 修改用户资料
 * @apiName 修改用户资料
 * @apiGroup 后台用户管理
 * @apiDescription 用于超级管理员对其他用户资料进行修改
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/user/update
 *
 * @apiBody {Object} user 用户对象
 * @apiBody {String} user.username 用户名
 * @apiBody {String} user.avatar 头像
 * @apiBody {String} user.nickname 昵称
 * @apiBody {String} user.role 用户权限
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "更新成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const context = event.context;

		if (!context.adminUser || context.adminUser.role !== 'admin') {
			return resultFormat(401, '权限不足');
		}

		const body = await readBody(event);

		const user = body.user || {};

		if (!user || !user.username) {
			return resultFormat(400, '请求参数错误');
		}

		if (user.role === 'admin') {
			return resultFormat(400, '禁止同时设置两个超级管理员');
		}

		console.log('user: ', user);

		const result = await AdminUserModel.updateOne(
			{ username: user.username },
			{ $set: { avatar: user.avatar, nickname: user.nickname, role: user.role } }
		);

		if (result.matchedCount === 0) {
			return resultFormat(404, '用户不存在');
		}

		return resultFormat(200, '用户资料更新成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		console.error(err);
		return resultFormat(500, errorMessage);
	}
});
