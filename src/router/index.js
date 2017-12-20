import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        { path: '*', redirect: '/wait' },
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
                    path: '/customerDialog',
                    component: resolve => require(['../components/common/supply/CustomerDialog.vue'], resolve)
                },
            ]
        },
        {
            name: "招生",
            path: "/supply",
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    name: "意向学员",
                    path: "/supply/intention",
                    component: resolve => require(['../components/page/teach/index.vue'], resolve),
                    children: [{
                            path: '/customer',
                            name: "生源管理",
                            component: resolve => require(['../components/page/supply/Customer.vue'], resolve)
                        },
                        {
                            path: '/contact',
                            name: "跟进记录",
                            component: resolve => require(['../components/page/supply/Contact.vue'], resolve)
                        },
                        {
                            path: '/invite',
                            name: "邀约试听",
                            component: resolve => require(['../components/page/supply/Invite.vue'], resolve)
                        },

                    ]
                },
                {
                    name: "基础设置",
                    path: "/supply/supplyData",
                    component: resolve => require(['../components/page/supply/index.vue'], resolve),
                    children: [{
                            path: '/marketActivity',
                            name: "市场活动",
                            component: resolve => require(['../components/page/supply/MarketActivity.vue'], resolve)
                        },
                        {
                            path: '/supplyData',
                            name: "参数设置",
                            component: resolve => require(['../components/page/supply/SupplyData.vue'], resolve)
                        },
                    ]
                },
                {
                    name: "报表统计",
                    path: "/supply/statementData",
                    component: resolve => require(['../components/page/supply/index.vue'], resolve)
                }
            ]
        },
        {
            name: "教务",
            path: "/teach",
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    name: "班级课程",
                    path: "/teach/course",
                    component: resolve => require(['../components/page/teach/index.vue'], resolve),
                    children: [{
                            path: '/course',
                            name: "课程管理",
                            component: resolve => require(['../components/page/teach/Course.vue'], resolve)
                        },
                        {
                            path: '/class',
                            name: "班级管理",
                            component: resolve => require(['../components/page/teach/Class.vue'], resolve)
                        },
                        {
                            path: '/schedule',
                            name: "排课管理",
                            component: resolve => require(['../components/page/teach/Schedule.vue'], resolve)
                        },
                        {
                            path: '/attendance',
                            name: "考勤管理",
                            component: resolve => require(['../components/page/teach/Attendance.vue'], resolve)

                        },
                    ]
                },
                {
                    name: "基础设置",
                    path: "/teach/teachData",
                    component: resolve => require(['../components/page/teach/index.vue'], resolve),
                    children: [{
                            path: '/teachData',
                            name: "基础参数",
                            component: resolve => require(['../components/page/teach/TeachData.vue'], resolve)
                        },
                        {
                            path: '/room',
                            name: "教室",
                            component: resolve => require(['../components/page/teach/Room.vue'], resolve)
                        }
                    ]
                }
            ]
        },
        {
            name: "财务",
            path: "/finance",
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                name: "基础设置",
                path: "/teach/financeData",
                component: resolve => require(['../components/page/teach/index.vue'], resolve),
                children: [{
                        path: '/financeData',
                        name: "基础参数",
                        component: resolve => require(['../components/page/teach/TeachData.vue'], resolve)
                    },
                    {
                        path: '/financeAccount',
                        name: "财务账户",
                        component: resolve => require(['../components/page/finance/financeAccount.vue'], resolve)
                    }
                ]
            }]
        },
        {
            name: "后勤",
            path: "/logistics",
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                name: "后勤管理",
                path: "/logistics/goods",
                component: resolve => require(['../components/page/logistics/index.vue'], resolve),
                children: [{
                    path: '/goods',
                    name: "物品管理",
                    component: resolve => require(['../components/page/logistics/Goods.vue'], resolve)
                },
                    // {
                    //     path: '/contact',
                    //     name: "物品库存",
                    //     component: resolve => require(['../components/page/logistics/wait.vue'], resolve)
                    // },
                    // {
                    //     path: '/invite',
                    //     name: "出入库管理",
                    //     component: resolve => require(['../components/page/logistics/wait.vue'], resolve)
                    // },

                ]
            },
                {
                    name: "基础参数",
                    path: "/logistics/logisticsData",
                    component: resolve => require(['../components/page/logistics/index.vue'], resolve),
                    children: [
                    //     {
                    //     path: '/marketActivity',
                    //     name: "市场活动",
                    //     component: resolve => require(['../components/page/supply/MarketActivity.vue'], resolve)
                    // },
                        {
                            path: '/logisticsData',
                            name: "参数设置",
                            component: resolve => require(['../components/page/logistics/LogisticsData.vue'], resolve)
                        },
                    ]
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
