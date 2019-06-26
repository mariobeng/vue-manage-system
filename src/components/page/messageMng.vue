<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 消息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-s-promotion" @click="editVisible = true">发送消息</el-button>
            </div>
            <el-table :data="msgList" border class="table" ref="multipleTable">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="adviceTitle" label="消息标题" align="center">
                </el-table-column>
                <el-table-column prop="adviceContent" label="消息内容" align="center">
                </el-table-column>
                <el-table-column prop="createDate" label="通知时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="消息类型" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type | msgType }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="button" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="CurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 发送消息弹框 -->
        <el-dialog title="发送消息" :visible.sync="editVisible">
            <div class="form-box">
                <el-form :rules="rules" ref="sendform" :model="sendform" label-width="160px">
                    <el-form-item label="消息分类" prop="type">
                        <el-select v-model="sendform.type" placeholder="请选择">
                            <el-option
                            v-for="item in types"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题" prop="adviceTitle">
                        <el-input v-model="sendform.adviceTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="adviceContent">
                        <el-input type="textarea" rows="5" v-model="sendform.adviceContent"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="subMsg('sendform')">提交</el-button>
                        <el-button type="info" @click="editVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">确定删除吗？</div>
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
        //过滤器
        filters: {
            //消息类型
            msgType(value){
                if(value == 1){
                    return "全体消息"
                }
                if(value == 2){
                    return "定制消息"
                }
            }
        },
        data() {
            return {
                msgList: [],
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                select_word: '',
                editVisible: false,
                delVisible: false,
                rules: {
                    type: [{ required: true, message: '请选择消息类型', trigger: 'blur' }],
                    adviceTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                    adviceContent: [{ required: true, message: '请填写消息内容', trigger: 'blur' }]
                },
                types: [
                    {
                        value: 1,
                        label: '全体消息'
                    }
                    // {
                    //     value: 2,
                    //     label: '定制消息'
                    // }
                ],
                sendform: {
                    type: 1,
                    adviceTitle: '',
                    adviceContent: ''
                },
                mid: ''
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
                    url:'/advice/adviceList/uid/pageNum',
                    method:'post',
                    data: {
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.msgList = res.data.list;
                })
            },
            //验证提交
            subMsg(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.subSave();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            subSave(){
                service({
                    url:'/advice/backGround/sendMessage',
                    method:'post',
                    data: {
                        type: this.sendform.type,
                        adviceTitle: this.sendform.adviceTitle,
                        adviceContent: this.sendform.adviceContent
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.editVisible = false
                        this.$message.success('消息发送成功')
                        this.getData()
                    }
                })
            },
            search() {

            },
            handleDelete(index, row) {
                this.delVisible = true
                this.mid = row.mid
            },
            // 确定删除
            deleteRow(){
                service({
                    url:'/advice/delete',
                    method:'post',
                    data: {
                        mid: this.mid
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.delVisible = false
                        this.$message.success('删除成功');
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
