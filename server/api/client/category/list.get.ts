import { error } from '~/server/utils/util.logger';
import CategoryModel from '~/server/models/categories.model';
import SubCategoryModel from '~/server/models/subCategories.model';
import ArticleModel from '~/server/models/article.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {get} /client/category/list 获取分类列表
 * @apiName 获取分类列表
 * @apiGroup 博客前台
 * @apiDescription 一次性获取所有一级分类和二级分类，二级分类作为 children 嵌入一级分类
 *
 * @apiSampleRequest /client/category/list
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 分类列表
 * @apiSuccess {Number} data[].articleCount 该分类下的文章数量
 * @apiSuccess {Object[]} data[].children 二级分类列表
 * @apiSuccess {Number} data[].children[].articleCount 该二级分类下的文章数量
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "_id": "6501a2b3c4d5e6f7a8b9c0d2",
 *         "name": "前端",
 *         "description": "前端相关分类",
 *         "articleCount": 10,
 *         "createdAt": "2025年10月02日 12:00:00",
 *         "updatedAt": "2025年10月02日 12:00:00",
 *         "children": [
 *           { "_id": "6501a2b3c4d5e6f7a8b9c0d3", "name": "Vue", "description": "Vue相关", "articleCount": 5, "parentId": "6501a2b3c4d5e6f7a8b9c0d2", "createdAt": "2025年10月02日 12:00:00", "updatedAt": "2025年10月02日 12:00:00" }
 *         ]
 *       }
 *     ]
 */
export default defineEventHandler(async () => {
	try {
		// 获取所有一级分类
		const categories = await CategoryModel.find();

		// 获取所有二级分类
		const subCategories = await SubCategoryModel.find();

		// 统计一级分类的文章数量（只统计已发布的文章）
		const categoryArticleCounts = await Promise.all(
			categories.map(async (cat) => {
				const count = await ArticleModel.countDocuments({
					category: cat._id,
					isPublished: true,
				});
				return { categoryId: cat._id, count };
			})
		);

		// 统计二级分类的文章数量（只统计已发布的文章）
		const subCategoryArticleCounts = await Promise.all(
			subCategories.map(async (sub) => {
				const count = await ArticleModel.countDocuments({
					subCategory: sub._id,
					isPublished: true,
				});
				return { subCategoryId: sub._id, count };
			})
		);

		// 创建文章数量映射表
		const categoryCountMap = new Map(
			categoryArticleCounts.map((item) => [String(item.categoryId), item.count])
		);
		const subCategoryCountMap = new Map(
			subCategoryArticleCounts.map((item) => [String(item.subCategoryId), item.count])
		);

		// 按 parentId 挂载 children 字段，并添加文章数量
		const result = categories.map((cat) => {
			const children = subCategories
				.filter((sub) => String(sub.parentId) === String(cat._id))
				.map((sub) => ({
					...sub.toObject(),
					articleCount: subCategoryCountMap.get(String(sub._id)) || 0,
				}));

			return {
				...cat.toObject(),
				articleCount: categoryCountMap.get(String(cat._id)) || 0,
				children,
			};
		});

		// 返回数据
		return resultFormat(200, '获取成功', result);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		console.error(err);
		return resultFormat(500, errorMessage);
	}
});
