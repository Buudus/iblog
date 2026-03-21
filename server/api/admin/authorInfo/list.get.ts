import { error } from '~/server/utils/util.logger';
import AuthorInfoModel from '~/server/models/authorInfo.model';

/**
 * @api {get} /admin/authorInfo/list 获取作者信息列表
 * @apiName 获取作者信息列表
 * @apiGroup 作者信息
 * @apiDescription 获取作者信息列表，支持按多个字段进行模糊搜索（任意字段命中即返回）与分页
 *
 * @apiPermission admin
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配 name、email、wechat、qq、github、weibo、isUse 任一字段）
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [pageSize=20] 每页条数
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 作者信息列表
 * @apiSuccess {String} data._id ID
 * @apiSuccess {String} data.avatar 头像URL
 * @apiSuccess {String} data.name 名称
 * @apiSuccess {String} data.ps 个性签名
 * @apiSuccess {String} data.biography 简介
 * @apiSuccess {String} data.qq QQ
 * @apiSuccess {String} data.wechat 微信
 * @apiSuccess {String} data.email 邮箱
 * @apiSuccess {String} data.github GitHub
 * @apiSuccess {String} data.weibo Weibo
 * @apiSuccess {String} data.isUse 是否启用 yes/no
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {String} data.updatedAt 更新时间
 * @apiSuccess {Number} total 总条数
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 * 					"list": [
 *         		{
 *             "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *             "avatar": "https://example.com/avatar.jpg",
 *             "name": "蓝云",
 *             "ps": "分享技术与生活",
 *             "biography": "全栈开发者，热爱开源。",
 *             "qq": "123456",
 *             "wechat": "lanyun_wechat",
 *             "email": "hi@example.com",
 *             "github": "lanyun",
 *             "weibo": "@蓝云",
 *             "isUse": "yes",
 *             "createdAt": "2025年10月13日 10:00:00",
 *             "updatedAt": "2025年10月13日 10:00:00"
 *         		}
 *       		],
 *          "total": 1
 * 				}
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
			filter.$or = [
				{ name: regex },
				{ email: regex },
				{ wechat: regex },
				{ qq: regex },
				{ github: regex },
				{ weibo: regex },
				{ isUse: regex },
			];
		}

		const skip = (Number(page) - 1) * Number(pageSize);
		const limit = Number(pageSize);

		const [data, total] = await Promise.all([
			AuthorInfoModel.find(filter).skip(skip).limit(limit),
			AuthorInfoModel.countDocuments(filter),
		]);

		return resultFormat(200, '获取成功', { list: data, total });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
