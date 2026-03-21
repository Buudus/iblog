import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import CategoryModel from '~/server/models/categories.model';

/**
 * @api {put} /admin/category/updateParent 更新一级分类
 * @apiName 更新一级分类
 * @apiGroup 分类管理
 * @apiDescription 更新一个一级分类的信息
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/category/updateParent
 *
 * @apiBody {Object} category 一级分类对象
 * @apiBody {String} category.id 一级分类ID
 * @apiBody {String} [category.name] 分类名称
 * @apiBody {String} [category.description] 分类描述
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
		const { category } = await readBody(event);

		if (!category || !category.id) {
			return resultFormat(400, '请求参数错误');
		}

		const { id, name, description } = category;

		const updateData: Record<string, unknown> = {};
		if (name) updateData.name = name;
		if (description) updateData.description = description;
		updateData.updatedAt = dayjs().format('YYYY年MM月DD日 HH:mm:ss');

		const updatedCategory = await CategoryModel.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});

		if (!updatedCategory) {
			return resultFormat(404, '分类不存在');
		}

		return resultFormat(200, '更新成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
