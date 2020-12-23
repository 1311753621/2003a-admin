import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
import '@/assets/common.css'
import http from  './utils/request'
import { gets,posts } from './utils/api'
Vue.prototype.$http = http
Vue.prototype.$get = gets
Vue.prototype.$post = posts
//引入图标
// import './assets/font/elm-icon.css'
//vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
// 引入Echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
//element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')

// 全局时间过滤器
Vue.filter("timefn",function(originval){
  const dt = new Date(originval)
  const yy = dt.getFullYear()
  const mm = (dt.getMonth() +1+'' ).padStart(2,0)
  const dd = (dt.getDate() +'' ).padStart(2,0)
  const hh = (dt.getHours() +'' ).padStart(2,0)
  const ff = (dt.getMinutes() +'' ).padStart(2,0)
  const ss = (dt.getSeconds() +'' ).padStart(2,0)
  return `${yy}-${mm}-${dd} ${hh}:${ff}:${ss}`
})
