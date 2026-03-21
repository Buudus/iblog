// MongoDB 脚本：插入 50 条测试留言数据
// 使用方法：在 MongoDB shell 中执行：load('scripts/insertLeaveMessages.js')
// 或者使用 mongosh：mongosh lyblog < scripts/insertLeaveMessages.js
/* eslint-disable no-undef */
// 切换到 lyblog 数据库
db = db.getSiblingDB('lyblog');

// 生成随机中文姓名
function getRandomName() {
	const surnames = [
		'张',
		'李',
		'王',
		'刘',
		'陈',
		'杨',
		'赵',
		'黄',
		'周',
		'吴',
		'徐',
		'孙',
		'胡',
		'朱',
		'高',
		'林',
		'何',
		'郭',
		'马',
		'罗',
	];
	const givenNames = [
		'伟',
		'芳',
		'娜',
		'秀英',
		'敏',
		'静',
		'丽',
		'强',
		'磊',
		'军',
		'洋',
		'勇',
		'艳',
		'杰',
		'娟',
		'涛',
		'明',
		'超',
		'秀兰',
		'霞',
		'平',
		'刚',
		'桂英',
	];
	const surname = surnames[Math.floor(Math.random() * surnames.length)];
	const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
	return surname + givenName;
}

// 生成随机 IP 地址
function getRandomIP() {
	return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(
		Math.random() * 255
	)}.${Math.floor(Math.random() * 255)}`;
}

// 生成随机 User-Agent
function getRandomUserAgent() {
	const userAgents = [
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
		'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
		'Mozilla/5.0 (Android 13; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0',
	];
	return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// 生成随机留言内容
function getRandomContent() {
	const contents = [
		'这个博客真的很不错，内容很丰富！',
		'希望能看到更多技术分享文章。',
		'网站设计很美观，用户体验很好。',
		'文章写得很好，学到了很多知识。',
		'期待博主更新更多优质内容。',
		'很喜欢这个博客的风格，会经常来逛逛。',
		'希望能和博主交流一下技术问题。',
		'内容质量很高，值得推荐给朋友。',
		'网站加载速度很快，体验很棒！',
		'博主的技术水平很高，文章很有深度。',
		'希望能看到更多实战经验分享。',
		'这个博客是我每天必看的网站之一。',
		'文章排版很清晰，阅读体验很好。',
		'希望能增加一些视频教程。',
		'博主分享的内容都很实用，感谢！',
		'网站功能很完善，使用起来很方便。',
		'希望能看到更多前端技术相关的内容。',
		'文章更新很及时，内容也很新鲜。',
		'这个博客帮助我解决了很多问题。',
		'希望能和博主成为朋友，一起学习进步。',
		'网站界面设计很现代化，很喜欢。',
		'文章内容很专业，受益匪浅。',
		'希望能看到更多后端开发相关的内容。',
		'博主的技术栈很全面，值得学习。',
		'网站性能优化做得很好，访问很流畅。',
		'希望能增加一些代码示例和演示。',
		'文章讲解很详细，适合初学者学习。',
		'这个博客是我学习编程的重要资源。',
		'希望能看到更多项目实战案例。',
		'博主分享的经验很宝贵，感谢分享！',
		'网站SEO做得不错，很容易找到。',
		'希望能增加一些在线工具和资源。',
		'文章质量很高，每篇都值得仔细阅读。',
		'这个博客帮助我提升了很多技能。',
		'希望能看到更多新技术的学习笔记。',
		'博主的技术分享很有价值，继续加油！',
		'网站响应式设计做得很好，移动端体验也不错。',
		'希望能增加一些技术交流的社区功能。',
		'文章更新频率很稳定，内容质量也很高。',
		'这个博客是我技术成长路上的好伙伴。',
		'希望能看到更多关于架构设计的内容。',
		'博主的技术文章写得很用心，点赞！',
		'网站访问速度很快，用户体验很好。',
		'希望能增加一些技术书籍推荐。',
		'文章内容很丰富，涵盖了多个技术领域。',
		'这个博客帮助我解决了很多实际工作中的问题。',
		'希望能看到更多关于性能优化的内容。',
		'博主的技术水平很高，文章很有参考价值。',
		'网站设计很简洁，但功能很强大。',
		'希望能增加一些技术面试相关的文章。',
	];
	return contents[Math.floor(Math.random() * contents.length)];
}

// 生成时间字符串（格式：YYYY年MM月DD日 HH:mm:ss）
function getRandomTime() {
	const now = new Date();
	const daysAgo = Math.floor(Math.random() * 90); // 过去90天内的随机时间
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

// 插入 50 条测试数据
const messages = [];
for (let i = 0; i < 50; i++) {
	const name = getRandomName();
	const time = getRandomTime();

	messages.push({
		concat: name, // 联系人（必填）
		content: getRandomContent(), // 留言内容（必填）
		ip: getRandomIP(), // IP 地址（必填）
		userAgent: getRandomUserAgent(), // User-Agent（可选）
		createdAt: time, // 创建时间
		updatedAt: time, // 更新时间
	});
}

// 批量插入
const result = db.leave_messages.insertMany(messages);

print(`成功插入 ${result.insertedIds.length} 条留言数据`);
print('插入的文档 ID:');
Object.values(result.insertedIds).forEach((id, index) => {
	print(`  ${index + 1}. ${id}`);
});
