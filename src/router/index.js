import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
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
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})