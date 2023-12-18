<template>
  <div class="form" id="b-form">
    <h2 class="form_title title">登录网站</h2>
    <div style="width:400px">
    <el-form ref="rulerFormer" :model="ruleForm" :rules="rules" label-position="top" >
      <el-form-item prop="username" label="账号">
        <el-input v-model="ruleForm.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="SubLoginClick" round size="large" >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
    
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Login } from '../../api/user' // 确保正确导入Login函数
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import {useTestStore} from '@/store/user' // 确保正确导入user

const rulerFormer = ref(null)
const user = useTestStore()
const ruleForm = reactive({
  username: '',
  password: '',
})
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

const router = useRouter()

function SubLoginClick() {
  rulerFormer.value.validate((valid) => {
    if (valid) {
      Login(ruleForm).then(data => {
        user.Savingtoken(data).then(() => {
          router.push({ path: '/home' })
        })
      }).catch(err => {
        console.error(err);
        alert('登录失败');
      })
    } else {
      console.log('表单验证失败');
    }
  })
}
</script>

<style lang="scss">
#b-form{
  .el-button--large.is-round{
    padding:12px 100px;
    margin:auto;
  }
  .title{

    // color:$bg;
  }
}
</style>
