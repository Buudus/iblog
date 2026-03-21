import { error } from '~/server/utils/util.logger';
import CategoryModel from '~/server/models/categories.model';
import SubCategoryModel from '~/server/models/subCategories.model';

/**
 * @api {post} /admin/category/createSub 创建二级分类
 * @apiName 创建二级分类
 * @apiGroup 分类管理
 * @apiDescription 创建一个新的二级分类
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/category/createSub
 *
 * @apiBody {Object} subCategory 二级分类对象
 * @apiBody {String} subCategory.name 二级分类名称
 * @apiBody {String} subCategory.description 二级分类描述
 * @apiBody {String} subCategory.parentId 父级分类ID
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "code": 201,
 *       "message": "二级分类创建成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const { subCategory } = await readBody(event);

		if (!subCategory || !subCategory.name || !subCategory.description || !subCategory.parentId) {
			return resultFormat(400, '请求参数错误');
		}

		const { name, description, parentId } = subCategory;

		// 检查父级分类是否存在
		const parentCategory = await CategoryModel.findById(parentId);
		if (!parentCategory) {
			return resultFormat(400, '父级分类不存在');
		}

		// 检查二级分类是否已存在
		const existingSubCategory = await SubCategoryModel.findOne({ name, parentId });
		if (existingSubCategory) {
			return resultFormat(400, '二级分类已存在');
		}

		// 创建新二级分类
		await SubCategoryModel.create({
			name,
			description,
			parentId,
		});

		return resultFormat(201, '创建成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
