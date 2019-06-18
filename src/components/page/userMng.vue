<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="昵称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="getsearch">搜索</el-button>
            </div>
            <el-table :data="userList" border class="table" ref="multipleTable">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="account" label="账号" align="center">
                </el-table-column>
                <el-table-column prop="userName" label="昵称" align="center">
                </el-table-column>
                <el-table-column prop="recommendCode" label="邀请码" align="center">
                </el-table-column>
                <el-table-column prop="lastLoginTime" label="最后登录时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.lastLoginTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="账户状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusText }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="button" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="button" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="CurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="修改用户状态" :visible.sync="editVisible" width="30%">
            <el-radio v-model="userStatus" label="1">正常</el-radio>
            <el-radio v-model="userStatus" label="0">冻结</el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">确认删除吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import service from '../../api/axios.js'
    export default {
        name: 'basetable',
        //过滤器
        filters: {
            //状态标签颜色
            statusFilter(value){
                if(value == 1){
                    return ""
                }
                if(value == 0){
                    return "warning"
                }
            },
            //状态文字显示
            statusText(val){
                if(val == 1){
                    return "正常"
                }
                if(val == 0){
                    return "冻结"
                }
            }
        },
        data() {
            return {
                userList: [],
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                uid:'',
                account:'',
                userStatus:'',
                finalStatus:1,

                select_word: '',
                editVisible: false,
                delVisible: false,
                form: {}
            }
        },
        created() {
            this.getList();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getList();
            },
            // 获取列表
            getList() {
                service({
                    url:'/user/getUserList',
                    method:'post',
                    data: {
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.userList = res.data.lists;
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            getDelete(){
                service({
                    url:'/user/deleteUser',
                    method:'post',
                    data: {
                        uid: this.uid,
                        account: this.account
                    }
                })
                .then(res=> {
                    console.log(res);
                })
            },
            // 分页导航
            CurrentChange:function(currentPage){
                this.currentPage = currentPage;
                this.getList();
            },
            getsearch(){
                if(this.select_word){
                    this.search();
                }else{
                    this.getList();
                }
            },
            search() {
                service({
                    url:'/user/queryUser',
                    method:'post',
                    data: {
                        userName: this.select_word,
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.userList = res.data.lists;
                })
            },
            handleEdit(index, row) {
                this.editVisible = true;
                if(row.status == 1){
                    this.userStatus = '1';
                }else{
                    this.userStatus = '0';
                }
                this.uid = row.uid;
            },
            handleDelete(index, row) {
                this.delVisible = true;
                this.uid = row.uid;
                this.account = row.account;
            },
            // 保存编辑
            saveEdit() {
                if(this.userStatus == '1'){
                    this.finalStatus = 1;
                }else{
                    this.finalStatus = 0;
                }
                service({
                    url:'/user/changeUserStatus',
                    method:'post',
                    data: {
                        uid: this.uid,
                        status: this.finalStatus
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.editVisible = false;
                        this.$message.success('修改成功');
                        this.getList();
                    }
                })
            },
            // 确定删除
            deleteRow(){
                this.delVisible = false;
                this.$message.success('删除成功');
                this.getDelete();
                this.getList();
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
