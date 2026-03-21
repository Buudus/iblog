// MongoDB 脚本：插入测试文章数据（与分类数据对应）
// 使用方法：在 MongoDB shell 中执行：load('scripts/insertArticlesWithCategories.js')
// 或者使用 mongosh：mongosh lyblog < scripts/insertArticlesWithCategories.js
// 注意：需要先运行 insertCategories.js 和 insertSubCategories.js 创建分类数据
/* eslint-disable no-undef */
(function () {
	'use strict';
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

	// 获取所有管理员用户
	const adminUsers = db.admin_users.find({}).toArray();
	if (adminUsers.length === 0) {
		print('错误：数据库中没有管理员用户，请先创建至少一个管理员用户');
		quit(1);
	}

	// 获取所有分类和子分类
	const categories = db.categories.find({}).toArray();
	const subCategories = db.sub_categories.find({}).toArray();

	if (categories.length === 0) {
		print('错误：数据库中没有分类，请先运行 insertCategories.js 创建分类');
		quit(1);
	}

	print(`找到 ${categories.length} 个一级分类，${subCategories.length} 个二级分类`);

	// 创建分类名称到ID的映射
	const categoryNameMap = {};
	categories.forEach((cat) => {
		categoryNameMap[cat.name] = cat._id;
	});

	const subCategoryNameMap = {};
	subCategories.forEach((sub) => {
		const key = sub.name;
		if (!subCategoryNameMap[key]) {
			subCategoryNameMap[key] = [];
		}
		subCategoryNameMap[key].push(sub._id);
	});

	// 文章数据配置（根据分类名称匹配）
	const articleConfigs = [
		// 前端开发相关文章
		{
			title: 'Vue 3 组合式 API 完全指南',
			content:
				'Vue 3 引入了组合式 API，这是一个全新的方式来组织组件逻辑。组合式 API 提供了更好的逻辑复用和代码组织方式，特别适合大型项目。本文将深入探讨组合式 API 的核心概念、使用方法和最佳实践。\n\n通过实际案例，我们将学习如何使用 setup 函数、响应式 API、生命周期钩子等核心功能。同时，我们还会介绍如何将组合式 API 与选项式 API 结合使用，以及如何处理常见的开发场景。',
			categoryName: '前端开发',
			subCategoryName: 'Vue',
			tags: ['Vue', '前端', 'JavaScript'],
		},
		{
			title: 'React Hooks 最佳实践',
			content:
				'React Hooks 是 React 16.8 引入的新特性，它允许我们在函数组件中使用状态和其他 React 特性。本文将介绍常用的 Hooks，包括 useState、useEffect、useContext 等，并分享在实际项目中的最佳实践。\n\n我们将探讨如何正确使用 Hooks，避免常见的陷阱，以及如何创建自定义 Hooks 来复用逻辑。通过实际案例，帮助开发者更好地理解和应用 Hooks。',
			categoryName: '前端开发',
			subCategoryName: 'React',
			tags: ['React', '前端', 'Hooks'],
		},
		{
			title: 'TypeScript 高级类型系统解析',
			content:
				'TypeScript 的类型系统是其最强大的特性之一。本文将深入探讨 TypeScript 的高级类型，包括泛型、条件类型、映射类型、模板字面量类型等。\n\n通过学习这些高级类型，我们可以编写更加类型安全、可维护的代码。文章将结合实际案例，展示如何在实际项目中应用这些高级类型特性。',
			categoryName: '前端开发',
			subCategoryName: 'TypeScript',
			tags: ['TypeScript', '前端', '类型系统'],
		},
		{
			title: 'JavaScript 异步编程深入理解',
			content:
				'JavaScript 的异步编程是前端开发的核心技能。本文将深入探讨 Promise、async/await、Generator 等异步编程方式，帮助开发者更好地理解和应用异步编程。\n\n我们将从基础概念开始，逐步深入到高级应用场景，包括错误处理、并发控制、性能优化等方面。通过实际案例，展示如何在实际项目中应用这些异步编程技术。',
			categoryName: '前端开发',
			subCategoryName: 'JavaScript',
			tags: ['JavaScript', '前端', '异步编程'],
		},
		{
			title: 'CSS 现代布局技术',
			content:
				'现代 CSS 提供了多种强大的布局技术，包括 Flexbox、Grid、Subgrid 等。本文将介绍这些现代布局技术的使用方法、适用场景和最佳实践。\n\n我们将通过实际案例，展示如何使用这些布局技术解决常见的布局问题，包括响应式设计、复杂布局、对齐方式等。',
			categoryName: '前端开发',
			subCategoryName: 'CSS',
			tags: ['CSS', '前端', '布局'],
		},
		{
			title: '前端工程化实践与思考',
			content:
				'前端工程化是现代前端开发的重要组成部分。本文将探讨前端工程化的各个方面，包括构建工具、模块化、代码规范、自动化测试等。\n\n我们将介绍 Webpack、Vite、Rollup 等主流构建工具的使用方法，以及如何建立一套完整的前端工程化体系。',
			categoryName: '前端开发',
			subCategoryName: '前端工程化',
			tags: ['前端', '工程化', 'Webpack'],
		},
		// 后端开发相关文章
		{
			title: 'Node.js 性能优化实战',
			content:
				'Node.js 作为服务端 JavaScript 运行时，性能优化是一个重要话题。本文将介绍 Node.js 性能优化的各种方法和技巧，包括事件循环优化、内存管理、异步处理等。\n\n我们将通过实际案例，展示如何识别性能瓶颈，使用性能分析工具，以及如何优化代码以获得更好的性能。',
			categoryName: '后端开发',
			subCategoryName: 'Node.js',
			tags: ['Node.js', '后端', '性能优化'],
		},
		{
			title: 'Python Web 开发实践',
			content:
				'Python 在 Web 开发领域有着广泛的应用。本文将介绍使用 Python 进行 Web 开发的各种框架和工具，包括 Django、Flask、FastAPI 等。\n\n我们将探讨这些框架的特点、适用场景，以及如何在实际项目中选择合适的框架。同时，我们还会介绍 Python Web 开发的最佳实践。',
			categoryName: '后端开发',
			subCategoryName: 'Python',
			tags: ['Python', '后端', 'Web开发'],
		},
		{
			title: 'MongoDB 数据库设计原则',
			content:
				'MongoDB 作为 NoSQL 数据库，其设计原则与传统关系型数据库有所不同。本文将介绍 MongoDB 的数据库设计原则，包括文档结构设计、索引优化、数据建模等。\n\n我们将探讨如何设计高效的文档结构，如何选择合适的索引策略，以及如何处理数据关系。通过实际案例，帮助开发者更好地使用 MongoDB。',
			categoryName: '后端开发',
			subCategoryName: '数据库',
			tags: ['MongoDB', '后端', '数据库'],
		},
		{
			title: 'RESTful API 设计规范',
			content:
				'RESTful API 是现代 Web 应用的标准接口设计方式。本文将介绍 RESTful API 的设计原则、最佳实践，以及如何设计一个优秀的 API。\n\n我们将探讨资源命名、HTTP 方法使用、状态码选择、版本控制等方面，帮助开发者设计出符合规范的 API 接口。',
			categoryName: '后端开发',
			subCategoryName: 'API 设计',
			tags: ['API', '后端', 'RESTful'],
		},
		// DevOps 相关文章
		{
			title: 'Docker 容器化部署指南',
			content:
				'Docker 容器化技术已经成为现代应用部署的标准方式。本文将介绍 Docker 的基本概念、使用方法，以及如何将应用容器化部署。\n\n我们将从 Docker 的基础知识开始，逐步深入到 Dockerfile 编写、镜像构建、容器编排等高级话题。通过实际案例，展示如何在实际项目中使用 Docker。',
			categoryName: 'DevOps',
			subCategoryName: 'Docker',
			tags: ['Docker', 'DevOps', '容器化'],
		},
		{
			title: 'Kubernetes 容器编排实践',
			content:
				'Kubernetes 是容器编排领域的标准工具。本文将介绍 Kubernetes 的核心概念、架构设计，以及如何在实际项目中使用 Kubernetes 进行容器编排。\n\n我们将探讨 Pod、Service、Deployment 等核心资源的使用方法，以及如何实现应用的自动化部署、扩缩容、滚动更新等功能。',
			categoryName: 'DevOps',
			subCategoryName: 'Kubernetes',
			tags: ['Kubernetes', 'DevOps', '容器编排'],
		},
		{
			title: 'CI/CD 持续集成与部署',
			content:
				'CI/CD 是现代软件开发流程的重要组成部分。本文将介绍持续集成和持续部署的概念、实现方法，以及如何建立一套完整的 CI/CD 流程。\n\n我们将探讨如何使用 GitHub Actions、GitLab CI、Jenkins 等工具实现 CI/CD，以及如何编写自动化测试、构建、部署脚本。',
			categoryName: 'DevOps',
			subCategoryName: 'CI/CD',
			tags: ['CI/CD', 'DevOps', '自动化'],
		},
		// 算法与数据结构
		{
			title: '算法题解：动态规划入门',
			content:
				'动态规划是算法设计中的重要方法。本文将介绍动态规划的基本概念、解题思路，以及如何识别和解决动态规划问题。\n\n我们将通过经典的动态规划问题，如斐波那契数列、背包问题、最长公共子序列等，帮助读者理解动态规划的核心思想。同时，我们还会介绍如何优化动态规划算法的时间和空间复杂度。',
			categoryName: '算法与数据结构',
			subCategoryName: '动态规划',
			tags: ['算法', '动态规划', '数据结构'],
		},
		{
			title: '数据结构：树与图的实现',
			content:
				'树和图是计算机科学中重要的数据结构。本文将介绍树和图的基本概念、实现方法，以及它们在实际应用中的使用场景。\n\n我们将探讨二叉树、平衡树、图的表示方法、遍历算法等核心内容。通过实际案例，展示如何在实际项目中使用这些数据结构。',
			categoryName: '算法与数据结构',
			subCategoryName: '数据结构',
			tags: ['算法', '数据结构', '树'],
		},
		// 设计模式
		{
			title: '设计模式：单例模式的应用',
			content:
				'单例模式是创建型设计模式中最简单的一种。本文将介绍单例模式的概念、实现方法，以及在实际项目中的应用场景。\n\n我们将探讨单例模式的多种实现方式，包括懒汉式、饿汉式、双重检查锁定等，以及它们的优缺点。同时，我们还会介绍如何在 JavaScript 和 TypeScript 中实现单例模式。',
			categoryName: '设计模式',
			subCategoryName: '创建型模式',
			tags: ['设计模式', '单例模式', '创建型'],
		},
		{
			title: '设计模式：观察者模式实践',
			content:
				'观察者模式是行为型设计模式中的重要模式。本文将介绍观察者模式的概念、实现方法，以及在实际项目中的应用场景。\n\n我们将探讨如何实现观察者模式，包括发布-订阅模式、事件驱动架构等。通过实际案例，展示如何在实际项目中使用观察者模式解耦代码。',
			categoryName: '设计模式',
			subCategoryName: '行为型模式',
			tags: ['设计模式', '观察者模式', '行为型'],
		},
		// 系统架构
		{
			title: '微服务架构设计模式',
			content:
				'微服务架构是现代分布式系统的重要架构模式。本文将介绍微服务架构的核心概念、设计原则，以及如何设计和实现微服务系统。\n\n我们将探讨服务拆分、服务通信、数据管理、部署策略等关键话题。通过实际案例，展示如何在实际项目中应用微服务架构。',
			categoryName: '系统架构',
			subCategoryName: '微服务',
			tags: ['微服务', '架构', '分布式'],
		},
		{
			title: '分布式系统设计原则',
			content:
				'分布式系统设计是一个复杂的领域。本文将介绍分布式系统的核心概念、设计原则，以及如何解决分布式系统中的常见问题。\n\n我们将探讨一致性、可用性、分区容错性等核心概念，以及如何在实际项目中应用这些原则。同时，我们还会介绍分布式系统中的常见问题和解决方案。',
			categoryName: '系统架构',
			subCategoryName: '分布式系统',
			tags: ['分布式', '架构', '系统设计'],
		},
		// 工具与技巧
		{
			title: 'Git 工作流最佳实践',
			content:
				'Git 是版本控制的标准工具。本文将介绍 Git 的各种工作流，包括 Git Flow、GitHub Flow、GitLab Flow 等，以及它们的使用场景和最佳实践。\n\n我们将探讨如何选择合适的工作流，如何管理分支，如何处理冲突，以及如何建立一套高效的版本控制流程。',
			categoryName: '工具与技巧',
			subCategoryName: 'Git',
			tags: ['Git', '版本控制', '工具'],
		},
		{
			title: '代码调试技巧分享',
			content:
				'调试是开发过程中必不可少的技能。本文将介绍各种调试技巧和工具，包括浏览器调试、Node.js 调试、性能分析等。\n\n我们将探讨如何使用调试工具定位问题，如何使用断点、日志、性能分析工具等。通过实际案例，展示如何高效地调试代码。',
			categoryName: '工具与技巧',
			subCategoryName: '调试技巧',
			tags: ['调试', '工具', '技巧'],
		},
		// 技术分享
		{
			title: '项目开发经验分享',
			content:
				'在实际项目开发中，我们积累了很多宝贵的经验。本文将分享一些项目开发中的经验教训，包括项目管理、团队协作、技术选型等方面。\n\n我们将探讨如何管理项目进度，如何与团队协作，如何选择合适的技术栈，以及如何应对项目中的各种挑战。',
			categoryName: '技术分享',
			subCategoryName: '项目经验',
			tags: ['项目', '经验', '分享'],
		},
		{
			title: '技术学习心得总结',
			content:
				'技术学习是一个持续的过程。本文将分享一些技术学习的心得体会，包括学习方法、学习资源、实践建议等。\n\n我们将探讨如何高效地学习新技术，如何选择学习资源，如何通过实践巩固知识，以及如何建立自己的技术知识体系。',
			categoryName: '技术分享',
			subCategoryName: '技术心得',
			tags: ['学习', '心得', '技术'],
		},
	];

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

	// 插入文章数据
	const articlesToInsert = [];

	articleConfigs.forEach((config, index) => {
		// 查找对应的分类ID
		const categoryId = categoryNameMap[config.categoryName];
		if (!categoryId) {
			print(`警告：未找到分类 "${config.categoryName}"，跳过文章 "${config.title}"`);
			return;
		}

		// 查找对应的子分类ID
		let subCategoryIds = [];
		if (config.subCategoryName) {
			subCategoryIds = subCategoryNameMap[config.subCategoryName] || [];
			if (subCategoryIds.length === 0) {
				print(
					`警告：未找到子分类 "${config.subCategoryName}"，文章 "${config.title}" 将不设置子分类`
				);
			}
		}

		// 随机选择一个作者
		const randomAuthor = adminUsers[Math.floor(Math.random() * adminUsers.length)];

		const time = getRandomTime();
		const title = config.title + (index > 0 ? ` ${index}` : ''); // 添加序号避免标题重复

		articlesToInsert.push({
			cover: getRandomCover(),
			title: title,
			content: config.content,
			author: randomAuthor._id,
			category: [categoryId],
			subCategory: subCategoryIds.length > 0 ? [subCategoryIds[0]] : [], // 如果有子分类，取第一个
			tags: config.tags || [],
			views: Math.floor(Math.random() * 1000), // 0-999的随机浏览量
			isPublished: Math.random() > 0.3, // 70%概率已发布
			createdAt: time,
			updatedAt: time,
		});
	});

	if (articlesToInsert.length === 0) {
		print('没有可插入的文章数据');
		quit(0);
	}

	try {
		const result = db.articles.insertMany(articlesToInsert);
		print(`成功插入 ${result.insertedIds.length} 篇文章数据`);
		print('插入的文章：');
		Object.values(result.insertedIds).forEach((id, index) => {
			const article = articlesToInsert[index];
			const category = categories.find((c) => String(c._id) === String(article.category[0]));
			print(
				`  ${index + 1}. ${article.title} (分类: ${category ? category.name : '未知'}, ID: ${id})`
			);
		});
	} catch (error) {
		print('插入文章时发生错误：');
		print(error.message);
		if (error.code === 11000) {
			print('提示：可能是文章标题重复，请检查或修改脚本中的标题生成逻辑');
		}
	}
})();
