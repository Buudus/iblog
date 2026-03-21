import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import AdminUserModel from '~/server/models/adminUser.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {put} /admin/user/updateSelf 更新个人资料
 * @apiName 更新个人资料
 * @apiGroup 后台用户管理
 * @apiDescription 用于用户更新自己的资料信息，包括头像和昵称（不允许修改密码）
 *
 * @apiPermission 需要登录
 *
 * @apiSampleRequest /admin/user/updateSelf
 *
 * @apiBody {Object} user 用户对象
 * @apiBody {String} [user.avatar] 头像URL
 * @apiBody {String} [user.nickname] 昵称
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
		const { adminUser } = event.context;
		if (!adminUser?.username) {
			return resultFormat(401, '未登录或登录已过期');
		}

		const { user } = await readBody(event);
		if (!user || typeof user !== 'object') {
			return resultFormat(400, '请求参数错误');
		}

		const updateData: Record<string, unknown> = {};
		if (user.avatar !== undefined) updateData.avatar = user.avatar;
		if (user.nickname !== undefined) {
			if (!user.nickname?.trim()) {
				return resultFormat(400, '昵称不能为空');
			}
			updateData.nickname = user.nickname.trim();
		}

		if (Object.keys(updateData).length === 0) {
			return resultFormat(400, '没有需要更新的字段');
		}

		updateData.updatedAt = dayjs().format('YYYY年MM月DD日 HH:mm:ss');

		const result = await AdminUserModel.updateOne(
			{ username: adminUser.username },
			{ $set: updateData }
		);

		if (result.matchedCount === 0) {
			return resultFormat(404, '用户不存在');
		}

		return resultFormat(200, '更新成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
