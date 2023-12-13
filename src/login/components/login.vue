<template>
    <div class="form" id="b-form">
      <h2 class="form_title title">登录网站</h2>
      <div style="height:50px;"></div>
      <input v-model="loginUsername" type="text" class="form__input" placeholder="账号">
      <input v-model="loginPassword" type="password" class="form__input" placeholder="密码">
      <div style="height:50px;"></div>
      <button @click="login" class="form__button button">登录</button>
    </div>
  </template>
  
  <script setup>
    import {ref,reactive} from 'vue'
    const loginUsername = ref('') 
    const loginPassword = ref('')
    function login(){
        //登录账号和密码均不能为空
        if (loginUsername.value.trim() === '' || loginPassword.value.trim() === '') {
          alert('登录账号和密码均不能为空');
          return;
        }
        //登录账号和密码均为admin和123456
        if (loginUsername.value.trim() === 'admin' && loginPassword.value.trim() === '123456') {
          alert('登录成功');
          return;
        }
        alert('登录失败');
    }
  </script>
  
  <style >
  /* 你的样式代码 */
  </style>
  