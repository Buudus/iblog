import { error } from '~/server/utils/util.logger';
import AdminRoleModel from '~/server/models/adminRole.model';
import type { IAdminRole } from '~/server/models/adminRole.model';

/**
 * @api {post} /admin/role/create 创建权限
 * @apiName 创建权限
 * @apiGroup 后台权限管理
 * @apiDescription 创建后台管理权限
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/role/create
 *
 * @apiHeader {String} Authorization 用户授权 Token
 *
 * @apiBody {Object} role 权限对象
 * @apiBody {String} role.name 权限名称
 * @apiBody {String} role.description 权限描述
 * @apiBody {String[]} role.permissions 权限列表
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "code": 201,
 *       "message": "创建成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		// 获取权限对象
		const role: IAdminRole = (await readBody(event)).role;

		// 校验权限名称是否已存在
		const existingRole = await AdminRoleModel.findOne({ name: role.name });

		if (existingRole) {
			return resultFormat(400, '权限名称已存在');
		}

		await AdminRoleModel.create(role);

		return resultFormat(201, '创建成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
