import { error } from '~/server/utils/util.logger';
import PhotoAlbumModel from '~/server/models/photoAlbum.model';
import FileModel from '~/server/models/files.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /admin/photoAlbum/list 获取相册列表
 * @apiName 获取相册列表
 * @apiGroup 相册管理
 * @apiDescription 获取相册列表，支持按 title、description、tags 进行模糊搜索，并支持分页
 *
 * @apiPermission admin
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配 title、description、tags 任一字段）
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [pageSize=10] 每页条数
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Object[]} data.list 相册列表
 * @apiSuccess {Number} data.total 总条数
 * @apiSuccess {Number} data.totalSize 总大小（字节）
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const keywords = query.keywords ? String(query.keywords) : '';
		const page = query.page ? Number(query.page) : 1;
		const pageSize = query.pageSize ? Number(query.pageSize) : 10;

		const filter: Record<string, unknown> = {};
		if (keywords) {
			const escaped = String(keywords).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = { $regex: escaped, $options: 'i' };
			filter.$or = [{ title: regex }, { description: regex }, { tags: regex }];
		}

		const skip = (Number(page) - 1) * Number(pageSize);
		const limit = Number(pageSize);

		const [data, total] = await Promise.all([
			PhotoAlbumModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
			PhotoAlbumModel.countDocuments(filter),
		]);

		// 计算所有相册图片的总大小（通过path关联文件模型）
		// 获取所有相册记录的path
		const allAlbums = await PhotoAlbumModel.find(filter).select('path');
		const paths = allAlbums.map((album) => album.path);

		// 通过path查找对应的文件并计算总大小
		const totalSizeResult = await FileModel.aggregate([
			{ $match: { path: { $in: paths } } },
			{
				$group: {
					_id: null,
					totalSize: { $sum: '$size' },
				},
			},
		]);

		const totalSize = totalSizeResult.length > 0 ? totalSizeResult[0].totalSize : 0;

		return resultFormat(200, '获取成功', { list: data, total, totalSize });
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
