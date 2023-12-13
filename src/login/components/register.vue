<template>
    <div class="form" id="a-form">
      <h2 class="form_title title">创建账号</h2>
      <div style="height:50px;"></div>
      <input v-model="username" type="text" class="form__input" placeholder="账号">
      <input v-model="name" type="text" class="form__input" placeholder="姓名">
      <input v-model="password" type="password" class="form__input" placeholder="密码">
      <div style="height:50px;"></div>
      <button @click="Register" class="form__button button">注册</button>
    </div>
  </template>
  
  <script setup>
    import {ref,reactive} from 'vue'
    const username = ref('')
    const name = ref('')
    const password = ref('')
    function Register(){
        //注册账号、姓名和密码均不能为空
        if (username.value.trim() === '' || password.value.trim() === '' || name.value.trim() === '') {
          alert('注册账号、姓名和密码均不能为空');
          return;
        }
        //姓名不能为数字
        if (!isNaN(name.value.trim())) {
          alert('姓名不能为数字');
          return;
        }
        //密码长度不能小于6位
        if (password.value.trim().length < 6) {
          alert('密码长度不能小于6位');
          return;
        }
        alert('注册成功');
    }
  </script>
  
  <style >
  /* 你的样式代码 */
  </style>
  