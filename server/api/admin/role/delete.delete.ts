import { error } from '~/server/utils/util.logger';
import AdminRoleModel from '~/server/models/adminRole.model';

/**
 * @api {delete} /admin/role/delete 删除权限
 * @apiName 删除权限
 * @apiGroup 后台权限管理
 * @apiDescription 删除后台管理权限，支持多选删除
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/role/delete
 *
 * @apiHeader {String} Authorization 用户授权 Token
 *
 * @apiQuery {String} ids 以 , 分隔的权限名称字符串，例如：editor,viewer
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
		// 获取权限名称（以 ids 统一）
		const query = getQuery(event);
		const names = String(query.ids || '')
			.split(',')
			.filter(Boolean);

		if (!names.length) {
			return resultFormat(400, '请求参数错误');
		}

		// 禁止删除超级管理员权限
		if (names.includes('admin')) {
			return resultFormat(400, '禁止删除超级管理员权限');
		}

		// 删除权限
		const result = await AdminRoleModel.deleteMany({ name: { $in: names } });

		if (result.deletedCount === 0) {
			return resultFormat(404, '未找到要删除的权限');
		}

		return resultFormat(200, `成功删除 ${result.deletedCount} 项权限`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
