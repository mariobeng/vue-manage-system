<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 提现管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="关键词" class="handle-input mr10"></el-input>
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
                <el-table-column prop="txHash" label="转账hash" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusText }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="button" icon="el-icon-view" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                        <el-button type="button" v-if="scope.row.status == 0" icon="el-icon-tickets" @click="handleDelete(scope.$index, scope.row)">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="CurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

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
            return {
                drawList: [],
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面

                select_word: ''
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

                }else{
                    this.getData();
                }
            },
            filterTag(value, row) {

            },
            handleEdit(index, row) {

            },
            handleDelete(index, row) {

            },
            // 保存编辑
            saveEdit() {

            },
            // 确定删除
            deleteRow(){

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
