import service from './index.js'
//密码登录
export function Register (data) {
  return service.request({
    method: "post",
    url: "/register/",
    // data: createObj(data).fd
    data: data
  });
}
export function Login (data) {
  return service.request({
    method: "post",
    url: "/login/",
    // data: createObj(data).fd
    data: data
  });
}
export function Logout (data) {
  return service.request({
    method: "post",
    url: "/logout/",
    // data: createObj(data).fd
    data: data
  });
}
export function getUser (data) {
  return service.request({
    method: "post",
    url: "/userinfo/",
    // data: createObj(data).fd
    data: data
  });
}
export function editUser (data) {
  return service.request({
    method: "post",
    url: "/edituser/",
    // data: createObj(data).fd
    data: data
  });
}
export function editPassword (data) {
  return service.request({
    method: "post",
    url: "/org/editpassword",
    // data: createObj(data).fd
    data: data
  });
}
export function getUserByToken (data) {
  return service.request({
    method: "post",
    url: "/org/signin",
    // data: createObj(data).fd
    data: data
  });
}
export function refreshByToken (data) {
  return service.request({
    method: "post",
    url: "refreshtoken/",
    // data: createObj(data).fd
    data: data
  });
}
export function Chat(data){
  return service.request({
    method: "post",
    url: "chat/",
    // data: createObj(data).fd
    data: data
  });
}