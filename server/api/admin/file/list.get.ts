import { error } from '~/server/utils/util.logger';
import FileModel from '~/server/models/files.model';

/**
 * @api {get} /admin/file/list 获取文件列表
 * @apiName 获取文件列表
 * @apiGroup 文件管理
 * @apiDescription 获取文件列表，支持按文件名、原始文件名或文件类型进行模糊搜索，并分页查询
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/file/list
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配文件名、原始文件名或文件类型）
 * @apiQuery {String} [mimetype] 文件类型筛选（如：image/*、application/pdf等）
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [limit=20] 每页显示数量
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Object[]} data.list 文件列表
 * @apiSuccess {Number} data.total 总记录数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "list": [
 *           {
 *             "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *             "name": "example.jpg",
 *             "originalName": "example_original.jpg",
 *             "mimetype": "image/jpeg",
 *             "url": "https://example.com/uploads/example.jpg",
 *             "path": "/uploads/example.jpg",
 *             "md5": "abc123def456",
 *             "size": 1024000,
 *             "createdAt": "2025年01月15日 12:00:00",
 *             "updatedAt": "2025年01月15日 12:00:00"
 *           }
 *         ],
 *         "total": 100
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		// 获取查询参数
		const query = getQuery(event);
		const keywords = query.keywords ? String(query.keywords) : '';
		const mimetype = query.mimetype ? String(query.mimetype) : '';
		const page = query.page ? parseInt(String(query.page), 10) : 1;
		const limit = query.limit ? parseInt(String(query.limit), 10) : 20;

		// 构建查询条件
		const filter: Record<string, unknown> = {};

		// 文件名搜索
		if (keywords) {
			const escaped = keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = { $regex: escaped, $options: 'i' };
			filter.$or = [{ name: regex }, { originalName: regex }, { mimetype: regex }];
		}

		// 文件类型筛选
		if (mimetype) {
			if (mimetype.endsWith('/*')) {
				// 支持通配符，如 image/* 匹配所有图片类型
				const prefix = mimetype.replace('/*', '/');
				filter.mimetype = { $regex: `^${prefix}`, $options: 'i' };
			} else {
				// 精确匹配
				filter.mimetype = mimetype;
			}
		}

		// 计算跳过的记录数
		const skip = (page - 1) * limit;

		// 查询文件列表
		const files = await FileModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }); // 按创建时间倒序排列

		// 获取总记录数
		const total = await FileModel.countDocuments(filter);

		// 计算所有文件的总大小（使用聚合查询）
		const totalSizeResult = await FileModel.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: null,
					totalSize: { $sum: '$size' },
				},
			},
		]);

		const totalSize = totalSizeResult.length > 0 ? totalSizeResult[0].totalSize : 0;

		return resultFormat(200, '获取成功', { list: files, total, totalSize });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
