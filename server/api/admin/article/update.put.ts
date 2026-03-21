import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import CategoryModel from '~/server/models/categories.model';
import SubCategoryModel from '~/server/models/subCategories.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {put} /admin/article/update 更新文章
 * @apiName 更新文章
 * @apiGroup 博客文章管理
 * @apiDescription 更新一篇博客文章
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/article/update
 *
 * @apiBody {Object} article 文章对象
 * @apiBody {String} article.id 文章ID
 * @apiBody {String} [article.cover] 封面图
 * @apiBody {String} [article.title] 文章标题
 * @apiBody {String} [article.content] 文章内容
 * @apiBody {String} [article.category] 分类ID
 * @apiBody {String} [article.subCategory] 二级分类ID
 * @apiBody {String[]} [article.tags] 标签
 * @apiBody {Boolean} [article.isPublished] 是否发布
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
		const { article } = await readBody(event);

		if (!article || !article.id) {
			return resultFormat(400, '缺少文章信息');
		}

		const { id, cover, title, content, category, subCategory, tags, isPublished } = article;

		// 前端发送的category和subCategory永远是字符串
		// 校验一级分类是否存在
		if (category !== undefined) {
			if (typeof category !== 'string') {
				return resultFormat(400, '一级分类ID格式错误');
			}
			const categoryExists = await CategoryModel.findById(category);
			if (!categoryExists) {
				return resultFormat(400, '一级分类不存在');
			}
		}

		// 校验二级分类是否存在
		if (subCategory !== undefined) {
			if (typeof subCategory !== 'string') {
				return resultFormat(400, '二级分类ID格式错误');
			}
			const subCategoryExists = await SubCategoryModel.findById(subCategory);
			if (!subCategoryExists) {
				return resultFormat(400, '二级分类不存在');
			}
		}

		// 构建更新对象，只包含提供的字段
		const updateData: Record<string, unknown> = {
				updatedAt: dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
		};

		if (cover !== undefined) updateData.cover = cover;
		if (title !== undefined) updateData.title = title;
		if (content !== undefined) updateData.content = content;
		if (category !== undefined) updateData.category = category;
		if (subCategory !== undefined) updateData.subCategory = subCategory;
		if (tags !== undefined) updateData.tags = tags;
		if (isPublished !== undefined) updateData.isPublished = isPublished;

		const updatedArticle = await ArticleModel.findByIdAndUpdate(id, updateData, {
				new: true,
				runValidators: true,
		});

		console.log('updatedArticle: ', updatedArticle);

		if (!updatedArticle) {
			// return resultFormat(404, '文章不存在');
		}

		return resultFormat(200, '更新成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
