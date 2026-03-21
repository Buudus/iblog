<template>
	<div
		class="block p-4 bg-white dark:bg-[#000F1A] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
		<a :href="url" target="_blank" rel="noopener noreferrer" class="no-underline">
			<div class="flex items-center space-x-4">
				<div class="flex-shrink-0">
					<img
						:src="icon"
						:alt="name"
						class="w-12 h-12 rounded-full object-cover bg-gray-100 dark:bg-gray-700" />
				</div>
				<div class="flex-1 min-w-0">
					<h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
						{{ name }}
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400 truncate m-0">
						{{ description }}
					</p>
				</div>
			</div>
		</a>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	name: 'FriendlyLinkCard',
	props: {
		url: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
	},
});
</script>

<style lang="scss" scoped>
.block {
	position: relative;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		background: linear-gradient(to right, rgba(135, 206, 250, 0.3), rgba(135, 206, 250, 0));
		z-index: 0;
		transition: all 0.5s ease;
		opacity: 0;
	}

	&:hover::before {
		width: 100%;
		opacity: 1;
	}

	a {
		position: relative;
		z-index: 1;
	}
}
</style>
