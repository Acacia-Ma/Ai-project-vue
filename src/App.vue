<script setup>
const data=ref('')
</script>

<template>
  <!-- <el-button>dddd</el-button>
  <el-form>
    <el-form-item>
      <el-input v-model="data"></el-input>
    </el-form-item>
  </el-form> -->
	<router-view></router-view>
</template>
<style lang="scss">
// $bg:red;
// @forward 'element-plus/theme-chalk/src/common/var.scss' with ($colors: ('primary': ('base': #4B70E2,
//     ),
//   ),
// );

// // 如果只是按需导入，则可以忽略以下内容。
// // 如果你想导入所有样式:
// @use "element-plus/theme-chalk/src/index.scss" as *;
</style>

