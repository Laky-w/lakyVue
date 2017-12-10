import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        { path: '*', component: resolve => require(['../components/common/Wait.vue'], resolve) },
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
            path: '/laky',
            name: "帮助",
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    name: "主页",
                    path: '/',
                    component: resolve => require(['../components/page/demo/BaseCharts.vue'], resolve)
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
            ]
        },
        {
            name: "系统",
            path: "/system",
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    name: "校区设置",
                    path: "/system/schoolZone",
                    component: resolve => require(['../components/page/system/index.vue'], resolve),
                    children: [{
                            path: '/schoolZone',
                            name: "校区部门",
                            component: resolve => require(['../components/page/system/SchoolZone.vue'], resolve)
                        },
                        {
                            path: '/user',
                            name: "教职员工",
                            component: resolve => require(['../components/page/system/User.vue'], resolve)
                        },
                        {
                            path: '/userRole',
                            name: "员工职能",
                            component: resolve => require(['../components/page/system/UserRole.vue'], resolve)
                        },
                        {
                            path: '/authority1',
                            name: "添加职能",
                            component: resolve => require(['../components/page/system/Authority.vue'], resolve)
                        },
                        {
                            path: '/notice',
                            name: "通知公告",
                            component: resolve => require(['../components/page/system/Notice.vue'], resolve)
                        }
                    ]
                },
                {
                    name: "公共设置",
                    path: "/system/publicData",
                    component: resolve => require(['../components/page/system/index.vue'], resolve),
                    children: [{
                            path: '/loginLog',
                            name: "登录日志",
                            component: resolve => require(['../components/page/system/LoginLog.vue'], resolve)
                        },
                        {
                            path: '/operateLog',
                            name: "操作日志",
                            component: resolve => require(['../components/page/system/OperateLog.vue'], resolve)
                        },
                        {
                            path: '/publicData',
                            name: "公共参数",
                            component: resolve => require(['../components/page/system/PublicData.vue'], resolve)
                        },
                    ]
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ],
    // mode: 'history',
})