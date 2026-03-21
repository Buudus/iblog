import { error } from '~/server/utils/util.logger';
import { md5, sha256 } from '~/server/utils/util.crypto';
import AdminUserModel from '~/server/models/adminUser.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {put} /admin/user/resetPassword 重置用户密码
 * @apiName 重置用户密码
 * @apiGroup 后台用户管理
 * @apiDescription 仅超级管理员可重置其他用户密码，不能重置超级管理员的密码，重置后的密码为 Abc.123987
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/user/resetPassword
 *
 * @apiBody {String} username 用户名
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "重置成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		// 校验当前用户是否为超级管理员
		const adminUser = event.context.adminUser;
		if (!adminUser || adminUser.role !== 'admin') {
			return resultFormat(403, '无权限，只有超级管理员可以重置密码');
		}

		// 获取请求体
		const { username } = await readBody(event);
		if (!username) {
			return resultFormat(400, '请提供用户名');
		}
		if (username === 'admin') {
			return resultFormat(403, '禁止重置超级管理员的密码');
		}

		const newPassword = sha256(md5(md5('Abc.123987')));
		const result = await AdminUserModel.updateOne(
			{ username },
			{ $set: { password: newPassword } }
		);

		if (result.matchedCount === 0) {
			return resultFormat(404, '用户不存在');
		}

		return resultFormat(200, '重置成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		console.error(err);
		return resultFormat(500, errorMessage);
	}
});
