<template>
	<NuxtLayout v-if="!route.path.includes('admin')">
		<template #header>
			<!-- 客户端顶部导航 -->
			<ClientTopNav />
		</template>
		<template #main>
			<NuxtPage />
			<NuxtParticles id="tsparticles" url="/particle-options.json" @load="onLoad" />
			<LyBackTop />
		</template>
	</NuxtLayout>
	<NuxtPage v-if="route.path.includes('admin/login')" />
	<AdminLayout v-else-if="route.path.includes('admin')">
		<NuxtPage />
	</AdminLayout>
</template>

<script name="App" lang="ts" setup>
import 'element-plus/dist/index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AdminLayout from './layouts/AdminLayout.vue';
import 'element-plus/theme-chalk/dark/css-vars.css';
import type { Container } from '@tsparticles/engine';

const route = useRoute();
const siteInfoStore = useSiteInfoStore();
const authorInfoStore = useAuthorInfoStore();

// 获取作者信息
await authorInfoStore.fetchAuthorInfo();

// 设置站点信息
await siteInfoStore.fetchSiteInfo();

useHead({
	title: siteInfoStore.siteInfo.title,
	meta: [
		{ name: 'keywords', content: siteInfoStore.siteInfo.keywords },
		{ name: 'description', content: siteInfoStore.siteInfo.description },
	],
	link: [
		{ rel: 'icon', href: siteInfoStore.siteInfo.logo },
		{ rel: 'apple-touch-icon', href: siteInfoStore.siteInfo.logo },
	],
	script: [{ innerHTML: siteInfoStore.siteInfo.globalScript }],
	style: [{ innerHTML: siteInfoStore.siteInfo.globalStyle }],
	htmlAttrs: { lang: 'zh-CN' },
});

useSeoMeta({
	title: siteInfoStore.siteInfo.title,
	ogTitle: siteInfoStore.siteInfo.title,
	description: siteInfoStore.siteInfo.description,
	ogDescription: siteInfoStore.siteInfo.description,
});

// Nuxt Particles onLoad
const onLoad = (container: Container) => {
	container.play();
};

// 用户初始化
const userStore = useUserSotre();
onMounted(() => {
	userStore.userInit();
});
</script>
