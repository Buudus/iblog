import { error } from '~/server/utils/util.logger';
import { md5, sha256 } from '~/server/utils/util.crypto';
import AdminRoleModel from '~/server/models/adminRole.model';
import { resultFormat } from '~/server/utils/util.resultFormat';
import AdminUserModel from '~/server/models/adminUser.model';
import type { IAdminUser } from '~/server/models/adminUser.model';

/**
 * @api {post} /admin/user/create 创建用户
 * @apiName 创建用户
 * @apiGroup 后台用户管理
 * @apiDescription 创建后台管理用户
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/user/create
 *
 * @apiHeader {String} Authorization 用户授权 Token
 *
 * @apiBody {Object} user 用户对象
 * @apiBody {String} user.nickname 昵称
 * @apiBody {String} user.avatar 头像 URL
 * @apiBody {String} user.username 用户名
 * @apiBody {String} user.password 密码
 * @apiBody {String} user.rule 权限名
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
		// 获取请求体
		const body = await readBody(event);

		// 检查请求体结构
		if (!body || typeof body !== 'object' || !body.user) {
			return resultFormat(400, '请求参数错误：缺少 user 对象');
		}

		// 获取用户对象
		const user: IAdminUser = body.user;

		// 检查用户名是否已存在
		const existingUser = await AdminUserModel.findOne({ username: user.username });
		if (existingUser) {
			return resultFormat(400, '用户名已存在');
		}

		// 校验用户权限字段，权限是否存在
		const roleResult = await AdminRoleModel.findOne({ name: user.role });
		if (roleResult === null) {
			return resultFormat(400, '权限不存在');
		}

		// 创建用户
		await AdminUserModel.create({
			...user,
			password: sha256(md5(user.password)),
		});

		return resultFormat(201, '创建成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		// 处理 MongoDB 唯一索引错误
		if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
			return resultFormat(400, '用户名已存在');
		}
		return resultFormat(500, errorMessage);
	}
});
