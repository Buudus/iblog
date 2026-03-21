<template>
	<div class="admin-aside-com w-full h-full bg-white">
		<el-menu :collapse="isCollapse" :default-active="route.path" class="el-menu-vertical-demo">
			<AdminAsideItem
				v-for="item in adminAsideStore.sideNavList"
				:key="item.path"
				:is-collapse="adminAsideStore.asideCollapse"
				:item="item" />
		</el-menu>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	name: 'AdminAside',
	props: {
		isCollapse: {
			type: Boolean,
			default: false,
			required: false,
		},
	},
	setup() {
		const route = useRoute();
		const adminAsideStore = useAdminAsideStore();

		return {
			route,
			adminAsideStore,
		};
	},
});
</script>

<style lang="scss" scoped>
.admin-aside-com {
	background-color: var(--admin-card-bg);
	color: var(--admin-text-color);
}

.el-menu {
	border: none !important;
	background-color: transparent;
	color: var(--admin-muted-text-color);

	&:deep(.el-menu-item) {
		color: var(--admin-muted-text-color);
	}

	&:deep(.el-menu-item:hover) {
		background-color: var(--admin-surface-hover);
		color: var(--admin-accent-color, #0ea5e9);
	}
}
</style>
