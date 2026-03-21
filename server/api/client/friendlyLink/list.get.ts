import { error } from '~/server/utils/util.logger';
import FriendlyLinkModel from '~/server/models/friendlyLink.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /client/friendlyLink/list 获取友链列表
 * @apiName 获取友链列表
 * @apiGroup 博客前台
 * @apiDescription 获取所有已审核通过的友链列表
 *
 * @apiSampleRequest /client/friendlyLink/list
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 友链列表
 * @apiSuccess {String} data._id 友链ID
 * @apiSuccess {String} data.name 网站名称
 * @apiSuccess {String} data.url 网站链接
 * @apiSuccess {String} data.icon 网站图标
 * @apiSuccess {String} data.description 网站描述
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": [
 *         {
 *           "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *           "name": "示例网站",
 *           "url": "https://example.com",
 *           "icon": "https://example.com/icon.png",
 *           "description": "这是一个示例网站"
 *         }
 *       ]
 *     }
 */
export default defineEventHandler(async () => {
	try {
		// 只查询已审核通过的友链
		const friendlyLinks = await FriendlyLinkModel.find({ status: 'approved' })
			.select('name url icon description')
			.sort({ createdAt: -1 });

		return resultFormat(200, '获取成功', friendlyLinks);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		console.error(err);
		return resultFormat(500, errorMessage);
	}
});
