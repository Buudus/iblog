// MongoDB 脚本：插入测试文章数据
// 使用方法：在 MongoDB shell 中执行：load('scripts/insertArticles.js')
// 或者使用 mongosh：mongosh lyblog < scripts/insertArticles.js
/* eslint-disable no-undef */
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

// 生成随机文章标题
function getRandomTitle() {
	const titles = [
		'Vue 3 组合式 API 完全指南',
		'TypeScript 高级类型系统解析',
		'Node.js 性能优化实战',
		'React Hooks 最佳实践',
		'MongoDB 数据库设计原则',
		'前端工程化实践与思考',
		'微服务架构设计模式',
		'Docker 容器化部署指南',
		'Git 工作流最佳实践',
		'Webpack 5 配置详解',
		'CSS 现代布局技术',
		'JavaScript 异步编程深入理解',
		'RESTful API 设计规范',
		'GraphQL 入门与实践',
		'前端安全防护策略',
		'移动端适配方案总结',
		'性能监控与优化',
		'代码重构技巧分享',
		'测试驱动开发实践',
		'持续集成与部署',
		'算法与数据结构学习',
		'设计模式在项目中的应用',
		'数据库索引优化',
		'缓存策略与实现',
		'消息队列使用场景',
		'分布式系统设计',
		'云原生应用开发',
		'Serverless 架构探索',
		'AI 在前端中的应用',
		'Web3 技术入门',
	];
	return titles[Math.floor(Math.random() * titles.length)];
}

// 生成随机文章内容
function getRandomContent() {
	const paragraphs = [
		'在当今快速发展的技术世界中，掌握最新的开发工具和框架变得越来越重要。',
		'本文将从基础概念开始，逐步深入探讨相关技术的核心原理和实践应用。',
		'通过实际案例和代码示例，帮助读者更好地理解和掌握这些技术。',
		'我们不仅要了解如何使用这些工具，更要理解它们背后的设计思想。',
		'在实际项目开发中，选择合适的工具和架构方案至关重要。',
		'性能优化是一个持续的过程，需要从多个维度进行考虑和优化。',
		'代码质量不仅体现在功能实现上，更体现在可维护性和可扩展性上。',
		'团队协作和代码规范是保证项目成功的重要因素。',
		'持续学习和实践是提升技术能力的最佳途径。',
		'技术选型需要综合考虑项目需求、团队能力和长期维护成本。',
	];

	let content = '';
	const paragraphCount = Math.floor(Math.random() * 5) + 5; // 5-10段
	for (let i = 0; i < paragraphCount; i++) {
		const paragraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
		content += paragraph + '\n\n';
	}
	return content.trim();
}

// 生成随机标签
function getRandomTags() {
	const allTags = [
		'Vue',
		'React',
		'TypeScript',
		'JavaScript',
		'Node.js',
		'MongoDB',
		'前端',
		'后端',
		'全栈',
		'架构',
		'性能优化',
		'工程化',
		'Docker',
		'微服务',
		'算法',
		'设计模式',
		'Webpack',
		'Git',
		'测试',
		'CI/CD',
	];

	const tagCount = Math.floor(Math.random() * 4) + 2; // 2-5个标签
	const selectedTags = [];
	const availableTags = [...allTags];

	for (let i = 0; i < tagCount; i++) {
		const randomIndex = Math.floor(Math.random() * availableTags.length);
		selectedTags.push(availableTags[randomIndex]);
		availableTags.splice(randomIndex, 1);
	}

	return selectedTags;
}

// 生成随机封面图URL
function getRandomCover() {
	const covers = [
		'https://picsum.photos/800/400?random=1',
		'https://picsum.photos/800/400?random=2',
		'https://picsum.photos/800/400?random=3',
		'https://picsum.photos/800/400?random=4',
		'https://picsum.photos/800/400?random=5',
	];
	return covers[Math.floor(Math.random() * covers.length)];
}

// 获取所有管理员用户ID
const adminUsers = db.admin_users.find({}).toArray();
if (adminUsers.length === 0) {
	print('错误：数据库中没有管理员用户，请先创建至少一个管理员用户');
	quit(1);
}

// 获取所有分类ID
const categories = db.categories.find({}).toArray();
if (categories.length === 0) {
	print('警告：数据库中没有分类，文章将不设置分类');
}

// 获取所有子分类ID
const subCategories = db.sub_categories.find({}).toArray();
if (subCategories.length === 0) {
	print('警告：数据库中没有子分类，文章将不设置子分类');
}

// 插入文章数据
const articles = [];
const articleCount = 30; // 插入30篇文章

for (let i = 0; i < articleCount; i++) {
	// 随机选择一个作者
	const randomAuthor = adminUsers[Math.floor(Math.random() * adminUsers.length)];

	// 随机选择分类（可能为空数组）
	const selectedCategories = [];
	if (categories.length > 0) {
		const categoryCount = Math.random() > 0.5 ? 1 : 0; // 50%概率有分类
		if (categoryCount > 0) {
			const randomCategory = categories[Math.floor(Math.random() * categories.length)];
			selectedCategories.push(randomCategory._id);
		}
	}

	// 随机选择子分类（可能为空数组）
	const selectedSubCategories = [];
	if (subCategories.length > 0 && selectedCategories.length > 0) {
		const subCategoryCount = Math.random() > 0.6 ? 1 : 0; // 40%概率有子分类
		if (subCategoryCount > 0) {
			const randomSubCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
			selectedSubCategories.push(randomSubCategory._id);
		}
	}

	const time = getRandomTime();
	const title = getRandomTitle() + (i > 0 ? ` ${i}` : ''); // 添加序号避免标题重复

	articles.push({
		cover: getRandomCover(),
		title: title,
		content: getRandomContent(),
		author: randomAuthor._id,
		category: selectedCategories,
		subCategory: selectedSubCategories,
		tags: getRandomTags(),
		views: Math.floor(Math.random() * 1000), // 0-999的随机浏览量
		isPublished: Math.random() > 0.3, // 70%概率已发布
		createdAt: time,
		updatedAt: time,
	});
}

// 批量插入
try {
	const result = db.articles.insertMany(articles);
	print(`成功插入 ${result.insertedIds.length} 篇文章数据`);
	print('插入的文档 ID:');
	Object.values(result.insertedIds).forEach((id, index) => {
		print(`  ${index + 1}. ${id}`);
	});
} catch (error) {
	print('插入文章时发生错误：');
	print(error.message);
	if (error.code === 11000) {
		print('提示：可能是文章标题重复，请检查或修改脚本中的标题生成逻辑');
	}
}
