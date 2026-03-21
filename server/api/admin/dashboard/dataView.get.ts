import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import AccessLogModel from '~/server/models/accessLog.model';
import { resultFormat } from '~/server/utils/util.resultFormat';
import ArticleBehaviorModel from '~/server/models/articleBehavior.model';

/** 省份名映射为地图标准名称 */
const PROVINCE_NAME_MAP: Record<string, string> = {
	北京市: '北京',
	天津市: '天津',
	河北省: '河北',
	山西省: '山西',
	内蒙古自治区: '内蒙古',
	辽宁省: '辽宁',
	吉林省: '吉林',
	黑龙江省: '黑龙江',
	上海市: '上海',
	江苏省: '江苏',
	浙江省: '浙江',
	安徽省: '安徽',
	福建省: '福建',
	江西省: '江西',
	山东省: '山东',
	河南省: '河南',
	湖北省: '湖北',
	湖南省: '湖南',
	广东省: '广东',
	广西壮族自治区: '广西',
	海南省: '海南',
	重庆市: '重庆',
	四川省: '四川',
	贵州省: '贵州',
	云南省: '云南',
	西藏自治区: '西藏',
	陕西省: '陕西',
	甘肃省: '甘肃',
	青海省: '青海',
	宁夏回族自治区: '宁夏',
	新疆维吾尔自治区: '新疆',
	香港特别行政区: '香港',
	澳门特别行政区: '澳门',
	台湾省: '台湾',
};

function normalizeProvince(name: string): string {
	if (!name || typeof name !== 'string') return '未知';
	const trimmed = name.trim();
	return (
		PROVINCE_NAME_MAP[trimmed] ||
		trimmed.replace(/(省|市|自治区|特别行政区|壮族|回族|维吾尔)/g, '') ||
		trimmed
	);
}

/**
 * @api {get} /admin/dashboard/dataView 获取数据概览
 * @apiName 获取数据概览
 * @apiGroup 仪表盘
 * @apiDescription 获取数据概览页所需数据：今日访问量(按IP去重)、热门文章TOP3、最近七天文章浏览时长折线图、最近七天浏览量最高的分类TOP5柱状图、全国访问分布地图数据
 *
 * @apiPermission admin
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 数据概览
 * @apiSuccess {Number} data.todayVisits 今日访问量（按 IP 去重）
 * @apiSuccess {Object[]} data.hotArticles 热门文章 TOP3
 * @apiSuccess {String} data.hotArticles._id 文章ID
 * @apiSuccess {String} data.hotArticles.cover 封面
 * @apiSuccess {String} data.hotArticles.title 标题
 * @apiSuccess {Number} data.hotArticles.views 浏览量
 * @apiSuccess {Number} data.hotArticles.likes 点赞数
 * @apiSuccess {Number} data.hotArticles.totalBrowsingDurationMinutes 总浏览时长（分钟）
 * @apiSuccess {Object} data.lineChart 折线图数据
 * @apiSuccess {String[]} data.lineChart.category 横轴日期（MM-DD）
 * @apiSuccess {Number[]} data.lineChart.data 每日文章浏览时长（分钟）
 * @apiSuccess {String} data.lineChart.title 图表标题
 * @apiSuccess {Object} data.barChart 柱状图数据
 * @apiSuccess {String[]} data.barChart.category 分类名称
 * @apiSuccess {Number[]} data.barChart.data 各分类浏览量
 * @apiSuccess {String} data.barChart.title 图表标题
 * @apiSuccess {Object[]} data.mapData 全国访问分布
 * @apiSuccess {String} data.mapData.name 省份名称
 * @apiSuccess {Number} data.mapData.value 该省访问人数（按 IP 去重）
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "todayVisits": 128,
 *         "hotArticles": [
 *           {
 *             "_id": "60c72b2f9b1d8e001c8e4b8a",
 *             "cover": "/uploads/cover.jpg",
 *             "title": "示例文章",
 *             "views": 520,
 *             "likes": 30,
 *             "totalBrowsingDurationMinutes": 120
 *           }
 *         ],
 *         "lineChart": {
 *           "category": ["01-15", "01-16", "01-17", "01-18", "01-19", "01-20", "01-21"],
 *           "data": [45, 62, 38, 55, 70, 48, 52],
 *           "title": "最近七天文章浏览时长(分钟)"
 *         },
 *         "barChart": {
 *           "category": ["前端", "后端", "数据库"],
 *           "data": [320, 180, 95],
 *           "title": "最近七天浏览量最高的分类 TOP5"
 *         },
 *         "mapData": [
 *           { "name": "广东", "value": 88 },
 *           { "name": "北京", "value": 56 }
 *         ]
 *       }
 *     }
 */
export default defineEventHandler(async () => {
	try {
		const today = dayjs().format('YYYY年MM月DD日');
		const todayStart = `${today} 00:00:00`;
		const todayEnd = `${today} 23:59:59`;

		// 最近 7 天的起止时间
		const days: string[] = [];
		for (let i = 6; i >= 0; i--) {
			days.push(dayjs().subtract(i, 'day').format('MM-DD'));
		}
		const sevenDaysStart = dayjs().subtract(6, 'day').format('YYYY年MM月DD日') + ' 00:00:00';
		const sevenDaysEnd = todayEnd;

		const [todayVisitsResult, lineChartResult, barChartResult, hotArticlesData, mapDataResult] =
			await Promise.all([
				// 今日新增访问量（按 IP 去重）
				AccessLogModel.aggregate([
					{ $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
					{ $group: { _id: '$ip' } },
					{ $count: 'total' },
				]),
				// 最近 7 天文章总浏览时长（分钟）
				ArticleBehaviorModel.aggregate([
					{ $match: { createdAt: { $gte: sevenDaysStart, $lte: sevenDaysEnd } } },
					{
						$group: {
							_id: {
								// 🔧 修复：使用 $substrCP 替代 $substr，并将长度修正为 11
								// $substrCP 按字符截取，避免中文乱码；"YYYY年MM月DD日" 共11个字符
								$substrCP: ['$createdAt', 0, 11],
							},
							totalSeconds: { $sum: '$browsingDuration' },
						},
					},
				]),
				// 最近 7 天浏览量最高的分类 TOP5
				ArticleBehaviorModel.aggregate([
					{ $match: { createdAt: { $gte: sevenDaysStart, $lte: sevenDaysEnd } } },
					{
						$group: {
							_id: { articleId: '$articleId', ip: '$ip' },
						},
					},
					{ $group: { _id: '$_id.articleId', views: { $sum: 1 } } },
					{
						$lookup: {
							from: 'articles',
							localField: '_id',
							foreignField: '_id',
							as: 'article',
						},
					},
					{ $unwind: { path: '$article', preserveNullAndEmptyArrays: false } },
					{ $match: { 'article.category': { $exists: true, $ne: null } } },
					{
						$lookup: {
							from: 'categories',
							localField: 'article.category',
							foreignField: '_id',
							as: 'category',
						},
					},
					{ $unwind: { path: '$category', preserveNullAndEmptyArrays: false } },
					{
						$group: {
							_id: '$category.name',
							totalViews: { $sum: '$views' },
						},
					},
					{ $sort: { totalViews: -1 } },
					{ $limit: 5 },
				]),
				// 热门文章 TOP3（含总浏览时长）
				(async () => {
					const publishedArticles = await ArticleModel.find({ isPublished: true }).select('_id');
					const articleIds = publishedArticles.map((a) => a._id);
					if (articleIds.length === 0) return [];

					const [viewsStats, likesStats, durationStats] = await Promise.all([
						ArticleBehaviorModel.aggregate([
							{ $match: { articleId: { $in: articleIds } } },
							{ $group: { _id: { articleId: '$articleId', ip: '$ip', user: '$user' } } },
							{ $group: { _id: '$_id.articleId', views: { $sum: 1 } } },
						]),
						ArticleBehaviorModel.aggregate([
							{ $match: { articleId: { $in: articleIds }, like: true } },
							{ $group: { _id: { articleId: '$articleId', user: '$user' } } },
							{ $group: { _id: '$_id.articleId', likes: { $sum: 1 } } },
						]),
						ArticleBehaviorModel.aggregate([
							{ $match: { articleId: { $in: articleIds } } },
							{ $group: { _id: '$articleId', totalSeconds: { $sum: '$browsingDuration' } } },
						]),
					]);

					const viewsMap = new Map<string, number>(
						viewsStats.map((s: { _id: unknown; views: number }) => [String(s._id), s.views]),
					);
					const likesMap = new Map<string, number>(
						likesStats.map((s: { _id: unknown; likes: number }) => [String(s._id), s.likes]),
					);
					const durationMap = new Map<string, number>(
						durationStats.map((s: { _id: unknown; totalSeconds: number }) => [
							String(s._id),
							Math.floor(s.totalSeconds / 60),
						]),
					);

					const scores = articleIds.map((id) => {
						const idStr = String(id);
						const views = viewsMap.get(idStr) || 0;
						const likes = likesMap.get(idStr) || 0;
						return { articleId: id, views, likes, hotScore: views * 1 + likes * 2 };
					});
					const top3 = scores
						.sort((a, b) => b.hotScore - a.hotScore)
						.slice(0, 3)
						.map((s) => s.articleId);

					const articles = await ArticleModel.find({ _id: { $in: top3 } })
						.select('cover title _id')
						.lean();

					const articleMap = new Map(articles.map((a) => [String(a._id), a]));
					return top3
						.map((id) => {
							const a = articleMap.get(String(id));
							if (!a) return null;
							const views = viewsMap.get(String(id)) || 0;
							const likes = likesMap.get(String(id)) || 0;
							const totalBrowsingDurationMinutes = durationMap.get(String(id)) || 0;
							return {
								...a,
								views,
								likes,
								totalBrowsingDurationMinutes,
							};
						})
						.filter(Boolean);
				})(),
				// 全国访问分布（按 IP 去重）
				AccessLogModel.aggregate([
					{ $match: { 'regionInfo.province': { $exists: true, $ne: '' } } },
					{ $group: { _id: { province: '$regionInfo.province', ip: '$ip' } } },
					{ $group: { _id: '$_id.province', count: { $sum: 1 } } },
				]),
			]);

		const todayVisits = todayVisitsResult.length > 0 ? todayVisitsResult[0].total : 0;

		const dayToMinutes = new Map<string, number>();
		lineChartResult.forEach((r: { _id: string; totalSeconds: number }) => {
			const key = r._id.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '');
			const d = dayjs(key);
			dayToMinutes.set(d.format('MM-DD'), Math.floor(r.totalSeconds / 60));
		});
		const lineChartData = days.map((d) => dayToMinutes.get(d) || 0);

		const barChartCategory = barChartResult.map((r: { _id: string }) => r._id);
		const barChartData = barChartResult.map((r: { totalViews: number }) => r.totalViews);

		const provinceCount = new Map<string, number>();
		mapDataResult.forEach((r: { _id: string; count: number }) => {
			const name = normalizeProvince(r._id);
			provinceCount.set(name, (provinceCount.get(name) || 0) + r.count);
		});
		const mapData = Array.from(provinceCount.entries()).map(([name, value]) => ({ name, value }));

		return resultFormat(200, '获取成功', {
			todayVisits,
			hotArticles: hotArticlesData,
			lineChart: {
				category: days,
				data: lineChartData,
				title: '最近七天文章浏览时长(分钟)',
			},
			barChart: {
				category: barChartCategory,
				data: barChartData,
				title: '最近七天浏览量最高的分类 TOP5',
			},
			mapData,
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
