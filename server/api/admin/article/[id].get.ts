import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /admin/article/:id 获取文章详情
 * @apiName 获取文章详情
 * @apiGroup 博客文章管理
 * @apiDescription 根据ID获取文章详情
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/article/:id
 *
 * @apiParam {String} id 文章ID
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 文章详情
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *         "cover": "https://example.com/cover.jpg",
 *         "title": "文章标题",
 *         "content": "文章内容...",
 *         "author": { "_id": "6501a2b3c4d5e6f7a8b9c0d1", "username": "admin", "nickname": "管理员" },
 *         "category": { "_id": "6501a2b3c4d5e6f7a8b9c0d2", "name": "前端" },
 *         "subCategory": { "_id": "6501a2b3c4d5e6f7a8b9c0d3", "name": "Vue" },
 *         "tags": ["标签1", "标签2"],
 *         "views": 123,
 *         "isPublished": true,
 *         "createdAt": "2025年09月30日 12:00:00",
 *         "updatedAt": "2025年09月30日 12:00:00"
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		// 获取路由参数中的文章ID
		const id = getRouterParam(event, 'id');

		if (!id) {
			return resultFormat(400, '请提供文章ID');
		}

		// 查询文章详情，并填充作者和分类信息
		const article = await ArticleModel.findById(id)
			.populate('author', 'username nickname')
			.populate('category', 'name')
			.populate('subCategory', 'name');

		if (!article) {
			return resultFormat(404, '文章不存在');
		}

		return resultFormat(200, '获取成功', article);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
