import AccessLogModel from '../models/accessLog.model';
import { info, error } from '~/server/utils/util.logger';
import { verifyToken } from '~/server/utils/util.crypto';
import { ipToRegion, getClientIp } from '../utils/util.ipTool';

/**
 * 访问日志记录中间件
 */
export default defineEventHandler(async (event) => {
	try {
		const ip = getClientIp(event);
		const userAgent = event.node.req.headers['user-agent'];
		const path = event.path;
		const method = event.method;
		const statusCode = event.node.res.statusCode;

		// 尝试从 Authorization Token 中解析管理员ID
		let isAdmin = false;
		let adminId: string | null = null;
		try {
			const authorization = getHeader(event, 'authorization');
			if (authorization && authorization.startsWith('Bearer ')) {
				const token = authorization.substring(7);
				const decoded = await verifyToken(token);
				if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
					isAdmin = true;
					adminId = String((decoded as { userId: unknown }).userId);
				}
			}
		} catch (err: any) {
			error(err.message || '解析管理员身份失败');
		}

		const logInfo = `${path}\t${method}\t${ip}\t${userAgent}\t${statusCode}`;

		const regionInfo = ipToRegion(ip.replace('::ffff:', ''));

		// 记录日志到数据库
		await AccessLogModel.create({
			ip,
			isAdmin,
			adminId,
			regionInfo,
			userAgent: userAgent || 'Unknown',
			path,
			method,
			statusCode,
		});

		info(logInfo);
	} catch (err: any) {
		const errorMessage = err instanceof Error ? err.message : '记录访问日志失败';
		error(errorMessage);
		return {
			statusCode: 500,
			message: '服务器内部错误',
		};
	}
});
