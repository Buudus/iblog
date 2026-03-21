import { error } from '~/server/utils/util.logger';
import PhotoAlbumModel from '~/server/models/photoAlbum.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /client/photoAlbum/tags 获取相册所有标签
 * @apiName 获取相册所有标签
 * @apiGroup 博客前台
 * @apiDescription 从相册记录中汇总去重后的所有标签，按字典序排序返回
 *
 * @apiSampleRequest /client/photoAlbum/tags
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 标签列表
 * @apiSuccess {String} data.tag 标签名
 * @apiSuccess {Number} data.count 标签下照片数量
 * @apiSuccess {Number} total 标签总数
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": [
 *         { "tag": "旅行", "count": 12 },
 *         { "tag": "城市", "count": 8 },
 *         { "tag": "风景", "count": 5 }
 *       ],
 *       "total": 3
 *     }
 */
export default defineEventHandler(async () => {
	try {
		const docs = await PhotoAlbumModel.aggregate([
			{ $unwind: '$tags' },
			{ $group: { _id: '$tags', count: { $sum: 1 } } },
			{ $project: { _id: 0, tag: '$_id', count: 1 } },
			{ $sort: { tag: 1 } },
		]);

		return resultFormat(200, '获取成功', {
			data: docs,
			total: docs.length,
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
