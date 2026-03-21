import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import CategoryModel from '~/server/models/categories.model';
import SubCategoryModel from '~/server/models/subCategories.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {post} /admin/article/publish 发布文章
 * @apiName 发布文章
 * @apiGroup 博客文章管理
 * @apiDescription 发布一篇新的博客文章
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/article/publish
 *
 * @apiBody {Object} article 文章对象
 * @apiBody {String} article.cover 封面图
 * @apiBody {String} article.title 文章标题
 * @apiBody {String} article.content 文章内容
 * @apiBody {String} article.author 作者ID
 * @apiBody {String} article.category 分类ID
 * @apiBody {String} article.subCategory 二级分类ID
 * @apiBody {String[]} [article.tags] 标签
 * @apiBody {Boolean} [article.isPublished] 是否发布
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "code": 201,
 *       "message": "发布成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const { article } = await readBody(event);

		if (!article) {
			return resultFormat(400, '缺少文章信息');
		}

		const { cover, title, content, category, subCategory, tags, isPublished } = article;

		// 前端发送的category和subCategory永远是字符串
		if (!category || typeof category !== 'string') {
			return resultFormat(400, '一级分类ID不能为空');
		}

		// 校验一级分类是否存在
		const categoryExists = await CategoryModel.findById(category);
		if (!categoryExists) {
			return resultFormat(400, '一级分类不存在');
		}

		// 校验二级分类是否存在
		if (subCategory) {
			if (typeof subCategory !== 'string') {
				return resultFormat(400, '二级分类ID格式错误');
			}
			const subCategoryExists = await SubCategoryModel.findById(subCategory);
			if (!subCategoryExists) {
				return resultFormat(400, '二级分类不存在');
			}
		}

		// 从中间件注入的管理员信息中获取当前发布者作为作者
		const adminUser = event.context.adminUser as { id: string } | undefined;
		if (!adminUser?.id) {
			return resultFormat(401, '无法获取当前登录用户信息');
		}

		await ArticleModel.create({
			cover,
			title,
			content,
			author: adminUser.id,
			category,
			subCategory: subCategory || undefined,
			tags: tags || [],
			isPublished: isPublished !== undefined ? isPublished : true,
		});

		return resultFormat(201, '发布成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
