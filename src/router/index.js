import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [{
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/userMng',
                    component: resolve => require(['../components/page/userMng.vue'], resolve),
                    meta: {
                        title: '用户管理'
                    }
                },
                {
                    path: '/productMng',
                    component: resolve => require(['../components/page/productMng.vue'], resolve),
                    meta: {
                        title: '增益产品管理'
                    }
                },
                {
                    path: '/withdrawMng',
                    component: resolve => require(['../components/page/withdrawMng.vue'], resolve),
                    meta: {
                        title: '提现管理'
                    }
                },
                {
                    path: '/gainMng',
                    component: resolve => require(['../components/page/gainMng.vue'], resolve),
                    meta: {
                        title: '增益管理'
                    }
                },
                {
                    path: '/changeMng',
                    component: resolve => require(['../components/page/changeMng.vue'], resolve),
                    meta: {
                        title: '兑换管理'
                    }
                },
                {
                    path: '/trader',
                    component: resolve => require(['../components/page/trader.vue'], resolve),
                    meta: {
                        title: '收款信息'
                    }
                },
                {
                    path: '/buyOrder',
                    component: resolve => require(['../components/page/buyOrder.vue'], resolve),
                    meta: {
                        title: '上车订单'
                    }
                },
                {
                    path: '/mineMng',
                    component: resolve => require(['../components/page/mineMng.vue'], resolve),
                    meta: {
                        title: '矿力管理'
                    }
                },
                {
                    path: '/messageMng',
                    component: resolve => require(['../components/page/messageMng.vue'], resolve),
                    meta: {
                        title: '消息管理'
                    }
                },
                {
                    path: '/coinTypeMng',
                    component: resolve => require(['../components/page/coinTypeMng.vue'], resolve),
                    meta: {
                        title: '币种管理'
                    }
                },
                //帮助中心子菜单 begin
                {
                    path: '/helpType',
                    component: resolve => require(['../components/page/help/helpType.vue'], resolve),
                    meta: {
                        title: '分类管理'
                    }
                },
                {
                    path: '/helpList',
                    component: resolve => require(['../components/page/help/helpList.vue'], resolve),
                    meta: {
                        title: '列表展示'
                    }
                },
                //帮助中心子菜单 end
                //配置管理 begin
                {
                    path: '/community',
                    component: resolve => require(['../components/page/configMng/community.vue'], resolve),
                    meta: {
                        title: '社群信息'
                    }
                },
                {
                    path: '/version',
                    component: resolve => require(['../components/page/configMng/version.vue'], resolve),
                    meta: {
                        title: '版本更新'
                    }
                },
                //配置管理 end
                // 权限管理 begin
                {
                    path: '/account',
                    component: resolve => require(['../components/page/role/account.vue'], resolve),
                    meta: {
                        title: '用户列表'
                    }
                },
                {
                    path: '/group',
                    component: resolve => require(['../components/page/role/group.vue'], resolve),
                    meta: {
                        title: '分组管理'
                    }
                },
                // 权限管理 end
                {
                    path: '/opLog',
                    component: resolve => require(['../components/page/opLog.vue'], resolve),
                    meta: {
                        title: '操作日志'
                    }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: resolve => require(['../components/page/I18n.vue'], resolve),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})