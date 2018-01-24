import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
let routesList = [{
  path: '/',
  redirect: '/login'
},
{ path: '*', redirect: '/wait' },
{
  path: '/laky',
  component: resolve => require(['../components/common/Home.vue'], resolve),
  redirect: "/main",
  children: [{
    name: "主页",
    path: '/main',
    component: resolve => require(['../components/common/Log.vue'], resolve)
  },
  {
    path: '/reload',
    component: resolve => require(['../components/common/Reload.vue'], resolve)
  },
  {
    path: '/wait',
    name: "建设中",
    component: resolve => require(['../components/common/Wait.vue'], resolve)
  },
  {
    path: '/authority1',
    name: "添加职能",
    component: resolve => require(['../components/page/system/Authority.vue'], resolve)
  },
  ]
},
{
  path: '/demo',
  component: resolve => require(['../components/page/demo/common/Home.vue'], resolve),
  children: [{
    path: '/',
    component: resolve => require(['../components/page/demo/Readme.vue'], resolve)
  },
  {
    path: '/basetable',
    component: resolve => require(['../components/page/demo/BaseTable.vue'], resolve)
  },
  {
    path: '/checkSchoolTree',
    component: resolve => require(['../components/page/demo/SchoolTree.vue'], resolve)
  },
  {
    path: '/tree',
    component: resolve => require(['../components/page/demo/common/SchoolTree.vue'], resolve)
  },
  {
    path: '/authority',
    component: resolve => require(['../components/page/demo/Authority.vue'], resolve)
  },
  {
    path: '/vuetable',
    component: resolve => require(['../components/page/demo/VueTable.vue'], resolve) // vue-datasource组件
  },
  {
    path: '/baseform',
    component: resolve => require(['../components/page/demo/BaseForm.vue'], resolve)
  },
  {
    path: '/vueeditor',
    component: resolve => require(['../components/page/demo/VueEditor.vue'], resolve) // Vue-Quill-Editor组件
  },
  {
    path: '/markdown',
    component: resolve => require(['../components/page/demo/Markdown.vue'], resolve) // Vue-Quill-Editor组件
  },
  {
    path: '/upload',
    component: resolve => require(['../components/page/demo/Upload.vue'], resolve) // Vue-Core-Image-Upload组件
  },
  {
    path: '/basecharts',
    component: resolve => require(['../components/page/demo/BaseCharts.vue'], resolve) // vue-schart组件
  },
  {
    path: '/drag',
    component: resolve => require(['../components/page/demo/DragList.vue'], resolve) // 拖拽列表组件
  }
  ]
},
{
  path: '/login1',
  component: resolve => require(['../components/page/Login.vue'], resolve)
},
{
  path: '/login',
  component: resolve => require(['../components/page/Login2.vue'], resolve)
},
{
  path: '/login2',
  component: resolve => require(['../components/page/Login1.vue'], resolve)
}
]
let $router = new Router({
  routes: routesList
})
let currentRout = "";
function getRoutesSub(params) {
  let newRoutes = [];
  for (let i = 0; i < params.length; i++) {
    let objR = { name: params[i].title, path: "/" + params[i].index };
    if (params[i]["path"]) {
      let path = params[i]["path"];
      objR["component"] = (resolve) => {
        //拼出相对路径，由于component无法识别变量
        //利用Webpack 的 Code-Splitting 功能
        require(['../components/' + path + '.vue'], resolve)
      }
    } else {
      objR["redirect"] = "/wait";
    }
    if (params[i].subs) {
      objR["children"] = getRoutesSub(params[i].subs);
    }
    newRoutes.push(objR);
  }
  return newRoutes;
}
let routerFalg = false;
export const getRoutesList = params => {
  if (routerFalg) return; //初始化后不再重新初始化
  let newRoutes = []
  routerFalg = true;
  if (params) {
    newRoutes = getRoutesSub(params);
  }
  // console.log($router.currentRoute);
  // $router.
  $router.addRoutes(newRoutes);
  if ($router.currentRoute["redirectedFrom"]) {
    $router.push($router.currentRoute["redirectedFrom"]);
  }
}
export default $router;