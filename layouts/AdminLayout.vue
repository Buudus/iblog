<template>
	<div
		class="common-layout admin-layout w-full h-full"
		:class="layoutClass"
		:style="layoutStyles">
		<el-container class="w-full h-full">
			<el-aside :style="{ width: asideWidth }">
				<el-scrollbar class="w-full">
					<!-- 侧边栏 -->
					<AdminAside :is-collapse="adminAsideStore.asideCollapse" />
				</el-scrollbar>
			</el-aside>
			<el-container>
				<el-header>
					<AdminHeader />
				</el-header>
				<el-main>
					<slot />
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	name: 'AdminLayout',
	setup() {
		const adminAsideStore = useAdminAsideStore();
		const { preferences } = useAdminPreferences();

		const asideWidth = computed<string>(() => {
			return adminAsideStore.asideWidth || '0px';
		});

		const layoutClass = computed(() => ({
			'admin-layout--fixed-header': preferences.value.fixedHeader,
		}));

		const layoutStyles = computed(() => ({
			'--admin-accent-color': preferences.value.accentColor,
		}));

		return {
			asideWidth,
			adminAsideStore,
			layoutClass,
			layoutStyles,
		};
	},
});
</script>

<style lang="scss" scoped>
.admin-layout {
	transition: background-color 0.3s ease, color 0.3s ease;
	background-color: var(--admin-bg-color);
	color: var(--admin-text-color);

	&.admin-layout--fixed-header .el-header {
		position: sticky;
		top: 0;
		z-index: 20;
	}

	.el-aside,
	.el-header {
		box-shadow: 0 0 8px 0 rgba(15, 23, 42, 0.08), 0 2px 4px 0 rgba(15, 23, 42, 0.05);
	}

	:deep(.el-button--primary:not(.is-link)) {
		background-color: var(--admin-accent-color, #0ea5e9);
		border-color: var(--admin-accent-color, #0ea5e9);
		color: #fff;
		transition: filter 0.2s ease, transform 0.2s ease;

		&:hover,
		&:focus {
			filter: brightness(1.08);
		}

		&:active {
			transform: translateY(1px);
		}
	}
}

.el-aside {
	transition: width 0.5s;
	border-right: 2px solid var(--admin-border-color);
	background-color: var(--admin-card-bg);
	color: var(--admin-text-color);
}

.el-header {
	padding: 0;
	height: fit-content;
	background: var(--admin-card-bg);
	border-bottom: 2px solid var(--admin-border-color);
	color: var(--admin-text-color);
}

.el-main {
	overflow-y: scroll;
	background-color: var(--admin-bg-color);
	color: var(--admin-text-color);

	&::-webkit-scrollbar {
		width: 5px;
	}

	&::-webkit-scrollbar-thumb {
		border-radius: 5px;
		background-color: var(--admin-scrollbar-color, #0ea5e9);
	}
}

:deep(.el-scrollbar__view) {
	height: 100%;
}
</style>
