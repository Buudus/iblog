import { error } from '~/server/utils/util.logger';
import FriendlyLinkModel from '~/server/models/friendlyLink.model';

/**
 * @api {get} /admin/friendlyLink/list 获取友链列表
 * @apiName 获取友链列表
 * @apiGroup 后台友链管理
 * @apiDescription 获取友链列表，支持分页、关键词模糊搜索和状态筛选（管理员权限）
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/friendlyLink/list
 *
 * @apiHeader {String} Authorization 用户授权 Token
 *
 * @apiQuery {String} [keywords] 关键词搜索（模糊匹配 name、url、email、description 任一字段）
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [limit=20] 每页数量
 * @apiQuery {String} [status] 状态筛选（pending、approved、rejected）
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Object[]} data.list 友链列表
 * @apiSuccess {Number} data.total 总记录数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "list": [
 *           {
 *             "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *             "name": "示例网站",
 *             "url": "https://example.com",
 *             "icon": "https://example.com/icon.png",
 *             "description": "这是一个示例网站",
 *             "email": "contact@example.com",
 *             "remark": "备注信息",
 *             "status": "approved",
 *             "createdAt": "2025年01月15日 12:00:00",
 *             "updatedAt": "2025年01月15日 12:00:00"
 *           }
 *         ],
 *         "total": 100
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		// 获取查询参数
		const query = getQuery(event);
		const keywords = query.keywords ? String(query.keywords) : '';
		const page = query.page ? parseInt(String(query.page), 10) : 1;
		const limit = query.limit ? parseInt(String(query.limit), 10) : 20;
		const status = query.status ? String(query.status) : '';

		// 构建查询条件
		const filter: Record<string, unknown> = {};

		// 关键词搜索（搜索url、name、email、description字段）
		if (keywords) {
			const escaped = keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = { $regex: escaped, $options: 'i' };
			filter.$or = [{ name: regex }, { url: regex }, { email: regex }, { description: regex }];
		}

		// 状态筛选
		if (status) {
			filter.status = status;
		}

		// 计算跳过的记录数
		const skip = (page - 1) * limit;

		// 查询友链列表
		const friendlyLinks = await FriendlyLinkModel.find(filter)
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 }); // 按创建时间倒序排列

		// 获取总记录数
		const total = await FriendlyLinkModel.countDocuments(filter);

		return resultFormat(200, '获取成功', { list: friendlyLinks, total });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
