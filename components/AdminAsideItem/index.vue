<template>
	<!-- 多级菜单 -->
	<el-sub-menu v-if="hasChildNode(sideNavItem) && !itemIsHidden" :index="sideNavItem.path">
		<template #title>
			<i class="bi mr-3 text-[16px]" :class="sideNavItem.meta.icon" />
			<span>{{ sideNavItem.meta.title }}</span>
		</template>
		<template v-for="child in sideNavItem.children" :key="child.path">
			<el-menu-item
				v-if="!child.meta.hidden"
				class="sub-menu-item"
				:index="child.path"
				@click="adminAsideStore.goTo(child)">
				<i class="bi mr-3 text-[16px] text-gray-500" :class="child.meta.icon" />
				<span>{{ child.meta.title }}</span>
			</el-menu-item>
		</template>
	</el-sub-menu>

	<!-- 单级菜单 -->
	<el-tooltip
		v-if="!hasChildNode(sideNavItem) && !itemIsHidden && isCollapse"
		class="box-item"
		effect="dark"
		:content="sideNavItem.meta.title"
		placement="right"
		:enterable="false">
		<el-menu-item :index="sideNavItem.path" @click="adminAsideStore.goTo(sideNavItem)">
			<i class="bi mr-3 text-[16px]" :class="sideNavItem.meta.icon" />
			<span>{{ sideNavItem.meta.title }}</span>
		</el-menu-item>
	</el-tooltip>

	<el-menu-item
		v-if="!hasChildNode(sideNavItem) && !itemIsHidden && !isCollapse"
		:index="sideNavItem.path"
		@click="adminAsideStore.goTo(sideNavItem)">
		<i class="bi mr-3 text-[16px]" :class="sideNavItem.meta.icon" />
		<span>{{ sideNavItem.meta.title }}</span>
	</el-menu-item>
</template>

<script lang="ts">
import type { SideNavItem } from '~/types';

export default defineComponent({
	name: 'AdminAsideItem',
	props: {
		item: {
			type: Object as () => SideNavItem,
			required: true,
		},
		isCollapse: {
			type: Boolean,
			required: true,
		},
	},
	emits: [],
	setup(props) {
		// 侧边栏导航项
		const sideNavItem = computed<SideNavItem>(() => {
			return props.item;
		});

		// 是否隐藏
		const itemIsHidden = computed<boolean>(() => {
			if (sideNavItem.value.meta && sideNavItem.value.meta.hidden) {
				return true;
			}
			return false;
		});

		// 是否有子项
		const hasChildNode = (item: SideNavItem): boolean => {
			if (item.children && item.children.length > 0) {
				return true;
			}
			return false;
		};

		const adminAsideStore = useAdminAsideStore();

		return {
			sideNavItem,
			adminAsideStore,
			itemIsHidden,
			hasChildNode,
		};
	},
});
</script>

<style lang="scss" scoped>
.sub-menu-item {
	background-color: var(--admin-sub-menu-item-bg);
	color: var(--admin-muted-text-color);

	&:hover {
		background-color: var(--admin-surface-hover);
	}
}

.el-menu-item {
	color: var(--admin-muted-text-color);
}

.tooltip-base-box {
	width: 600px;
}

.tooltip-base-box .row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.tooltip-base-box .center {
	justify-content: center;
}

.tooltip-base-box .box-item {
	width: 110px;
	margin-top: 10px;
}

// 重置 el-menu-item 高亮效果
.el-menu-item.is-active {
	font-weight: bold;
	background-color: rgba(14, 165, 233, 0.12);
	border-right: 4px solid var(--admin-accent-color, #0ea5e9);
	color: var(--admin-accent-color, #0ea5e9);
}

.el-menu-item.is-active i {
	color: var(--admin-accent-color, #0ea5e9);
}

:deep() {
	.el-sub-menu__title {
		color: var(--admin-muted-text-color);
	}
}
</style>
