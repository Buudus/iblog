import { error } from '~/server/utils/util.logger';
import AuthorInfoModel from '~/server/models/authorInfo.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /client/authorInfo/active 获取正在使用的作者信息
 * @apiName 获取正在使用的作者信息
 * @apiGroup 博客前台
 * @apiDescription 获取 isUse === 'yes' 的作者信息配置
 *
 * @apiSampleRequest /client/authorInfo/active
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 作者信息
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
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *         "avatar": "https://example.com/avatar.jpg",
 *         "name": "蓝云",
 *         "ps": "分享技术与生活",
 *         "biography": "全栈开发者",
 *         "qq": "123456",
 *         "wechat": "lanyun_wechat",
 *         "email": "hi@example.com",
 *         "github": "lanyun",
 *         "weibo": "@蓝云",
 *         "isUse": "yes",
 *         "createdAt": "2025年10月13日 10:00:00",
 *         "updatedAt": "2025年10月13日 10:00:00"
 *       }
 *     }
 */
export default defineEventHandler(async () => {
	try {
		const data = await AuthorInfoModel.findOne({ isUse: 'yes' });
		return resultFormat(200, '获取成功', data);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
