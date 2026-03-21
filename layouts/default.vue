<template>
	<div class="ly-layout w-full h-full">
		<header class="w-full">
			<slot name="header"></slot>
		</header>
		<main class="w-full mx-auto">
			<slot name="main"></slot>
		</main>
		<footer class="w-full max-w-[1200px] mx-auto mt-3 pb-3 px-1">
			<slot name="footer">
				<LyCopyRight />
			</slot>
		</footer>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	name: 'LyLayout',
});
</script>
