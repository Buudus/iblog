import { error } from '~/server/utils/util.logger';
import PhotoAlbumModel from '~/server/models/photoAlbum.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /client/photoAlbum/list 获取相册列表
 * @apiName 获取相册列表
 * @apiGroup 博客前台
 * @apiDescription 支持分页（不传分页参数则返回全部）与按 title、description、tag 模糊搜索
 *
 * @apiSampleRequest /client/photoAlbum/list
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配标题、描述或标签）
 * @apiQuery {Number} [page] 当前页码（可选，缺省则不分页）
 * @apiQuery {Number} [pageSize] 每页条数（可选，缺省则不分页）
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 相册记录
 * @apiSuccess {String} data._id 记录ID
 * @apiSuccess {String} data.title 标题
 * @apiSuccess {String} data.url 资源URL
 * @apiSuccess {String} data.path 服务器路径
 * @apiSuccess {String} data.description 描述
 * @apiSuccess {String[]} data.tags 标签
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {String} data.updatedAt 更新时间
 * @apiSuccess {Number} total 总条数
 *
 * @apiSuccessExample {json} Success-Response (分页情况下):
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": [
 *         {
 *           "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *           "title": "山海",
 *           "url": "/resource/1760173157418_3dryvl.webp",
 *           "path": ".../public/resource/1760173157418_3dryvl.webp",
 *           "description": "旅行随拍",
 *           "tags": ["旅行", "风景"],
 *           "createdAt": "2025年10月13日 10:00:00",
 *           "updatedAt": "2025年10月13日 10:00:00"
 *         }
 *       ],
 *       "total": 1
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const keywords = query.keywords ? String(query.keywords) : '';
		const page = query.page ? Number(query.page) : undefined;
		const pageSize = query.pageSize ? Number(query.pageSize) : undefined;

		const filter: Record<string, unknown> = {};
		if (keywords) {
			const escaped = String(keywords).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = { $regex: escaped, $options: 'i' };
			filter.$or = [{ title: regex }, { description: regex }, { tags: regex }];
		}

		// 不传分页参数 => 返回全部
		if (!page || !pageSize) {
			const [data, total] = await Promise.all([
				PhotoAlbumModel.find(filter).sort({ createdAt: -1 }),
				PhotoAlbumModel.countDocuments(filter),
			]);
			return resultFormat(200, '获取成功', { data, total });
		}

		const skip = (page - 1) * pageSize;
		const [data, total] = await Promise.all([
			PhotoAlbumModel.find(filter).skip(skip).limit(pageSize).sort({ createdAt: -1 }),
			PhotoAlbumModel.countDocuments(filter),
		]);

		return resultFormat(200, '获取成功', { data, total });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
