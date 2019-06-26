<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 上车订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="orderList" border class="table" ref="multipleTable">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="orderId" label="订单号" align="center">
                </el-table-column>
                <el-table-column prop="coinType" label="交易币种" align="center">
                </el-table-column>
                <el-table-column prop="amount" label="数量" align="center">
                </el-table-column>
                <el-table-column prop="payType" label="支付方式" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.payType | payTypeTxt }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remarkId" label="备注号" align="center">
                </el-table-column>
                <el-table-column prop="payStatus" label="支付状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.payStatus | payColor">{{ scope.row.payStatus | payText }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="dealStatus" label="交易状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.dealStatus | dealColor">{{ scope.row.dealStatus | dealText }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="orderTime" label="创建时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orderTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.payStatus == 1 && scope.row.dealStatus == 0" type="primary" icon="el-icon-s-claim" @click="handleEdit(scope.$index, scope.row)" plain>放行</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="CurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 操作提示框 -->
        <el-dialog title="提示" :visible.sync="passVisible" width="300px" center>
            <div class="del-dialog-cnt">确认将此订单放行吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="passVisible = false">取 消</el-button>
                <el-button type="primary" @click="passEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import service from '../../../api/axios.js'
    export default {
        //过滤器
        filters: {
            //支付方式文字显示
            payTypeTxt(value){
                if(value == 1){
                    return "微信"
                }
                if(value == 2){
                    return "支付宝"
                }
                if(value == 3){
                    return "银行卡"
                }
            },
            //支付状态标签颜色
            payColor(value){
                if(value == 1){
                    return ""
                }
                if(value == 0){
                    return "danger"
                }
            },
            //支付状态文字显示
            payText(val){
                if(val == 1){
                    return "已付款"
                }
                if(val == 0){
                    return "未支付"
                }
            },
            //交易状态标签颜色
            dealColor(value){
                if(value == 0){
                    return "danger"
                }
                if(value == 1){
                    return ""
                }
                if(value == 2){
                    return "warning"
                }
            },
            //交易状态文字显示
            dealText(val){
                if(val == 0){
                    return "未完成"
                }
                if(val == 1){
                    return "已完成"
                }
                if(val == 2){
                    return "取消"
                }
            }
        },
        data() {
            return {
                orderList: [],
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                select_word: '',

                editVisible: false,
                passVisible: false,
                passOrderId: ''
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
                    url:'/deal/orderList',
                    method:'post',
                    data: {
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.orderList = res.data.list;
                })
            },
            search() {

            },
            handleEdit(index, row) {
                this.passVisible = true
                this.passOrderId = row.orderId
            },
            passEdit() {
                service({
                    url:'/deal/confirm/release',
                    method:'post',
                    data: {
                        orderId: this.passOrderId
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.passVisible = false
                        this.$message.success('已成功放行')
                        this.getData()
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
