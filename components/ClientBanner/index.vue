<!-- 客户端首页横幅 -->
<template>
	<div
		class="client-banner w-full h-[100vh] duration-300 dark:brightness-85 flex flex-col justify-center items-center relative overflow-hidden"
		style="background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)">
		<!-- 动态背景粒子 -->
		<div class="particles absolute inset-0">
			<div class="particle" v-for="i in 50" :key="i"></div>
		</div>

		<!-- 主要内容 -->
		<div class="content relative z-10 text-center flex flex-col items-center">
			<!-- 头像 -->
			<div
				class="avatar w-24 h-24 overflow-hidden rounded-full border-4 border-white/80 hover:border-blue-400 shadow-2xl fade-in fade-in-delay0 hover:scale-110 transition-all duration-500">
				<img class="w-full h-full object-cover" :src="authorInfo.avatar" alt="avatar" />
			</div>

			<!-- 昵称 -->
			<div class="nickname mt-6 fade-in">
				<h1 class="text-4xl font-bold text-white text-shadow-lg mb-2">
					{{ authorInfo.name }}
				</h1>
				<div class="w-24 h-1 bg-white/60 mx-auto rounded-full"></div>
			</div>

			<!-- 个性签名 -->
			<div class="signature mt-6 fade-in fade-in-delay1">
				<p class="text-lg text-white/90 text-shadow-md font-light">
					{{ authorInfo.ps }}
				</p>
			</div>

			<!-- 站点信息 -->
			<div class="site-info mt-8 text-white fade-in fade-in-delay2">
				<div class="flex justify-center items-center space-x-8">
					<div class="stat-item text-center">
						<div class="font-bold text-2xl text-shadow-md">
							{{ statsDisplay.article }}
						</div>
						<div class="text-sm text-white/80 mt-1">文章</div>
					</div>
					<div class="stat-divider w-px h-8 bg-white/30"></div>
					<div class="stat-item text-center">
						<div class="font-bold text-2xl text-shadow-md">
							{{ statsDisplay.category }}
						</div>
						<div class="text-sm text-white/80 mt-1">分类</div>
					</div>
					<div class="stat-divider w-px h-8 bg-white/30"></div>
					<div class="stat-item text-center">
						<div class="font-bold text-2xl text-shadow-md">
							{{ statsDisplay.visit }}
						</div>
						<div class="text-sm text-white/80 mt-1">访问</div>
					</div>
				</div>
			</div>

			<!-- 社交链接 -->
			<div class="social-links mt-8 fade-in fade-in-delay3 text-white">
				<div class="flex justify-center space-x-4">
					<nuxt-link :to="authorInfo.github" class="social-link" title="Github" target="_blank">
						<i class="bi bi-github text-xl"></i>
					</nuxt-link>
					<nuxt-link :to="authorInfo.weibo" class="social-link" title="微博" target="_blank">
						<i class="bi bi-sina-weibo text-xl"></i>
					</nuxt-link>
					<nuxt-link
						to="#"
						class="social-link"
						title="微信"
						@click.prevent="copyToClipboard(authorInfo.wechat)">
						<i class="bi bi-wechat text-xl"></i>
					</nuxt-link>
					<nuxt-link
						to="#"
						class="social-link"
						title="邮箱"
						@click.prevent="copyToClipboard(authorInfo.email)">
						<i class="bi bi-envelope text-xl"></i>
					</nuxt-link>
				</div>
			</div>
		</div>

		<!-- 开始预览按钮 -->
		<div class="start w-full absolute bottom-8 left-0 flex justify-center z-10">
			<button
				class="scroll-btn group flex flex-col items-center text-white hover:text-blue-200 transition-colors duration-300">
				<i @click="startPreview" class="bi bi-caret-down-fill text-xl animate-bounce"></i>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	name: 'ClientBanner',
	setup() {
		// 作者信息
		const authorInfoStore = useAuthorInfoStore();
		const authorInfo = computed(() => authorInfoStore.authorInfo);

		// 站点统计
		const { formatted: statsDisplay, fetchStats } = useClientStats();
		onMounted(() => {
			void fetchStats();
		});
		onServerPrefetch(() => fetchStats());

		// 开始预览
		const startPreview = (): void => {
			// 获取视口高度
			const viewportHeight = window.innerHeight;
			// 滚动到内容区域
			window.scrollTo({
				top: viewportHeight,
				behavior: 'smooth',
			});
		};

		return { authorInfo, startPreview, statsDisplay };
	},
});
</script>

<style lang="scss" scoped>
@use 'sass:math';

.client-banner {
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url('/background.png') no-repeat center center/cover;
		opacity: 0.1;
		z-index: 1;
	}
}

.particles {
	.particle {
		position: absolute;
		width: 4px;
		height: 4px;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 50%;
		animation: float 6s infinite linear;

		@for $i from 1 through 50 {
			&:nth-child(#{$i}) {
				left: math.random() * 100%;
				top: math.random() * 100%;
				animation-delay: math.random() * 6000ms;
				animation-duration: (math.random() * 4000 + 2000) * 1ms;
			}
		}
	}
}

@keyframes float {
	0% {
		transform: translateY(0) rotate(0deg);
		opacity: 0;
	}
	10% {
		opacity: 1;
	}
	90% {
		opacity: 1;
	}
	100% {
		transform: translateY(-100vh) rotate(360deg);
		opacity: 0;
	}
}

.social-link {
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(4px);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	transition: all 0.3s ease;
}

.social-link:hover {
	background-color: rgba(255, 255, 255, 0.3);
	transform: scale(1.1);
}

.scroll-btn {
	cursor: pointer;
}

.fade-in {
	opacity: 0;
	transform: translateY(30px);
	animation: fadeInUp 0.8s forwards;
	animation-delay: 0.2s;
}

.fade-in-delay1 {
	animation-delay: 0.6s;
}

.fade-in-delay2 {
	animation-delay: 1s;
}

.fade-in-delay3 {
	animation-delay: 1.4s;
}

.fade-in-delay0 {
	animation-delay: 0s;
}

@keyframes fadeInUp {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.stat-item {
	transition: transform 0.3s ease;
}

.stat-item:hover {
	transform: scale(1.1);
}

.stat-divider {
	transition: all 0.3s ease;
}

.content:hover .stat-divider {
	background-color: rgba(255, 255, 255, 0.5);
}
</style>
