// MongoDB 脚本：插入一级分类测试数据
// 使用方法：在 MongoDB shell 中执行：load('scripts/insertCategories.js')
// 或者使用 mongosh：mongosh lyblog < scripts/insertCategories.js
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

	// 一级分类数据
	const categories = [
		{
			name: '前端开发',
			description: '前端技术相关文章，包括 HTML、CSS、JavaScript、Vue、React 等前端框架和工具',
		},
		{
			name: '后端开发',
			description: '后端技术相关文章，包括 Node.js、Python、Java、数据库、服务器等技术',
		},
		{
			name: '全栈开发',
			description: '全栈开发相关文章，涵盖前后端技术栈的综合应用',
		},
		{
			name: '移动开发',
			description: '移动应用开发相关文章，包括 React Native、Flutter、原生开发等',
		},
		{
			name: 'DevOps',
			description: 'DevOps 相关文章，包括 Docker、Kubernetes、CI/CD、服务器运维等',
		},
		{
			name: '算法与数据结构',
			description: '算法和数据结构相关文章，包括算法题解、数据结构实现等',
		},
		{
			name: '设计模式',
			description: '设计模式相关文章，包括常见设计模式的实现和应用场景',
		},
		{
			name: '系统架构',
			description: '系统架构设计相关文章，包括微服务、分布式系统、架构设计等',
		},
		{
			name: '工具与技巧',
			description: '开发工具和使用技巧相关文章，包括 Git、IDE、调试技巧等',
		},
		{
			name: '技术分享',
			description: '技术分享和经验总结相关文章，包括项目经验、技术心得等',
		},
	];

	// 插入一级分类数据
	let categoriesToInsert = categories.map((cat) => {
		const time = getRandomTime();
		return {
			name: cat.name,
			description: cat.description,
			createdAt: time,
			updatedAt: time,
		};
	});

	try {
		// 检查是否已存在相同名称的分类
		const existingNames = db.categories
			.find({ name: { $in: categoriesToInsert.map((c) => c.name) } })
			.toArray()
			.map((c) => c.name);

		if (existingNames.length > 0) {
			print(`警告：以下分类已存在，将跳过：${existingNames.join(', ')}`);
			// 过滤掉已存在的分类
			categoriesToInsert = categoriesToInsert.filter((c) => !existingNames.includes(c.name));
		}

		if (categoriesToInsert.length === 0) {
			print('所有分类都已存在，无需插入');
		} else {
			const result = db.categories.insertMany(categoriesToInsert);
			print(`成功插入 ${result.insertedIds.length} 个一级分类`);
			print('插入的分类：');
			Object.values(result.insertedIds).forEach((id, index) => {
				const category = categoriesToInsert[index];
				print(`  ${index + 1}. ${category.name} (ID: ${id})`);
			});
		}
	} catch (error) {
		print('插入一级分类时发生错误：');
		print(error.message);
		if (error.code === 11000) {
			print('提示：可能是分类名称重复，请检查数据库中的分类数据');
		}
	}
})();
