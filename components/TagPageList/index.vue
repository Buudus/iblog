<template>
	<!-- 标签页列表 -->
	<div class="tag-page-list w-full flex flex-nowrap texno items-center">
		<li
			@click.stop="router.push(tag.path)"
			v-for="tag in tagList"
			:key="tag.path"
			class="tag-item mx-3 text-sm cursor-pointer relative text-nowrap"
			:class="isActive(tag.path)">
			<span class="duration-300">{{ tag.title }}</span>
			<div class="under-line absolute bottom-[-3px] w-0 h-1 rounded-2xl duration-300"></div>
			<!-- 关闭标签页 -->
			<div
				title="关闭标签页"
				class="close absolute w-5 h-full top-0 right-[-35%] hidden items-center justify-center"
				v-if="tag.closable">
				<el-icon color="gray" @click.stop="adminAsideStore.closeTab(tag.path)">
					<CloseBold />
				</el-icon>
			</div>
		</li>
	</div>
</template>

<script lang="ts">
import type { TabItem } from '~/types';

export default defineComponent({
	name: 'TagPageList',
	setup() {
		const route = useRoute();
		const router = useRouter();
		const adminAsideStore = useAdminAsideStore();

		const tagList = computed<TabItem[]>(() => {
			return adminAsideStore.tabList;
		});

		const isActive = (path: string): string => {
			return route.path === path ? 'active' : '';
		};

		return { router, tagList, adminAsideStore, isActive };
	},
});
</script>

<style lang="scss" scoped>
.tag-item {
	color: var(--admin-muted-text-color);
	&:hover {
		.close {
			display: flex;
		}
	}
}

.active {
	span {
		color: var(--admin-accent-color, #0ea5e9);
		font-weight: bold;
	}

	.under-line {
		width: 100%;
		background-color: var(--admin-accent-color, #0ea5e9);
	}
}

.under-line {
	background-color: var(--admin-muted-text-color);
}
</style>
