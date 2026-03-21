import { error } from '~/server/utils/util.logger';
import AuthorInfoModel from '~/server/models/authorInfo.model';

/**
 * @api {post} /admin/authorInfo/create 创建作者信息
 * @apiName 创建作者信息
 * @apiGroup 作者信息
 * @apiDescription 创建新的作者信息
 *
 * @apiPermission admin
 *
 * @apiBody {Object} authorInfo 作者信息对象
 * @apiBody {String} authorInfo.avatar 头像URL
 * @apiBody {String} authorInfo.name 名称
 * @apiBody {String} [authorInfo.ps] 个性签名
 * @apiBody {String} [authorInfo.biography] 简介
 * @apiBody {String} [authorInfo.qq] QQ
 * @apiBody {String} [authorInfo.wechat] 微信
 * @apiBody {String} authorInfo.email 邮箱
 * @apiBody {String} [authorInfo.github] GitHub
 * @apiBody {String} [authorInfo.weibo] Weibo
 * @apiBody {String="yes","no"} [authorInfo.isUse=yes] 是否启用
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "code": 201,
 *       "message": "创建成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);

		if (!body || typeof body !== 'object' || !body.authorInfo) {
			return resultFormat(400, '请求参数错误');
		}

		const { authorInfo } = body;

		if (authorInfo.isUse === 'yes') {
			// 如果新建的是启用状态，则将其他记录设置为不启用
			await AuthorInfoModel.updateMany({ isUse: 'yes' }, { isUse: 'no' });
		}

		await AuthorInfoModel.create(authorInfo);

		return resultFormat(201, '创建成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
