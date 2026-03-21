import { error } from '~/server/utils/util.logger';
import LeaveMessageModel from '~/server/models/leaveMessage.model';

/**
 * @api {get} /admin/leaveMessage/list 获取留言列表
 * @apiName 获取留言列表
 * @apiGroup 留言管理
 * @apiDescription 获取留言列表，支持根据联系人或留言内容进行模糊搜索，并支持分页查询
 *
 * @apiPermission admin
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配联系人或留言内容）
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [pageSize=20] 每页条数
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 留言列表
 * @apiSuccess {String} data._id 留言ID
 * @apiSuccess {String} data.concat 联系人
 * @apiSuccess {String} data.content 留言内容
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {String} data.updatedAt 更新时间
 * @apiSuccess {Number} total 总条数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 * 				"list": [
 *         	{
 *           	"_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *           	"concat": "张三",
 *           	"content": "这是留言内容",
 *           	"createdAt": "2025年10月13日 10:00:00",
 *           	"updatedAt": "2025年10月13日 10:00:00"
 *         }],
 *       	"total": 100
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const keywords = query.keywords ? String(query.keywords) : '';
		const page = query.page ? Number(query.page) : 1;
		const pageSize = query.pageSize ? Number(query.pageSize) : 20;

		const filter: Record<string, unknown> = {};
		if (keywords) {
			const escaped = String(keywords).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = { $regex: escaped, $options: 'i' };
			filter.$or = [{ concat: regex }, { content: regex }];
		}

		const skip = (Number(page) - 1) * Number(pageSize);
		const limit = Number(pageSize);

		const [data, total] = await Promise.all([
			LeaveMessageModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
			LeaveMessageModel.countDocuments(filter),
		]);

		return resultFormat(200, '获取成功', { list: data, total });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
