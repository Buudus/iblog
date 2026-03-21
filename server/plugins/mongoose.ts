import mongoose from 'mongoose';

// MongoDB 数据库连接插件
export default defineNitroPlugin(async () => {
	try {
		await mongoose.connect('mongodb://localhost:27017/lyblog');
		console.log('MongoDB 数据库连接成功 ✔');
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		console.error('❌ MongoDB 数据库连接失败:', errorMessage);
	}
});
