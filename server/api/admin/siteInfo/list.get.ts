import { error } from '~/server/utils/util.logger';
import SiteInfoModel from '~/server/models/siteInfo.model';

/**
 * @api {get} /admin/siteInfo/list 获取站点信息列表
 * @apiName 获取站点信息列表
 * @apiGroup 站点信息
 * @apiDescription 获取站点信息列表，支持关键词模糊搜索（title、keywords、description、domain、isUse、globalStyle、globalScript）和分页查询
 *
 * @apiPermission admin
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配站点信息的多个字段）
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [pageSize=20] 每页条数
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 留言列表
 * @apiSuccess {String} data._id 留言ID
 * @apiSuccess {String} data.title 联系人
 * @apiSuccess {String} data.keywords 留言内容
 * @apiSuccess {String} data.description 留言内容
 * @apiSuccess {String} data.globalStyle 留言内容
 * @apiSuccess {String} data.globalScript 留言内容
 * @apiSuccess {String} data.isUse 留言内容
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {String} data.updatedAt 更新时间
 * @apiSuccess {Number} total 总条数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 * 			 	"list": [
 *         	{
 *           	"_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *           	"title": "My Awesome Site",
 *           	"keywords": "blog, tech, coding",
 *           	"description": "This is my awesome blog about tech and coding.",
 *           	"globalStyle": "body { font-family: Arial; }",
 *           	"globalScript": "console.log('Welcome to my site!');",
 *           	"domain": "www.myawesomesite.com",4
 *           	"logo": "https://www.myawesomesite.com/logo.png",
 *           	"isUse": "yes",
 *           	"createdAt": "2025年10月13日 10:00:00",
 *           	"updatedAt": "2025年10月13日 10:00:00"
 *         	}
 *       	],
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
			const escaped = keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = { $regex: escaped, $options: 'i' };
			filter.$or = [
				{ title: regex },
				{ description: regex },
				{ domain: regex },
				{ isUse: regex },
				{ keywords: regex },
				{ globalStyle: regex },
				{ globalScript: regex },
			];
		}

		const skip = (page - 1) * pageSize;
		const limit = pageSize;

		const [data, total] = await Promise.all([
			SiteInfoModel.find(filter).skip(skip).limit(limit),
			SiteInfoModel.countDocuments(filter),
		]);

		return resultFormat(200, '获取成功', { list: data, total });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
