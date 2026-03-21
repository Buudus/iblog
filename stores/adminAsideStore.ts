import type { SideNavItem, SideNavList, TabList } from '~/types';

export const useAdminAsideStore = defineStore('adminAside', () => {
	const router = useRouter();
	const screenStore = useScreenStore();

	// 侧边栏导航列表
	const sideNavList = reactive<SideNavList>([
		{
			name: 'AdminHomePage',
			path: '/admin',
			meta: {
				title: '首页',
				icon: 'bi-house-fill',
			},
		},
		{
			name: 'SiteManagement',
			path: '/admin/siteManagement',
			meta: {
				title: '站点管理',
				icon: 'bi-geo-alt-fill',
			},
			children: [
				{
					name: 'SiteInfo',
					path: '/admin/siteManagement/siteInfo',
					meta: {
						title: '站点信息',
						icon: 'bi-grid-fill',
					},
				},
				{
					name: 'AuthorInfo',
					path: '/admin/siteManagement/authorInfo',
					meta: {
						title: '作者信息',
						icon: 'bi-grid-fill',
					},
				},
			],
		},
		{
			name: 'ArticleManagement',
			path: '/admin/articleManagement',
			meta: {
				title: '文章管理',
				icon: 'bi-send-fill',
			},
			children: [
				{
					name: 'PublishArticle',
					path: '/admin/articleManagement/publishArticle',
					meta: {
						title: '发布文章',
						icon: 'bi-grid-fill',
					},
				},
				{
					name: 'AllArticle',
					path: '/admin/articleManagement/allArticle',
					meta: {
						title: '所有文章',
						icon: 'bi-grid-fill',
					},
				},
			],
		},
		{
			name: 'CategoryManagement',
			path: '/admin/categoryManagement',
			meta: {
				title: '分类管理',
				icon: 'bi-stack',
			},
		},
		{
			name: 'TagManagement',
			path: '/admin/tagManagement',
			meta: {
				title: '标签管理',
				icon: 'bi-tags-fill',
			},
		},
		{
			name: 'LeaveMessageManagement',
			path: '/admin/leaveMessageManagement',
			meta: {
				title: '留言管理',
				icon: 'bi-chat-text-fill',
			},
		},
		{
			name: 'FriendlyLinkManagement',
			path: '/admin/friendlyLinkManagement',
			meta: {
				title: '友链管理',
				icon: 'bi-snow2',
			},
		},
		{
			name: 'adminUser',
			path: '/admin/adminUser',
			meta: {
				title: '后台用户',
				icon: 'bi-people-fill',
			},
		},
		{
			name: 'AlbumManagement',
			path: '/admin/albumManagement',
			meta: {
				title: '相册管理',
				icon: 'bi bi-card-image',
			},
		},
		{
			name: 'FileMenagement',
			path: '/admin/fileMenagement',
			meta: {
				title: '文件管理',
				icon: 'bi-folder-fill',
			},
			children: [
				{
					name: 'UploadFile',
					path: '/admin/fileMenagement/uploadFile',
					meta: {
						title: '上传文件',
						icon: 'bi-grid-fill',
					},
				},
				{
					name: 'AllFile',
					path: '/admin/fileMenagement/allFile',
					meta: {
						title: '所有文件',
						icon: 'bi-grid-fill',
					},
				},
				{
					name: 'ImageFile',
					path: '/admin/fileMenagement/imageFile',
					meta: {
						title: '图片文件',
						icon: 'bi-grid-fill',
					},
				},
			],
		},
		{
			name: 'AccessLog',
			path: '/admin/accessLog',
			meta: {
				title: '访问日志',
				icon: 'bi-x-diamond-fill',
			},
		},
		{
			name: 'DataView',
			path: '/admin/dataView',
			meta: {
				title: '数据预览',
				icon: 'bi-bar-chart-fill',
			},
		},
		{
			name: 'SystemSettings',
			path: '/admin/systemSettings',
			meta: {
				title: '系统设置',
				icon: 'bi-gear-fill',
			},
		},
	]);

	// 跳转（带参数的跳转不要使用）
	const goTo = (item: SideNavItem): void => {
		if (router.currentRoute.value.name === item.name) return;

		// 添加标签页
		const index: number = tabList.value.findIndex((tab) => tab.path === item.path);
		if (index === -1) {
			tabList.value.push({
				path: item.path,
				title: item.meta.title,
				closable: true,
			});
		}

		router.push({ path: item.path });
	};

	// 标签页列表
	const tabList = ref<TabList>([
		{
			path: '/admin',
			title: '首页',
			closable: false,
		},
	]);

	watch(
		tabList,
		(val) => {
			// 持久化存储TabList
			localStorageSet('tabList', JSON.stringify(val));
		},
		{ deep: true }
	);

	// 关闭标签页
	const closeTab = (path: string): void => {
		const index: number = tabList.value.findIndex((item) => item.path === path);

		tabList.value.splice(index, 1);

		// 判断是否删除的是当前标签页
		const currentRoute = router.currentRoute.value.path;
		console.log('currentRoute: ', currentRoute);

		if (currentRoute === path) {
			if (tabList.value[index]) {
				// 删除当前标签页，跳转到后一个标签页
				router.replace({ path: tabList.value[index].path });
			} else {
				// 删除当前标签页，跳转到前一个标签页
				router.replace({ path: tabList.value[index - 1].path });
			}
		}
	};

	// 关闭所有标签页
	const closeAllTab = (): void => {
		tabList.value.splice(1);
		router.push({ path: '/admin' });
	};

	// 侧边导航栏是否折叠
	const asideCollapse = ref<boolean>(false);

	watch(
		() => screenStore.screenWidth,
		(val: number) => {
			if (val <= 1200) {
				asideCollapse.value = true;
			} else {
				asideCollapse.value = false;
			}
		},
		{ immediate: true }
	);

	// 侧边栏容器宽度
	const asideWidth = computed<string>(() => {
		if (screenStore.screenMode === 'mobile') {
			return '0';
		}

		if (asideCollapse.value) {
			return '63px';
		}

		return '220px';
	});

	onMounted(() => {
		// 获取 TabList
		const tabListStr = localStorageGet('tabList');
		if (tabListStr) {
			tabList.value = JSON.parse(tabListStr);
		}
	});

	return {
		tabList,
		asideWidth,
		sideNavList,
		asideCollapse,
		goTo,
		closeTab,
		closeAllTab,
	};
});
