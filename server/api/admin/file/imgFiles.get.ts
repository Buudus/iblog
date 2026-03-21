import { error } from '~/server/utils/util.logger';
import FileModel from '~/server/models/files.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /admin/file/imgFiles 获取图片文件列表
 * @apiName 获取图片文件列表
 * @apiGroup 文件管理
 * @apiDescription 获取所有图片文件的列表，支持分页
 *
 * @apiPermission admin
 *
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [pageSize=20] 每页条数
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 图片文件列表
 * @apiSuccess {String} data._id 文件ID
 * @apiSuccess {String} data.name 文件名
 * @apiSuccess {String} data.originalName 原始文件名
 * @apiSuccess {String} data.mimetype 文件MIME类型
 * @apiSuccess {String} data.url 文件访问URL
 * @apiSuccess {Number} data.size 文件大小（字节）
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {String} data.updatedAt 更新时间
 * @apiSuccess {Number} total 总条数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 * 			"data": {
 * 				"list": [
 * 					{
 * 						"_id": "609e125f5311234567890abc",
 * 						"name": "example.jpg",
 * 						"originalName": "example.jpg",
 * 						"mimetype": "image/jpeg",
 * 						"md5": "d41d8cd98f00b204e9800998ecf8427e",
 * 						"path": "/uploads/example.jpg",
 * 						"url": "http://yourdomain.com/uploads/example.jpg",
 * 						"size": 123456,
 * 						"createdAt": "2021-04-20T08:00:00.000Z",
 * 						"updatedAt": "2021-04-20T08:00:00.000Z"
 * 					}
 * 					],
 * 				"total": 100
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const { page = 1, pageSize = 20 } = query;

		const skip = (Number(page) - 1) * Number(pageSize);
		const limit = Number(pageSize);

		const filter = { mimetype: { $regex: /^image\// } };

		const [data, total, totalSizeResult] = await Promise.all([
			FileModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
			FileModel.countDocuments(filter),
			// 计算所有图片文件的总大小（使用聚合查询）
			FileModel.aggregate([
				{ $match: filter },
				{
					$group: {
						_id: null,
						totalSize: { $sum: '$size' },
					},
				},
			]),
		]);

		const totalSize = totalSizeResult.length > 0 ? totalSizeResult[0].totalSize : 0;

		return resultFormat(200, '获取成功', { list: data, total, totalSize });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
