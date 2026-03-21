import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import SiteInfoModel from '~/server/models/siteInfo.model';

/**
 * @api {put} /admin/siteInfo/update 更新站点信息
 * @apiName 更新站点信息
 * @apiGroup 站点信息
 * @apiDescription 根据 ID 更新站点信息；当设置 isUse 为 yes 时，将其他记录的 isUse 置为 no。支持按字段部分更新。
 *
 * @apiPermission admin
 *
 * @apiBody {Object} siteInfo 站点信息对象（需包含 id 或 _id，且仅包含需要更新的字段）
 * @apiBody {String} siteInfo.id 站点信息ID（或使用 siteInfo._id）
 * @apiBody {String} [siteInfo.title] 站点标题
 * @apiBody {String} [siteInfo.domain] 站点域名
 * @apiBody {String} [siteInfo.keywords] 站点关键词
 * @apiBody {String} [siteInfo.description] 站点描述
 * @apiBody {String} [siteInfo.globalStyle] 站点全局样式
 * @apiBody {String} [siteInfo.globalScript] 站点全局脚本
 * @apiBody {String} [siteInfo.logo] 站点 Logo URL
 * @apiBody {String} [siteInfo.isUse] 是否启用（yes/no）。若为 yes，则其他记录自动置为 no
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "更新成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { siteInfo } = body || {};

		if (!siteInfo || typeof siteInfo !== 'object') {
			return resultFormat(400, '请求参数错误');
		}

		const id = siteInfo.id || siteInfo._id;

		if (!id) {
			return resultFormat(400, '站点信息ID不能为空');
		}

		if (siteInfo.isUse === 'yes') {
			// 如果当前设为启用，则将其他记录设为不启用
			await SiteInfoModel.updateMany({ _id: { $ne: id }, isUse: 'yes' }, { isUse: 'no' });
		}

		const { id: _ignoredId, _id: _ignored_Id, ...updatePayload } = siteInfo as Record<string, unknown>;

		const res = await SiteInfoModel.updateOne(
			{ _id: id },
			{ $set: updatePayload, updatedAt: dayjs().format('YYYY年MM月DD日 HH:mm:ss') }
		);

		if (res.matchedCount === 0) {
			return resultFormat(404, '站点信息不存在');
		}

		return resultFormat(200, '更新成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
