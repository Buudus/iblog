import VueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	devServer: {
		port: 3000,
	},
	app: {
		head: {
			htmlAttrs: {
				lang: 'zh-CN',
			},
			title: '蓝云博客',
			meta: [
				{ charset: 'utf-8' },
				{
					name: 'keywords',
					content:
						'蓝云博客,个人博客,技术博客,生活美学,旅行,设计,读书,科技,互联网,数码,评测,前端,后端,全栈',
				},
				{
					name: 'description',
					content:
						'蓝云博客 —— 个人科技与生活美学分享空间。记录前沿技术见解、互联网观察、数码产品评测，分享设计灵感、旅行随感与阅读心得，以真实笔触打造兼具温度与思考的私人文字角落。',
				},
			],
		},
	},
	css: ['~/assets/style/tailwind.css', '~/assets/style/global.css'],
	modules: [
		'@nuxtjs/tailwindcss',
		'@element-plus/nuxt',
		'nuxt-particles',
		'nuxt-lodash',
		[
			'@pinia/nuxt',
			{
				autoImports: [
					// 自动引入 `defineStore()`
					'defineStore',
					// 自动引入 `defineStore()` 并重命名为 `definePiniaStore()`
					['defineStore', 'definePiniaStore'],
				],
			},
		],
		'nuxt-auth-utils',
	],
	vite: {
		plugins: [VueSetupExtend()],
	},
	runtimeConfig: {
		// nuxt-auth-utils 需要的会话密码（至少32个字符）
		session: {
			password: 'password-with-at-least-32-characters',
		},
		public: {
			// 公共配置（会暴露给客户端）
		},
	},
	// Nitro 配置
	nitro: {
		experimental: {
			openAPI: true,
		},
	},
});
