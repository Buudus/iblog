<!-- 客户端顶部导航组件 -->
<template>
	<div
		class="client-top-nav w-full h-16 shadow-md dark:shadow-gray-700 fixed top-0 z-30 duration-300"
		:class="[navTopClass, navBgClass]">
		<div class="nav-container w-full h-full flex justify-between items-center">
			<NuxtLink to="/">
				<!-- Logo -->
				<div class="logo px-5 flex items-center" title="蓝云博客">
					<img class="mr-1" :src="siteInfoStore.siteInfo.logo" alt="logo" width="16" height="16" />
					<h1 class="text-sm font-bold text-blue-500">{{ siteInfoStore.siteInfo.title }}</h1>
				</div>
			</NuxtLink>
			<!-- 导航 -->
			<div class="nav">
				<ul class="flex items-center justify-center">
					<NuxtLink class="mx-3" :to="nav.path" v-for="nav in navList" :key="nav.path">
						<li class="nav-item flex items-center font-bold text-sm">
							<i class="bi mr-[2px]" :class="nav.icon"></i>
							<span>{{ nav.name }}</span>
						</li>
					</NuxtLink>
				</ul>
			</div>
			<!-- 其他 -->
			<div class="other px-5 w-fit h-fit flex items-center">
				<!-- 主题切换 -->
				<div
					class="theme cursor-pointer text-sm duration-300 mr-0 text-shadow-md text-shadow-gray-300"
					@click="themeStore.toggleTheme"
					title="主题切换">
					<i
						class="bi bi-moon-fill text-yellow-500"
						v-show="themeStore.currentTheme === 'light'"></i>
					<i class="bi bi-sun-fill text-yellow-500" v-show="themeStore.currentTheme === 'dark'"></i>
				</div>
				<!-- 移动端导航 -->
				<div
					@click="drawerVisible = true"
					class="mobile-nav text-white text-2xl cursor-pointer font-bold hidden"
					title="打开导航栏">
					<i class="bi bi-list"></i>
					<el-drawer
						size="48%"
						append-to-body
						:with-header="false"
						v-model="drawerVisible"
						body-class="el-drawer-body">
						<div class="author flex flex-col items-center my-3 pt-3">
							<div class="avatar w-16 h-16 rounded-full overflow-hidden">
								<img class="w-full h-full" :src="authorInfoStore.authorInfo.avatar" alt="avatar" />
							</div>
							<div class="nickname mt-3">
								<p class="text-xl font-bold text-blue-500 dark:text-gray-400">LanYun</p>
							</div>
							<el-divider />
						</div>
						<ul class="flex flex-col mt-5 items-center justify-center">
							<NuxtLink
								class="mx-3"
								:key="nav.path"
								v-for="nav in navList"
								@click.prevent="goToPage(nav.path)">
								<li
									class="flex cursor-pointer items-center font-bold my-3 text-gray-700 dark:text-gray-400 hover:text-blue-500 duration-300">
									<i class="bi mr-5" :class="nav.icon"></i>
									<span>{{ nav.name }}</span>
								</li>
							</NuxtLink>
						</ul>
					</el-drawer>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export type ClientNavList = {
	icon: string;
	name: string;
	path: string;
}[];

export default defineComponent({
	name: 'ClientTopNav',
	setup() {
		const siteInfoStore = useSiteInfoStore();
		const authorInfoStore = useAuthorInfoStore();

		const navList: ClientNavList = [
			{ icon: 'bi-house-fill', name: '首页', path: '/' },
			{ icon: 'bi-tags-fill', name: '分类', path: '/category' },
			{ icon: 'bi-lightning-fill', name: '友链', path: '/friendlyLink' },
			{ icon: 'bi-image-fill', name: '相册', path: '/album' },
			{ icon: 'bi-chat-dots-fill', name: '留言', path: '/leaveMessage' },
			{ icon: 'bi-info-circle-fill', name: '关于', path: '/about' },
		];

		// 是否显示导航栏
		const showNav = ref<boolean>(true);
		// 当前滚动高度
		const scrollHeight = ref<number>(0);
		watch(scrollHeight, (newVal, oldVal): void => {
			if (newVal > oldVal) {
				showNav.value = false;
			} else {
				showNav.value = true;
			}
		});

		// 导航栏位置
		const navTopClass = computed<string>(() => {
			return showNav.value ? 'top-0' : 'top-[-64px]';
		});

		// 滚动高度为 0 时，改变导航栏背景色
		const navBgClass = computed<string>(() => {
			return scrollHeight.value === 0 ? 'nav-top' : 'nav-not-top';
		});

		// 监听滚动事件
		const onPageScroll = (): void => {
			scrollHeight.value = document.documentElement.scrollTop || document.body.scrollTop;
		};

		// 主题切换
		const themeStore = useThemeStore();

		// 移动端导航栏
		const drawerVisible = ref<boolean>(false);
		watch(drawerVisible, (val: boolean) => {
			if (val) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		});

		// 监听窗口大小变化
		const onResize = (): void => {
			if (drawerVisible.value) {
				if (window.innerWidth <= 768) {
					drawerVisible.value = true;
				} else {
					drawerVisible.value = false;
				}
			}
		};

		// 移动端导航栏页面跳转
		const router = useRouter();
		const goToPage = (path: string): void => {
			router.push(path);
			drawerVisible.value = false;
		};

		// 监听滚动事件
		onMounted(() => {
			window.addEventListener('scroll', onPageScroll);
			window.addEventListener('resize', onResize);
		});

		onBeforeUnmount(() => {
			window.removeEventListener('scroll', onPageScroll);
			window.removeEventListener('resize', onResize);
		});

		return {
			navList,
			navBgClass,
			themeStore,
			navTopClass,
			drawerVisible,
			siteInfoStore,
			authorInfoStore,
			goToPage,
		};
	},
});
</script>

<style lang="scss" scoped>
.nav-item {
	position: relative;

	&::after {
		width: 0;
		content: '';
		height: 3px;
		bottom: -3px;
		display: block;
		position: absolute;
		background-color: #fff;
		transition: width 0.3s ease-in-out;
	}

	&:hover {
		color: #2b7fff;

		&::after {
			width: 100%;
		}
	}
}

.nav-top {
	box-shadow: none;
	background-color: transparent;

	.logo {
		h1 {
			color: #fff;
		}
	}

	.nav-item {
		color: #fff;
	}
}

.nav-not-top {
	backdrop-filter: blur(10px);
	background-color: rgba(255, 255, 255, 0.8);

	.nav-item {
		color: #2b7fff;

		&::after {
			background-color: #2b7fff;
		}
	}

	.mobile-nav {
		color: #2b7fff;
	}
}

html.dark {
	.nav-not-top {
		background-color: rgba($color: #000f1a, $alpha: 0.5);

		.nav-item {
			color: #eee;

			&::after {
				background-color: #eee;
			}
		}

		.mobile-nav {
			color: #eee;
		}
	}
}

@media screen and (max-width: 768px) {
	.nav {
		display: none;
	}

	.mobile-nav {
		display: block !important;
	}

	.theme {
		margin-right: 15px !important;
	}
}
</style>
