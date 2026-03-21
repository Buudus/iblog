import { error } from '~/server/utils/util.logger';
import SiteInfoModel from '~/server/models/siteInfo.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /client/siteInfo/active 获取正在使用的站点信息
 * @apiName 获取正在使用的站点信息
 * @apiGroup 博客前台
 * @apiDescription 获取 isUse === 'yes' 的站点信息配置
 *
 * @apiSampleRequest /client/siteInfo/active
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 站点信息
 * @apiSuccess {String} data._id ID
 * @apiSuccess {String} data.title 标题
 * @apiSuccess {String} data.keywords 关键词
 * @apiSuccess {String} data.description 描述
 * @apiSuccess {String} data.globalStyle 全局样式
 * @apiSuccess {String} data.globalScript 全局脚本
 * @apiSuccess {String} data.domain 域名
 * @apiSuccess {String} data.logo Logo URL
 * @apiSuccess {String} data.isUse 是否启用 yes/no
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {String} data.updatedAt 更新时间
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *         "title": "蓝云博客",
 *         "keywords": "博客, 技术",
 *         "description": "个人技术与生活分享",
 *         "globalStyle": "",
 *         "globalScript": "",
 *         "domain": "example.com",
 *         "logo": "https://example.com/logo.png",
 *         "isUse": "yes",
 *         "createdAt": "2025年10月13日 10:00:00",
 *         "updatedAt": "2025年10月13日 10:00:00"
 *       }
 *     }
 */
export default defineEventHandler(async () => {
	try {
		const data = await SiteInfoModel.findOne({ isUse: 'yes' });
		return resultFormat(200, '获取成功', data);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
