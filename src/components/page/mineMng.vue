<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 资产管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="请输入账户" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="mineList" border class="table" ref="multipleTable">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="account" label="账号" align="center">
                </el-table-column>
                <el-table-column prop="mineral" label="矿石" align="center">
                </el-table-column>
                <el-table-column prop="comc" label="COMC" align="center">
                </el-table-column>
                <el-table-column prop="amount" label="冻结金额" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.comc > 0" plain type="danger" icon="el-icon-lock" @click="lockSet(scope.$index, scope.row)">锁仓</el-button>
                        <el-button v-if="scope.row.amount > 0" plain type="primary" icon="el-icon-unlock" @click="unlockSet(scope.$index, scope.row)">释放</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="CurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
        <!-- 锁仓弹框 -->
        <el-dialog title="编辑锁仓数量" :visible.sync="lockVisible" width="30%">
            <el-form :model="lockform" ref="lockform" :rules="rules">
                <el-form-item label="" prop="amount">
                    <el-input v-model="lockform.amount" placeholder="请输入锁仓数量" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="lockVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('lockform')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 释放弹框 -->
        <el-dialog title="编辑释放数量" :visible.sync="unlockVisible" width="30%">
            <el-form :model="unlockform" ref="unlockform" :rules="rules">
                <el-form-item label="" prop="mount">
                    <el-input v-model="unlockform.mount" placeholder="请输入释放数量" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="unlockVisible = false">取 消</el-button>
                <el-button type="primary" @click="subunlock('unlockform')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <!-- <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
    import service from '../../api/axios.js'
    export default {
        data() {
            var validLock = (rule, value, callback) => {
                let regNum = /^\d+(\.\d+)?$/;
                if (!value.match(regNum)) {
                    callback(new Error('输入格式有误，请重新输入'));
                }else if(parseFloat(value) > parseFloat(this.lockValid.comc)){
                    callback(new Error('锁仓数量不能多于COMC数量'));
                }else if(parseFloat(value) == 0){
                    callback(new Error('请输入有效的数量'));
                }else{
                    callback()
                }
            };
            var validUnlock = (rule, value, callback) => {
                let regNum = /^\d+(\.\d+)?$/;
                if (!value.match(regNum)) {
                    callback(new Error('输入格式有误，请重新输入'));
                }else if(parseFloat(value) > parseFloat(this.unlockValid.amount)){
                    callback(new Error('释放数量不能大于已冻结金额'));
                }else if(parseFloat(value) == 0){
                    callback(new Error('请输入有效的数量'));
                }else{
                    callback()
                }
            };
            return {
                mineList: [],
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                select_word: '',
                lockVisible: false,
                unlockVisible: false,
                lockform: {
                    amount: ''
                },
                unlockform: {
                    mount: ''
                },
                lockValid: {
                    uid: '',
                    comc: ''
                },
                unlockValid: {
                    uid: '',
                    amount: ''
                },
                rules: {
                    amount: [
                        { required: true, message: '请输入锁仓数量', trigger: 'blur' },
                        { validator: validLock, trigger: 'blur' }
                    ],
                    mount: [
                        { required: true, message: '请输入释放数量', trigger: 'blur' },
                        { validator: validUnlock, trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 分页导航
            CurrentChange:function(currentPage){
                this.currentPage = currentPage;
                this.getData();
            },
            // 获取数据
            getData() {
                service({
                    url:'/user/getPropertyList',
                    method:'post',
                    data: {
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.mineList = res.data.list;
                })
            },
            searchResult() {
                service({
                    url:'/user/getPropertyList',
                    method:'post',
                    data: {
                        pageNum: this.currentPage,
                        account: this.select_word
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.mineList = res.data.list;
                })
            },
            search() {
                if(this.select_word){
                    console.log(this.select_word)
                    this.searchResult()
                }else{
                    this.getData()
                }
            },
            lockSet(index, row) {
                this.lockVisible = true
                this.lockValid.uid = row.uid
                this.lockValid.comc = row.comc
            },
            //提交锁仓
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.locked()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            locked() {
                service({
                    url:'/user/frozenCapital',
                    method:'post',
                    data: {
                        uid: this.lockValid.uid,
                        amount: this.lockform.amount
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.lockVisible = false;
                        this.$message.success('锁仓成功');
                        this.getData();
                    }
                })
            },
            //提交释放
            unlockSet(index, row) {
                this.unlockVisible = true
                this.unlockValid.uid = row.uid
                this.unlockValid.amount = row.amount
            },
            subunlock(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.unlocked()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            unlocked() {
                service({
                    url:'/user/thawFunds',
                    method:'post',
                    data: {
                        uid: this.unlockValid.uid,
                        amount: this.unlockform.mount
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.unlockVisible = false;
                        this.$message.success('释放成功');
                        this.getData();
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
</style>
