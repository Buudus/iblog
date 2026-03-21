import { error } from '~/server/utils/util.logger';
import SiteInfoModel from '~/server/models/siteInfo.model';

/**
 * @api {post} /admin/siteInfo/create 创建站点信息
 * @apiName 创建站点信息
 * @apiGroup 站点信息
 * @apiDescription 创建新的站点信息
 *
 * @apiBody {Object} siteInfo 站点信息对象
 * @apiBody {String} siteInfo.title 站点标题
 * @apiBody {String} siteInfo.domain 站点域名
 * @apiBody {String} siteInfo.keywords 站点关键词
 * @apiBody {String} siteInfo.description 站点描述
 * @apiBody {String} [siteInfo.globalStyle] 站点全局样式
 * @apiBody {String} [siteInfo.globalScript] 站点全局脚本
 * @apiBody {String} [siteInfo.logo] 站点 Logo URL
 * @apiBody {String} [siteInfo.isUse=no] 是否启用
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "code": 201,
 *       "message": "站点信息创建成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);

		if (!body || typeof body !== 'object' || !body.siteInfo) {
			return resultFormat(400, '请求参数错误');
		}

		const { siteInfo } = body;

		if (siteInfo.isUse === 'yes') {
			// 将其他启用中的记录置为不启用
			await SiteInfoModel.updateMany({ isUse: 'yes' }, { isUse: 'no' });
		}

		await SiteInfoModel.create(siteInfo);

		return resultFormat(201, '站点信息创建成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
