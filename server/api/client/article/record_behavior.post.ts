import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import { resultFormat } from '~/server/utils/util.resultFormat';
import ArticleBehaviorModel from '~/server/models/articleBehavior.model';

/**
 * @api {post} /client/article/record_behavior 记录文章行为
 * @apiName 记录文章行为
 * @apiGroup 博客前台
 * @apiDescription 记录用户对文章的行为数据，包括点赞状态、浏览进度和浏览时长。如果该用户对该文章已有记录，则更新记录；否则创建新记录。
 *
 * @apiSampleRequest /client/article/record_behavior
 *
 * @apiBody {String} articleId 文章ID
 * @apiBody {Boolean} [like] 是否点赞
 * @apiBody {Number} [browseProgress] 浏览进度（百分比，0-100）
 * @apiBody {Number} [browsingDuration] 浏览时长（单位：秒）
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "ok"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);

		// 获取用户 ID
		const user = getCookie(event, 'userId');
		if (!user) return;

		const { articleId, like, browseProgress, browsingDuration } = body;

		if (!articleId) return;

		// 查询该用户最新的记录并更新记录
		const findResult = await ArticleBehaviorModel.find({ articleId, user }).sort({
			createdAt: -1,
		});

		if (findResult.length > 0) {
			const record = findResult[0];

			if (like === true) {
				const likeRecord = await ArticleBehaviorModel.findOne({ articleId, user, like: true });
				if (likeRecord) {
					return resultFormat(200, '已经点赞过这篇文章咯~');
				}
			}

			await ArticleBehaviorModel.updateOne(
				{ _id: record._id },
				{
					$set: {
						like,
						browseProgress,
						browsingDuration,
						updatedAt: dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
					},
				}
			);

			return resultFormat(200, 'ok');
		}

		await ArticleBehaviorModel.create({
			user,
			articleId,
			like,
			browseProgress,
			browsingDuration,
		});

		return resultFormat(200, 'ok');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
