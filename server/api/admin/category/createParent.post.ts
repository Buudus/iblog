import { error } from '~/server/utils/util.logger';
import CategoryModel from '~/server/models/categories.model';

/**
 * @api {post} /admin/category/createParent 创建一级分类
 * @apiName 创建一级分类
 * @apiGroup 分类管理
 * @apiDescription 创建一个新的一级分类（父级分类）
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/category/createParent
 *
 * @apiBody {Object} category 分类对象
 * @apiBody {String} category.name 分类名称
 * @apiBody {String} category.description 分类描述
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "code": 201,
 *       "message": "分类创建成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const { category } = await readBody(event);

		if (!category || !category.name || !category.description) {
			return resultFormat(400, '请求参数错误');
		}

		const { name, description } = category;

		// 检查分类是否已存在
		const existingCategory = await CategoryModel.findOne({ name });
		if (existingCategory) {
			return resultFormat(400, '分类已存在');
		}

		// 创建新分类
		await CategoryModel.create({
			name,
			description,
		});

		return resultFormat(201, '分类创建成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
