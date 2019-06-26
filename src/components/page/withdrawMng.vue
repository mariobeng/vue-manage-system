<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 提现管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="请输入币种" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="drawList" border class="table" ref="multipleTable">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="coin" label="币种" align="center">
                </el-table-column>
                <el-table-column prop="txTo" label="提现账户" align="center">
                </el-table-column>
                <el-table-column prop="txFrom" label="接收地址" align="center">
                </el-table-column>
                <el-table-column prop="amount" label="数量" align="center">
                </el-table-column>
                <el-table-column prop="fee" label="手续费" align="center">
                </el-table-column>
                <el-table-column prop="timeStamp" label="申请时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.timeStamp | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="txHash" label="转账hash" align="center" width="260">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="110">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusText }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="110">
                    <template slot-scope="scope">
                        <!-- <el-button type="button" icon="el-icon-view" @click="handleEdit(scope.$index, scope.row)">查看</el-button> -->
                        <el-button type="primary" v-if="scope.row.status == 0" icon="el-icon-tickets" @click="handleSet(scope.$index, scope.row)" plain>审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="CurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="填写交易hash" :visible.sync="editVisible" width="30%">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="" prop="hash">
                    <el-input v-model="form.hash" placeholder="请输入正确的交易hash" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import service from '../../api/axios.js'
    export default {
        //过滤器
        filters: {
            //状态标签颜色
            statusFilter(value){
                if(value == 0){
                    return "danger"
                }
                if(value == 1){
                    return "success"
                }
            },
            //状态文字显示
            statusText(val){
                if(val == 0){
                    return "待审核"
                }
                if(val == 1){
                    return "已打款"
                }
            }
        },
        data() {
            var validateHash = (rule, value, callback) => {
                let reg = /^0x[a-zA-Z0-9]{64}$/;
                if (value.match(reg)) {
                    callback();
                } else {
                    callback(new Error('交易hash格式有误，请重新输入'));
                }
            };
            return {
                drawList: [],
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                select_word: '',
                form: {
                    hash: ''
                },
                rules: {
                    hash: [
                        { required: true, message: '请输入交易hash', trigger: 'blur' },
                        { validator: validateHash, trigger: 'blur' }
                    ]
                },
                editVisible: false,
                //主键
                hashIndex: 0
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
            //获取列表
            getData() {
                service({
                    url:'/withdraw/getList/RecordWithdraw',
                    method:'post',
                    data: {
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.drawList = res.data.lists;
                })
            },
            search() {
                if(this.select_word){
                    this.searchCoin()
                }else{
                    this.getData()
                }
            },
            searchCoin(){
                service({
                    url:'/withdraw/query/RecordWithdraw',
                    method:'post',
                    data: {
                        pageNum: this.currentPage,
                        Coin: this.select_word
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.total = res.data.total;
                        this.drawList = res.data.lists;
                    }
                })
            },
            handleSet(index, row) {
                this.editVisible = true
                this.hashIndex = row.index
            },
            //提交hash
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitHash()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitHash() {
                service({
                    url:'/withdraw/changeStatus/RecordWithdraw',
                    method:'post',
                    data: {
                        index: this.hashIndex,
                        txHash: this.form.hash
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.editVisible = false;
                        this.$message.success('提交成功');
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
