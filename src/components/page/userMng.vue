<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="账号 / 昵称 / 邀请码" class="handle-input mr10"></el-input>
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
                <el-table-column label="操作" align="center" width="300">
                    <template slot-scope="scope">
                        <el-button type="button" icon="el-icon-view" @click="handleSee(scope.$index, scope.row)">查看</el-button>
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
        <!-- 查看用户详情 -->
        <el-dialog title="用户详情" :visible.sync="seeDialog">
            <div class="form-box">
                <el-form ref="seeform" :model="seeform" label-width="100px">
                    <el-form-item label="账号：">
                        <span>{{seeform.account}}</span>
                    </el-form-item>
                    <el-form-item label="用户名：">
                        <span>{{seeform.userName}}</span>
                    </el-form-item>
                    <el-form-item label="国家：">
                        <span>{{seeform.country}}</span>
                    </el-form-item>
                    <el-form-item label="邀请码：">
                        <span>{{seeform.recommendCode}}</span>
                    </el-form-item>
                    <el-form-item label="状态：">
                        <el-tag :type="seeform.status | statusFilter">{{ seeform.status | statusText }}</el-tag>
                    </el-form-item>
                    <el-form-item label="真实姓名：">
                        <span v-if="isIdcard">{{seeform.name}}</span>
                        <span v-else>暂无</span>
                    </el-form-item>
                    <el-form-item label="身份证号：">
                        <span v-if="isIdcard">{{seeform.idNo}}</span>
                        <span v-else>暂无</span>
                    </el-form-item>
                    <!-- <el-form-item label="头像：">
                        <el-image :src="iconImg" :fit="fit"></el-image>
                    </el-form-item> -->
                    <el-form-item label="身份证正面：">
                        <el-image v-if="isIdcard" :src="seeform.frontImg" :fit="fit"></el-image>
                        <span v-else>暂无</span>
                    </el-form-item>
                    <el-form-item label="身份证背面：">
                        <el-image v-if="isIdcard" :src="seeform.backImg" :fit="fit"></el-image>
                        <span v-else>暂无</span>
                    </el-form-item>
                    <el-form-item label="手持身份证：">
                        <el-image v-if="isIdcard" :src="seeform.handImg" :fit="fit"></el-image>
                        <span v-else>暂无</span>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
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
                <el-button type="primary" @click="getDelete">确 定</el-button>
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
                seeDialog: false,
                seeform: {
                    account: '',
                    userName: '',
                    country: '',
                    recommendCode: '',
                    status: '',
                    name: '',
                    idNo: '',
                    frontImg: '',
                    backImg: '',
                    handImg: ''
                },
                fit: 'scale-down',
                isIdcard: true
            }
        },
        created() {
            this.getList();
        },
        methods: {
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
                    if(res.data){
                        this.delVisible = false;
                        this.$message.success('删除成功');
                        this.getList();
                    }
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
                        keyWord: this.select_word,
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.userList = res.data.lists;
                })
            },
            handleSee(index, row) {
                this.seeDialog = true;
                if(row.userDetail){
                    this.isIdcard = true;
                }else{
                    this.isIdcard = false;
                }
                this.seeform.account = row.account
                this.seeform.userName = row.userName
                this.seeform.country = row.country
                this.seeform.recommendCode = row.recommendCode
                this.seeform.status = row.status
                this.seeform.name = row.userDetail.name
                this.seeform.idNo = row.userDetail.idNo
                this.seeform.frontImg = row.userDetail.front
                this.seeform.backImg = row.userDetail.back
                this.seeform.handImg = row.userDetail.hand
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
    el-image{
        border: 1px solid #ccc;
    }
</style>
