import { info, error } from '~/server/utils/util.logger';
import AdminUserModel from '~/server/models/adminUser.model';
import { md5, sha256, signToken } from '~/server/utils/util.crypto';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {post} /admin/user/login 管理员登录
 * @apiName 管理员登录
 * @apiGroup 后台用户管理
 * @apiDescription 管理员用户登录接口，验证用户名和密码后返回JWT token
 *
 * @apiSampleRequest /admin/user/login
 *
 * @apiBody {String} username 管理员用户名
 * @apiBody {String} password 管理员密码
 * @apiBody {String} captcha 验证码（由验证码中间件校验）
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {String} data.token JWT令牌
 * @apiSuccess {Object} data.userInfo 用户信息
 * @apiSuccess {String} data.userInfo.id 用户ID
 * @apiSuccess {String} data.userInfo.username 用户名
 * @apiSuccess {String} data.userInfo.nickname 昵称
 * @apiSuccess {String} data.userInfo.avatar 头像URL
 * @apiSuccess {String} data.userInfo.role 角色
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "登录成功",
 *       "data": {
 *         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *         "userInfo": {
 *           "id": "6517e7c8e7b1a2a1b2c3d4e5",
 *           "username": "admin",
 *           "nickname": "管理员",
 *           "avatar": "https://example.com/avatar.jpg",
 *           "role": "admin"
 *         }
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		// 获取请求体
		const body = await readBody(event);
		const { username, password } = body;

		// 验证必填字段
		if (!username || !password) {
			return resultFormat(400, '用户名和密码不能为空');
		}

		// 查询用户是否存在
		const adminUser = await AdminUserModel.findOne({ username, password: sha256(md5(password)) });

		if (!adminUser) {
			return resultFormat(401, '用户名或密码错误');
		}

		// 生成JWT token，设置7天过期
		const token = await signToken(
			{
				userId: adminUser._id,
				username: adminUser.username,
				role: adminUser.role,
			},
			7
		);

		// 记录登录日志
		info(`管理员登录成功: ${username}`);

		// 返回登录成功信息（不返回密码等敏感信息）
		return resultFormat(200, '登录成功', {
			token,
			userInfo: {
				id: adminUser._id,
				username: adminUser.username,
				nickname: adminUser.nickname,
				avatar: adminUser.avatar,
				role: adminUser.role,
			},
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
