<!-- 卡片 -->
<template>
	<div
		class="ly-card w-full bg-white dark:bg-[#000F1A] rounded-md shadow duration-300 hover:shadow-lg dark:shadow-gray-800">
		<slot></slot>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	name: 'LyCard',
});
</script>
