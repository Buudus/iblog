import { error } from '~/server/utils/util.logger';
import AdminUserModel from '../models/adminUser.model';
import { verifyToken } from '~/server/utils/util.crypto';

export default defineEventHandler(async (event) => {
	// 只对 admin 路由进行验证
	if (!event.path.includes('/api/admin')) return;

	// 排除登录接口，避免登录时需要token验证
	if (event.path.includes('/api/admin/user/login')) return;

	// 获取 Authorization header
	const authorization = getHeader(event, 'authorization');

	// 检查 Authorization header 是否存在
	if (!authorization) {
		throw createError({
			statusCode: 401,
			statusMessage: '缺少授权令牌',
		});
	}

	// 检查 Token 格式是否为 "Bearer <token>"
	if (!authorization.startsWith('Bearer ')) {
		throw createError({
			statusCode: 401,
			statusMessage: '授权令牌格式错误',
		});
	}

	// 提取 token
	const token = authorization.substring(7); // 移除 "Bearer " 前缀

	// 检查 token 是否存在
	if (!token) {
		throw createError({
			statusCode: 401,
			statusMessage: '授权令牌为空',
		});
	}

	try {
		// 验证并解码 Token
		const decoded = await verifyToken(token);

		// 检查解码结果
		if (!decoded || typeof decoded !== 'object' || !decoded.username) {
			throw createError({
				statusCode: 401,
				statusMessage: '授权令牌无效',
			});
		}

		// 查询用户信息
		const adminUser = await AdminUserModel.findOne({ username: decoded.username });

		if (!adminUser) {
			throw createError({
				statusCode: 401,
				statusMessage: '用户不存在或已被禁用',
			});
		}

		// 检查用户是否有管理员权限（可以根据实际需求调整权限检查逻辑）
		if (!adminUser.role || adminUser.role === '') {
			throw createError({
				statusCode: 403,
				statusMessage: '用户权限不足',
			});
		}

		// 将管理员信息注入到 context 中
		event.context.adminUser = {
			id: adminUser._id,
			username: adminUser.username,
			role: adminUser.role,
		};
	} catch (err: any) {
		// 记录错误日志
		const errorMessage = err instanceof Error ? err.message : '管理员验证失败';
		error(`管理员验证失败: ${errorMessage}`);

		// 如果是 createError 抛出的错误，直接重新抛出
		if (err.statusCode) {
			throw err;
		}

		// JWT 相关错误
		if (err.name === 'TokenExpiredError') {
			throw createError({
				statusCode: 401,
				statusMessage: '授权令牌已过期',
			});
		}

		if (err.name === 'JsonWebTokenError') {
			throw createError({
				statusCode: 401,
				statusMessage: '授权令牌无效',
			});
		}

		// 其他未知错误
		throw createError({
			statusCode: 500,
			statusMessage: '服务器内部错误',
		});
	}
});
