import { error } from '~/server/utils/util.logger';
import AdminRoleModel from '~/server/models/adminRole.model';

/**
 * @api {put} /admin/role/update 更新权限
 * @apiName 更新权限
 * @apiGroup 后台权限管理
 * @apiDescription 更新后台管理权限，仅允许更新描述字段
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/role/update
 *
 * @apiHeader {String} Authorization 用户授权 Token
 *
 * @apiBody {String} name 权限名称
 * @apiBody {String} description 权限描述
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
		// 获取权限名称和描述
		const { name, description } = await readBody(event);

		if (!name || !description) {
			return resultFormat(400, '请求参数错误');
		}

		// 查找并更新权限描述
		const result = await AdminRoleModel.updateOne({ name }, { $set: { description } });

		if (result.matchedCount === 0) {
			return resultFormat(404, '未找到要更新的权限');
		}

		return resultFormat(200, '更新成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
