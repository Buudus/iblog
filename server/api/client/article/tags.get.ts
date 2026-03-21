import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /client/article/tags 获取标签列表
 * @apiName 获取标签列表
 * @apiGroup 标签
 * @apiDescription 获取所有文章标签及其对应的文章数量
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 标签列表
 * @apiSuccess {String} data.name 标签名称
 * @apiSuccess {Number} data.count 文章数量
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": [
 *         {
 *           "name": "标签1",
 *           "count": 10
 *         },
 *         {
 *           "name": "标签2",
 *           "count": 5
 *         }
 *       ]
 *     }
 */
export default defineEventHandler(async () => {
	try {
		// 只查询已发布的文章
		const articles = await ArticleModel.find({ isPublished: true }, 'tags');

		const tagMap = articles.reduce((acc: Record<string, number>, article) => {
			// 确保 tags 是数组且不为空
			if (Array.isArray(article.tags) && article.tags.length > 0) {
				article.tags.forEach((tag) => {
					// 过滤掉空字符串、null、undefined 和无效值
					if (tag && typeof tag === 'string' && tag.trim().length > 0) {
						const trimmedTag = tag.trim();
						acc[trimmedTag] = (acc[trimmedTag] || 0) + 1;
					}
				});
			}
			return acc;
		}, {});

		// 转换为数组并按标签名称排序
		const data = Object.entries(tagMap)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

		return resultFormat(200, '获取成功', data);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
