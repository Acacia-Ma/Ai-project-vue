var e=Object.defineProperty,a=Object.defineProperties,s=Object.getOwnPropertyDescriptors,t=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,n=(a,s,t)=>s in a?e(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t;import{f as i,g as u,c as d,d as r,E as c,a as p,b as m,h as v,i as f,j as h,k as g,l as y,m as b,n as _,o as j,e as w}from"./element-plus.e5f0d4bb.js";import{u as x}from"./vue-router.09929b59.js";import{_ as k,a as V}from"./ImageRecognition.ee6ac69a.js";import C from"./MachineTranslation.25cdbbcb.js";import{K as I,L as z,a0 as T,_ as U,S as A,V as O,u as $,a5 as P,Q as M,ap as D,aq as E,r as H,Z as L,w as S,E as B,T as R,aj as K,W as F,$ as G}from"./@vue.55e6b646.js";import{n as q,k as Q,p as W,o as Z,u as J,r as N}from"./@element-plus.dcee83e5.js";import{e as X,g as Y,C as ee,a as ae}from"./user.939895fe.js";import{u as se}from"./index.f2dd9c25.js";import{c as te,g as le,a as oe,b as ne,u as ie,d as ue}from"./model.c745ba67.js";import{M as de}from"./markdown-it.29274fbc.js";import{H as re}from"./highlight.js.ff8cbd7e.js";import{C as ce}from"./clipboard.a8d34c49.js";import"./lodash-es.89fe8fc8.js";import"./async-validator.95860052.js";import"./@vueuse.09b9dda7.js";import"./@ctrl.a4ffe31d.js";import"./@popperjs.1b99db09.js";import"./axios.a42fa0ce.js";import"./pinia.11340e00.js";import"./mdurl.4bab0ff8.js";import"./uc.micro.70bc50df.js";import"./entities.1a9e585c.js";import"./linkify-it.87dfce62.js";import"./punycode.js.7ed677d4.js";const pe={class:"name"},me={class:"count-time"},ve={class:"count"},fe={class:"time"},he=(e=>(D("data-v-00d6f506"),e=e(),E(),e))((()=>T("div",{class:"mask"},null,-1))),ge={class:"btn-wrapper"},ye={__name:"SessionItem",props:{active:Boolean,session:Object},emits:["delete","select","edit"],setup(e,{emit:a}){const s=e,t=a,l=()=>{t("delete",s.session)},o=()=>{t("select",s.session)},n=()=>{t("edit",s.session)};return(a,t)=>{const d=u,r=i;return I(),z("div",{class:M(["session-item",{active:s.active}]),onClick:o},[T("div",pe,U(e.session.title),1),T("div",me,[T("div",ve,U(e.session.messages?e.session.messages.length:0)+"条对话",1),T("div",fe,U(e.session.updatedAt),1)]),he,T("div",ge,[A(d,{size:15,class:"edit",onClick:P(n,["stop"])},{default:O((()=>[A($(q))])),_:1}),A(d,{size:15,class:"close"},{default:O((()=>[A(r,{title:"是否确认永久删除该聊天会话？",onConfirm:l},{reference:O((()=>[A($(Q))])),_:1})])),_:1})])],2)}},__scopeId:"data-v-00d6f506"};const be={class:"message-input"},_e={class:"input-wrapper"},je={class:"button-wrapper"},we={__name:"MessageInput",emits:["send"],setup(e,{emit:a}){const s=H(""),t=a,l=e=>{13===e.keyCode&&e.shiftKey?(e.preventDefault(),s.value+="\n"):13===e.keyCode&&(e.preventDefault(),o())},o=()=>{s.value.trim()&&(t("send",s.value),s.value="")};return(e,a)=>{const t=d,n=u,i=r;return I(),z("div",be,[T("div",_e,[A(t,{modelValue:s.value,"onUpdate:modelValue":a[0]||(a[0]=e=>s.value=e),autosize:!1,rows:3,class:"input",resize:"none",type:"textarea",onKeydown:l},null,8,["modelValue"]),T("div",je,[A(i,{type:"primary",onClick:o},{default:O((()=>[A(n,{class:"el-icon--left"},{default:O((()=>[A($(W))])),_:1}),L(" 发送 ")])),_:1})])])])}},__scopeId:"data-v-09ed115a"};const xe={class:"profile-view"},ke={slot:"footer",class:"dialog-footer"},Ve={__name:"UserInfoForm",props:{title:{type:Boolean,default:!1}},emits:["close"],setup(e,{emit:a}){const s=e,t=H({username:"",password_old:"",password:"",realname:""}),l=H(!1),o=a;const n=()=>{X(t.value).then((e=>{m.success("提交成功")})).catch((e=>{m.error("提交失败")})),l.value=!1,t.value.password_old="",t.value.password=""},i=()=>{l.value=!1,t.value.password_old="",t.value.password="",o("close",l.value)};return S((()=>s.title),(e=>{l.value=e,e&&Y({}).then((e=>{t.value.username=e.data.username,t.value.realname=e.data.realname}))})),(e,a)=>{const s=d,o=c,u=p,m=r,f=v;return I(),z("div",xe,[A(f,{title:"个人信息",modelValue:l.value,"onUpdate:modelValue":a[4]||(a[4]=e=>l.value=e),width:"30%",onClose:i},{default:O((()=>[A(u,{model:t.value},{default:O((()=>[A(o,{label:"用户名"},{default:O((()=>[A(s,{modelValue:t.value.username,"onUpdate:modelValue":a[0]||(a[0]=e=>t.value.username=e),disabled:""},null,8,["modelValue"])])),_:1}),A(o,{label:"原密码"},{default:O((()=>[A(s,{modelValue:t.value.password_old,"onUpdate:modelValue":a[1]||(a[1]=e=>t.value.password_old=e),type:"password"},null,8,["modelValue"])])),_:1}),A(o,{label:"新密码"},{default:O((()=>[A(s,{modelValue:t.value.password,"onUpdate:modelValue":a[2]||(a[2]=e=>t.value.password=e),type:"password"},null,8,["modelValue"])])),_:1}),A(o,{label:"真实姓名"},{default:O((()=>[A(s,{modelValue:t.value.realname,"onUpdate:modelValue":a[3]||(a[3]=e=>t.value.realname=e)},null,8,["modelValue"])])),_:1})])),_:1},8,["model"]),T("span",ke,[A(m,{onClick:i},{default:O((()=>[L("取消")])),_:1}),A(m,{type:"primary",onClick:n},{default:O((()=>[L("保存修改")])),_:1})])])),_:1},8,["modelValue"])])}},__scopeId:"data-v-2fd99961"};const Ce=e=>(D("data-v-03576866"),e=e(),E(),e),Ie={class:"home-view"},ze={class:"top-menu"},Te={key:0,class:"chat-panel"},Ue={class:"left-panel"},Ae={class:"session-panel"},Oe={class:"title"},$e=Ce((()=>T("div",{class:"description"},"构建你的AI助手",-1))),Pe={class:"session-list"},Me={key:0},De={key:1},Ee={class:"user-actions"},He={class:"message-panel"},Le={class:"header"},Se={class:"front"},Be={class:"title"},Re=Ce((()=>T("div",{class:"description"},"与ChatGPT的对话",-1))),Ke={class:"model-selector"},Fe={class:"message-list",id:"chat-box"},Ge=["innerHTML"],qe={key:1,class:"image-recognition-panel"},Qe={key:2,class:"machine-translation-panel"},We={slot:"footer",class:"dialog-footer"},Ze={__name:"HomeView",setup(e){const i=new de({html:!0,linkify:!0,typographer:!0,highlight:function(e,a){const s=parseInt(Date.now())+Math.floor(1e7*Math.random());let t=`<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${s}">复制</button>`;const l=e.split(/\n/).length-1;let o='<span aria-hidden="true" class="line-numbers-rows">';for(let i=0;i<l;i++)o+="<span></span>";if(o+="</span>",a&&re.getLanguage(a))try{return t+=re.highlight(a,e,!0).value,l&&(t+='<b class="name">'+a+"</b>"),`<pre class="hljs"><code>${t}</code>${o}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${s}">${e.replace(/<\/textarea>/g,"&lt;/textarea>")}</textarea>`}catch(n){}return t+=i.utils.escapeHtml(e),`<pre class="hljs"><code>${t}</code>${o}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${s}">${e.replace(/<\/textarea>/g,"&lt;/textarea>")}</textarea>`}});B((()=>{(()=>{const e=new ce(".copy-btn");e.on("success",(()=>{m({type:"success",message:"复制成功"})})),e.on("error",(()=>{m({type:"error",message:"复制失败"})}))})()}));const u=document.createElement("style");u.innerHTML="\n  .hljs {\n    margin: 0;\n    padding: 0;\n    font-size: 16px;\n    background-color: #f0f4c3;\n  }\n  p {\n    margin: 0;\n    padding: 0;\n  }\n",document.head.appendChild(u);const c=e=>{switch(e){case"1":me.value="chat";break;case"2":me.value="imageRecognition";break;case"3":me.value="machineTranslation"}},p=H([{value:"v1.5",label:"星火大模型v1.5"},{value:"v3.0",label:"星火大模型v3.0"}]),P=H(""),D=H(!1),E=H(!1),S=x(),q=H([]),Q=H([]),W=H(!1),X=H(null),Y=H(""),pe=se(),me=H("chat");function ve(){const e={chat_id:Date.now().toString(),username:pe.username,title:"新会话"};return new Promise(((i,u)=>{te(e).then((u=>{var d,r;q.value.push((d=((e,a)=>{for(var s in a||(a={}))l.call(a,s)&&n(e,s,a[s]);if(t)for(var s of t(a))o.call(a,s)&&n(e,s,a[s]);return e})({},e),r={id:e.chat_id,messages:[],updatedAt:u.data.updatedAt},a(d,s(r)))),p.value&&p.value.length>0&&(P.value=p.value[0].value),i()})).catch((e=>{}))}))}B((async()=>{le().then((e=>{e&&e.data&&Array.isArray(e.data)&&(q.value=e.data.map((e=>({id:e.chat_id,title:e.title,messages:[],updatedAt:e.updated_at}))),e.data.length>0&&(Q.value=q.value[0],ge()))}))}));const fe=e=>{X.value=e.id,Y.value=e.title,W.value=!0};function he(){const e=q.value.find((e=>e.id===X.value));e&&ie(e.id,{title:Y.value}).then((()=>{e.title=Y.value})).catch((e=>{})),W.value=!1}function ge(){return new Promise(((e,a)=>{oe(Q.value.id).then((a=>{a&&a.data&&Array.isArray(a.data)&&(Q.value.messages=a.data.map((e=>({id:e.chat_id,text:e.text,type:e.type}))),document.getElementById("chat-box").scrollTop=document.getElementById("chat-box").scrollHeight),e()}))}))}const be=e=>{Q.value=e,ge()};function _e(e){ue(e.id).then((()=>{q.value=q.value.filter((a=>a.id!==e.id)),Q.value.id===e.id&&(Q.value=q.value[0]||{})})).catch((e=>{}))}const je=async e=>{Q.value&&Q.value.messages?xe(e):ve().then((()=>{Q.value=q.value[0],ge().then((()=>{xe(e)}))}))},xe=async e=>{let a={id:Q.value.id,text:e,type:"user"};Q.value.messages.push(a),ne(q.id,a),D.value=!0;try{const a=(await ee({text:e,model:P.value})).data.response;let s={id:Q.value.id,text:a,type:"chatgpt"};Q.value.messages.push(s),ne(q.id,s),D.value=!1}catch(s){D.value=!1}},ke=({value:e})=>{E.value=e},Ce=()=>{w.confirm("确定要退出登录吗？","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((()=>{ae().then((()=>{pe.Logout(),S.push({path:"/"}),m({type:"success",message:"退出成功"})}))})).catch((()=>{m({type:"info",message:"取消退出"})}))},Ze=H("https://bu.dusays.com/2023/10/21/6533d9c12532c.jpg"),Je=e=>{const a=new FileReader;return a.onload=e=>{Ze.value="https://bu.dusays.com/2023/11/01/6541b7bd4afab.jpg"},a.readAsDataURL(e),!1};return(e,a)=>{var s,t;const l=f,o=h,n=r,u=g,m=y,w=b,x=_,H=j,S=d,B=v;return I(),z(R,null,[T("div",Ie,[T("div",ze,[A(o,{"default-active":"1",mode:"horizontal",class:"el-menu-horizontal",onSelect:c},{default:O((()=>[A(l,{index:"1"},{default:O((()=>[L("对话")])),_:1}),A(l,{index:"2"},{default:O((()=>[L("图片识别")])),_:1}),A(l,{index:"3"},{default:O((()=>[L("机器翻译")])),_:1})])),_:1})]),"chat"===me.value?(I(),z("div",Te,[T("div",Ue,[T("div",Ae,[T("div",Oe,[L("ChatGPT助手 "),A(n,{icon:$(Z),onClick:a[0]||(a[0]=e=>ve())},{default:O((()=>[L("添加会话")])),_:1},8,["icon"])]),$e,A(u,{class:"session-list-scrollbar"},{default:O((()=>[T("div",Pe,[0==q.value.length?(I(),z("div",Me,"暂无数据")):(I(),z("div",De,[(I(!0),z(R,null,K(q.value,(e=>(I(),F(ye,{key:e.id,session:e,active:e.id===Q.value.id,onSelect:be,onDelete:_e,onEdit:fe},null,8,["session","active"])))),128))]))])])),_:1})]),T("div",Ee,[A(w,{class:"avatar-uploader","show-file-list":!1,"before-upload":Je},{default:O((()=>[A(m,{src:Ze.value,size:"large",class:"avatar"},null,8,["src"])])),_:1}),A(n,{type:"success",icon:$(J),size:"large",onClick:a[1]||(a[1]=e=>E.value=!0),round:""},{default:O((()=>[L("个人信息")])),_:1},8,["icon"]),A(Ve,{title:E.value,onClose:ke},null,8,["title"]),A(n,{type:"danger",icon:$(N),size:"large",onClick:Ce,round:""},{default:O((()=>[L("退出")])),_:1},8,["icon"])])]),T("div",He,[T("div",Le,[T("div",Se,[T("div",Be,U((null==(s=Q.value)?void 0:s.title)||"请选择会话"),1),Re]),T("div",Ke,[A(H,{modelValue:P.value,"onUpdate:modelValue":a[2]||(a[2]=e=>P.value=e),placeholder:"请选择一个模型"},{default:O((()=>[(I(!0),z(R,null,K(p.value,(e=>(I(),F(x,{key:e.value,label:e.label,value:e.value},null,8,["label","value"])))),128))])),_:1},8,["modelValue"])])]),T("div",Fe,[(I(!0),z(R,null,K((null==(t=Q.value)?void 0:t.messages)||[],(e=>{return I(),z("div",{key:e.id,class:M(["message","user"===e.type?"user-message":"chatgpt-message"])},["user"===e.type?(I(),F(m,{key:0,src:"https://bu.dusays.com/2023/10/21/6533d9c12532c.jpg",class:"message-avatar_user"})):(I(),F(m,{key:1,src:"https://bu.dusays.com/2023/12/30/65902956dc879.jpg",class:"message-avatar_chat"})),T("div",{innerHTML:(a=e.text,i.render(a)),class:"message-content"},null,8,Ge)],2);var a})),128)),D.value?(I(),F(k,{key:0})):G("",!0)]),A(we,{onSend:je})])])):G("",!0),"imageRecognition"===me.value?(I(),z("div",qe,[A(V)])):G("",!0),"machineTranslation"===me.value?(I(),z("div",Qe,[A(C)])):G("",!0)]),A(B,{title:"编辑会话名称",modelValue:W.value,"onUpdate:modelValue":a[5]||(a[5]=e=>W.value=e),width:"500px"},{default:O((()=>[A(S,{modelValue:Y.value,"onUpdate:modelValue":a[3]||(a[3]=e=>Y.value=e),placeholder:"请输入新的会话名称"},null,8,["modelValue"]),T("span",We,[A(n,{onClick:a[4]||(a[4]=e=>W.value=!1)},{default:O((()=>[L("取消")])),_:1}),A(n,{type:"primary",onClick:he},{default:O((()=>[L("保存")])),_:1})])])),_:1},8,["modelValue"])],64)}},__scopeId:"data-v-03576866"};export{Ze as default};
