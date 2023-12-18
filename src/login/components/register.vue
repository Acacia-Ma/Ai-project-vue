<template>
  <div class="form" id="a-form">
    <h2 class="form_title title">创建账号</h2>
    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-position="top">
      <el-form-item prop="username" label="账号">
        <el-input v-model="registerForm.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="registerForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="SubRegisterClick" round size="large">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Register } from '../../api/user' // 确保正确导入Register函数
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'

const registerFormRef = ref(null)
const registerForm = reactive({
  username: '',
  name: '',
  password: ''
})
const registerRules = reactive({
  username: [
    { required: true, message: '注册账号不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
})

function SubRegisterClick() {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      Register(registerForm).then(() => {
        alert('注册成功');
        // 可以在这里添加其他逻辑，比如跳转到登录页面或主页
      }).catch(err => {
        console.error(err);
        alert('注册失败');
      })
    } else {
      console.log('表单验证失败');
      return false;
    }
  })
}
</script>

<style>
#a-form{
  .el-button--large.is-round{
    padding:12px 100px;
    margin:auto;
  }
}
</style>
