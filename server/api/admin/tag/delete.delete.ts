import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {delete} /admin/tag/delete 删除标签
 * @apiName 删除标签
 * @apiGroup 标签管理
 * @apiDescription 删除指定标签，会删除所有包含该标签的文章
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/tag/delete
 *
 * @apiQuery {String} tags 以 , 分隔的标签名称字符串，例如：标签1,标签2
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Number} data.deletedCount 删除的文章数量
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "删除成功，共删除 10 篇文章",
 *       "data": {
 *         "deletedCount": 10
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const tags = String(query.tags || '')
			.split(',')
			.filter(Boolean);

		if (!tags.length) {
			return resultFormat(400, '请求参数错误');
		}

		// 删除所有包含指定标签的文章
		const result = await ArticleModel.deleteMany({
			tags: { $in: tags },
		});

		if (result.deletedCount === 0) {
			return resultFormat(404, '未找到包含该标签的文章');
		}

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 篇文章`, {
			deletedCount: result.deletedCount,
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});

