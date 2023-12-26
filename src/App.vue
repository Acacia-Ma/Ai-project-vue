<script setup>
const data=ref('')
</script>

<template>
	<router-view></router-view>
</template>
<style lang="scss">
body{
	padding:0;
	margin:0;
}
// @forward 'element-plus/theme-chalk/src/common/var.scss' with ($colors: ('primary': ('base': #4B70E2,
//     ),
//   ),
// );

// // 如果只是按需导入，则可以忽略以下内容。
// // 如果你想导入所有样式:
// @use "element-plus/theme-chalk/src/index.scss" as *;
</style>

