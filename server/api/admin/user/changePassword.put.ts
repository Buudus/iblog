import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import { md5, sha256 } from '~/server/utils/util.crypto';
import AdminUserModel from '~/server/models/adminUser.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {put} /admin/user/changePassword 修改密码
 * @apiName 修改密码
 * @apiGroup 后台用户管理
 * @apiDescription 用于用户修改自己的密码，需要提供旧密码进行验证
 *
 * @apiPermission 需要登录
 *
 * @apiSampleRequest /admin/user/changePassword
 *
 * @apiBody {String} oldPassword 旧密码
 * @apiBody {String} newPassword 新密码
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "密码修改成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const { adminUser } = event.context;
		if (!adminUser?.username) {
			return resultFormat(401, '未登录或登录已过期');
		}

		const { oldPassword, newPassword } = await readBody(event);
		if (!oldPassword || !newPassword) {
			return resultFormat(400, '旧密码和新密码不能为空');
		}

		const currentUser = await AdminUserModel.findOne({ username: adminUser.username });
		if (!currentUser) {
			return resultFormat(404, '用户不存在');
		}

		const encryptedOldPassword = sha256(md5(oldPassword));
		if (currentUser.password !== encryptedOldPassword) {
			return resultFormat(400, '旧密码错误');
		}

		const encryptedNewPassword = sha256(md5(newPassword));
		if (currentUser.password === encryptedNewPassword) {
			return resultFormat(400, '新密码不能与旧密码相同');
		}

		const result = await AdminUserModel.updateOne(
			{ username: adminUser.username },
			{
				$set: {
					password: encryptedNewPassword,
					updatedAt: dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
				},
			}
		);

		if (result.matchedCount === 0) {
			return resultFormat(500, '修改失败');
		}

		return resultFormat(200, '密码修改成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
