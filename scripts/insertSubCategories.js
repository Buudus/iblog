// MongoDB 脚本：插入二级分类测试数据
// 使用方法：在 MongoDB shell 中执行：load('scripts/insertSubCategories.js')
// 或者使用 mongosh：mongosh lyblog < scripts/insertSubCategories.js
// 注意：需要先运行 insertCategories.js 创建一级分类
/* eslint-disable no-undef */
(function () {
	// 切换到 lyblog 数据库
	db = db.getSiblingDB('lyblog');

	// 生成随机时间字符串（格式：YYYY年MM月DD日 HH:mm:ss）
	function getRandomTime() {
		const now = new Date();
		const daysAgo = Math.floor(Math.random() * 180); // 过去180天内的随机时间
		const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
		const hours = Math.floor(Math.random() * 24);
		const minutes = Math.floor(Math.random() * 60);
		const seconds = Math.floor(Math.random() * 60);
		date.setHours(hours, minutes, seconds);

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hour = String(date.getHours()).padStart(2, '0');
		const min = String(date.getMinutes()).padStart(2, '0');
		const sec = String(date.getSeconds()).padStart(2, '0');

		return `${year}年${month}月${day}日 ${hour}:${min}:${sec}`;
	}

	// 获取所有一级分类
	const parentCategories = db.categories.find({}).toArray();

	if (parentCategories.length === 0) {
		print('错误：数据库中没有一级分类，请先运行 insertCategories.js 创建一级分类');
		quit(1);
	}

	print(`找到 ${parentCategories.length} 个一级分类`);

	// 二级分类数据映射（根据一级分类名称）
	const subCategoriesMap = {
		前端开发: [
			{ name: 'Vue', description: 'Vue.js 框架相关文章' },
			{ name: 'React', description: 'React 框架相关文章' },
			{ name: 'Angular', description: 'Angular 框架相关文章' },
			{ name: 'JavaScript', description: 'JavaScript 语言相关文章' },
			{ name: 'TypeScript', description: 'TypeScript 语言相关文章' },
			{ name: 'CSS', description: 'CSS 样式相关文章' },
			{ name: 'HTML', description: 'HTML 标记语言相关文章' },
			{ name: '前端工程化', description: '前端工程化工具和流程相关文章' },
		],
		后端开发: [
			{ name: 'Node.js', description: 'Node.js 运行时相关文章' },
			{ name: 'Python', description: 'Python 语言相关文章' },
			{ name: 'Java', description: 'Java 语言相关文章' },
			{ name: 'Go', description: 'Go 语言相关文章' },
			{ name: '数据库', description: '数据库相关文章，包括 MySQL、MongoDB 等' },
			{ name: 'API 设计', description: 'API 设计和开发相关文章' },
			{ name: '服务器', description: '服务器配置和管理相关文章' },
		],
		全栈开发: [
			{ name: 'MEAN 栈', description: 'MEAN 技术栈相关文章' },
			{ name: 'MERN 栈', description: 'MERN 技术栈相关文章' },
			{ name: '全栈框架', description: '全栈开发框架相关文章' },
			{ name: '项目实战', description: '全栈项目实战经验分享' },
		],
		移动开发: [
			{ name: 'React Native', description: 'React Native 跨平台开发相关文章' },
			{ name: 'Flutter', description: 'Flutter 跨平台开发相关文章' },
			{ name: 'iOS 开发', description: 'iOS 原生开发相关文章' },
			{ name: 'Android 开发', description: 'Android 原生开发相关文章' },
			{ name: '小程序', description: '微信小程序、支付宝小程序等开发相关文章' },
		],
		DevOps: [
			{ name: 'Docker', description: 'Docker 容器化相关文章' },
			{ name: 'Kubernetes', description: 'Kubernetes 容器编排相关文章' },
			{ name: 'CI/CD', description: '持续集成和持续部署相关文章' },
			{ name: '服务器运维', description: '服务器运维和管理相关文章' },
			{ name: '监控与日志', description: '系统监控和日志管理相关文章' },
		],
		算法与数据结构: [
			{ name: '算法题解', description: '算法题目解析和解答相关文章' },
			{ name: '数据结构', description: '数据结构实现和应用相关文章' },
			{ name: '算法优化', description: '算法优化技巧相关文章' },
			{ name: '动态规划', description: '动态规划算法相关文章' },
		],
		设计模式: [
			{ name: '创建型模式', description: '单例、工厂等创建型设计模式相关文章' },
			{ name: '结构型模式', description: '适配器、装饰器等结构型设计模式相关文章' },
			{ name: '行为型模式', description: '观察者、策略等行为型设计模式相关文章' },
			{ name: '设计原则', description: 'SOLID 等设计原则相关文章' },
		],
		系统架构: [
			{ name: '微服务', description: '微服务架构相关文章' },
			{ name: '分布式系统', description: '分布式系统设计相关文章' },
			{ name: '系统设计', description: '系统架构设计相关文章' },
			{ name: '性能优化', description: '系统性能优化相关文章' },
		],
		工具与技巧: [
			{ name: 'Git', description: 'Git 版本控制相关文章' },
			{ name: 'IDE 使用', description: 'IDE 使用技巧相关文章' },
			{ name: '调试技巧', description: '代码调试技巧相关文章' },
			{ name: '开发工具', description: '开发工具推荐和使用相关文章' },
		],
		技术分享: [
			{ name: '项目经验', description: '项目开发经验分享相关文章' },
			{ name: '技术心得', description: '技术学习和实践心得相关文章' },
			{ name: '学习笔记', description: '技术学习笔记相关文章' },
			{ name: '技术趋势', description: '技术发展趋势和展望相关文章' },
		],
	};

	// 插入二级分类数据
	let subCategoriesToInsert = [];

	parentCategories.forEach((parent) => {
		const parentName = parent.name;
		const subCategories = subCategoriesMap[parentName] || [];

		subCategories.forEach((sub) => {
			const time = getRandomTime();
			subCategoriesToInsert.push({
				name: sub.name,
				description: sub.description,
				parentId: parent._id,
				createdAt: time,
				updatedAt: time,
			});
		});
	});

	if (subCategoriesToInsert.length === 0) {
		print('没有找到匹配的二级分类数据');
		quit(0);
	}

	try {
		// 检查是否已存在相同名称和父级的二级分类
		const existingSubCategories = db.sub_categories
			.find({
				$or: subCategoriesToInsert.map((sub) => ({
					name: sub.name,
					parentId: sub.parentId,
				})),
			})
			.toArray();

		if (existingSubCategories.length > 0) {
			print(`警告：以下二级分类已存在，将跳过：`);
			existingSubCategories.forEach((sub) => {
				print(`  - ${sub.name} (父级ID: ${sub.parentId})`);
			});

			// 过滤掉已存在的二级分类
			const existingKeys = new Set(
				existingSubCategories.map((sub) => `${sub.name}_${sub.parentId}`)
			);
			const filtered = subCategoriesToInsert.filter(
				(sub) => !existingKeys.has(`${sub.name}_${sub.parentId}`)
			);

			if (filtered.length === 0) {
				print('所有二级分类都已存在，无需插入');
				quit(0);
			}

			subCategoriesToInsert.length = 0;
			subCategoriesToInsert.push(...filtered);
		}

		const result = db.sub_categories.insertMany(subCategoriesToInsert);
		print(`成功插入 ${result.insertedIds.length} 个二级分类`);
		print('插入的二级分类：');
		Object.values(result.insertedIds).forEach((id, index) => {
			const subCategory = subCategoriesToInsert[index];
			const parent = parentCategories.find((p) => String(p._id) === String(subCategory.parentId));
			print(
				`  ${index + 1}. ${subCategory.name} (父级: ${parent ? parent.name : '未知'}, ID: ${id})`
			);
		});
	} catch (error) {
		print('插入二级分类时发生错误：');
		print(error.message);
		if (error.code === 11000) {
			print('提示：可能是二级分类名称重复，请检查数据库中的分类数据');
		}
	}
})();
