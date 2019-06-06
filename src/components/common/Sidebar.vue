<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-user-solid',
                        index: 'userMng',
                        title: '用户管理'
                    },
                    {
                        icon: 'el-icon-s-shop',
                        index: 'productMng',
                        title: '增益产品管理'
                    },
                    {
                        icon: 'el-icon-s-ticket',
                        index: 'withdrawMng',
                        title: '提现管理'
                    },
                    {
                        icon: 'el-icon-s-order',
                        index: 'gainMng',
                        title: '增益管理'
                    },
                    //begin
                    {
                        icon: 'el-icon-s-help',
                        index: 'changeMng',
                        title: '兑换管理'
                    },
                    {
                        icon: 'el-icon-s-cooperation',
                        index: '5',
                        title: '上车管理',
                        subs: [
                            {
                                index: 'trader',
                                title: '承兑商管理',
                            },
                            {
                                index: 'buyOrder',
                                title: '上车订单',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-s-custom',
                        index: 'mineMng',
                        title: '矿力管理'
                    },
                    {
                        icon: 'el-icon-s-comment',
                        index: 'messageMng',
                        title: '消息管理'
                    },
                    {
                        icon: 'el-icon-coin',
                        index: 'coinTypeMng',
                        title: '币种管理'
                    },
                    {
                        icon: 'el-icon-question',
                        index: '4',
                        title: '帮助中心',
                        subs: [
                            {
                                index: 'helpType',
                                title: '分类管理',
                            },
                            {
                                index: 'helpList',
                                title: '列表展示',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '8',
                        title: '配置管理',
                        subs: [
                            {
                                index: 'community',
                                title: '社群信息',
                            },
                            {
                                index: 'version',
                                title: '版本更新',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lock',
                        index: 'roleMng',
                        title: '权限管理'
                    },
                    {
                        icon: 'el-icon-reading',
                        index: 'opLog',
                        title: '操作日志'
                    },
                    //end
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                index: 'form',
                                title: '基本表单'
                            },
                            {
                                index: '3-2',
                                title: '三级菜单',
                                subs: [
                                    {
                                        index: 'editor',
                                        title: '富文本编辑器'
                                    },
                                    {
                                        index: 'markdown',
                                        title: 'markdown编辑器'
                                    },
                                ]
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: 'tabs',
                        title: 'tab选项卡'
                    },
                    {
                        icon: 'el-icon-lx-emoji',
                        index: 'icon',
                        title: '自定义图标'
                    },
                    {
                        icon: 'el-icon-pie-chart',
                        index: 'charts',
                        title: 'schart图表'
                    },
                    {
                        icon: 'el-icon-rank',
                        index: '6',
                        title: '拖拽组件',
                        subs: [
                            {
                                index: 'drag',
                                title: '拖拽列表',
                            },
                            {
                                index: 'dialog',
                                title: '拖拽弹框',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-global',
                        index: 'i18n',
                        title: '国际化功能'
                    },
                    {
                        icon: 'el-icon-lx-warn',
                        index: '7',
                        title: '错误处理',
                        subs: [
                            {
                                index: 'permission',
                                title: '权限测试'
                            },
                            {
                                index: '404',
                                title: '404页面'
                            }
                        ]
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
