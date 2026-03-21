import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /admin/dashboard/recentArticles 获取最近文章
 * @apiName 获取最近文章
 * @apiGroup 仪表盘
 * @apiDescription 获取最近发布的文章列表，按创建时间倒序，用于仪表盘快捷展示
 *
 * @apiPermission admin
 *
 * @apiQuery {Number} [limit=7] 返回数量，默认 7
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 文章列表
 * @apiSuccess {String} data._id 文章ID
 * @apiSuccess {String} data.title 标题
 * @apiSuccess {Number} data.views 浏览量
 * @apiSuccess {Boolean} data.isPublished 是否已发布
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {Object} data.author 作者
 * @apiSuccess {String} data.author.username 用户名
 * @apiSuccess {String} data.author.nickname 昵称
 * @apiSuccess {Object} data.category 分类
 * @apiSuccess {String} data.category.name 分类名称
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": [
 *         {
 *           "_id": "60c72b2f9b1d8e001c8e4b8a",
 *           "title": "示例文章标题",
 *           "views": 120,
 *           "isPublished": true,
 *           "createdAt": "2024-01-20T08:00:00.000Z",
 *           "author": { "username": "admin", "nickname": "管理员" },
 *           "category": { "name": "技术" }
 *         }
 *       ]
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const limit = query.limit ? Number(query.limit) : 7;

		const articles = await ArticleModel.find({})
			.sort({ createdAt: -1 })
			.limit(limit)
			.populate('author', 'username nickname')
			.populate('category', 'name')
			.select('title views isPublished createdAt');

		return resultFormat(200, '获取成功', articles);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
