<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 帮助中心 - 分类列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addDialog = true">添加分类</el-button>
            </div>
            <el-table :data="toptitle" border class="table" ref="multipleTable">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="fTitle" label="标题" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="button" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="button" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="CurrentChange" layout="prev, pager, next" :total="total" :page-size="pagesize">
                </el-pagination>
            </div>
        </div>

        <!-- 添加分类-->
        <el-dialog title="添加分类" :visible.sync="addDialog" width="30%">
            <div class="form-box">
                <el-form ref="addform" :model="addform">
                    <el-form-item label="请输入分类名称">
                        <el-input v-model="addform.fTitle"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button type="info" @click="addDialog = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <!-- 编辑分类-->
        <el-dialog title="编辑分类" :visible.sync="editVisible" width="30%">
            <div class="form-box">
                <el-form ref="">
                    <el-form-item label="">
                        <el-input v-model="eTitle"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveEdit">保存</el-button>
                        <el-button type="info" @click="editVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">确定要删除吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import service from '../../../api/axios.js'
    export default {
        name: 'basetable',
        data() {
            return {
                toptitle: [],//数据展示
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                addDialog: false,//弹框
                addform:{
                    fTitle:''
                },
                select_word: '',//搜索关键词
                delVisible: false,
                editVisible: false,
                msg:'',
                eTitle:''
            }
        },
        created() {
            this.getitle();
        },
        methods: {
            getitle(){
                service({
                    url:'/customer/title/select/first',
                    method:'post',
                    data: {
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.toptitle = res.data.list;
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            edititle(){
                service({
                    url:'/customer/title/edit/first',
                    method:'post',
                    data: {
                        fId: this.msg,
                        fTitle: this.eTitle
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.$message.success('修改成功');
                        this.editVisible = false;
                        this.getitle();
                    }
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            //删除分类
            deltitle(){
                service({
                    url:'/customer/title/delete/first',
                    method:'post',
                    data: {
                        fId: this.msg
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.$message.success('删除成功');
                        this.delVisible = false;
                        this.getitle();
                    }
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            // 分页导航
            CurrentChange:function(currentPage){
                this.currentPage = currentPage;
                this.getitle();
            },
            search() {},
            //添加分类
            addTitle() {
                service({
                    url:'/customer/title/insert/first',
                    method:'post',
                    data: {
                        fTitle: this.addform.fTitle
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.addDialog = false;
                        this.addform.fTitle = '';
                        this.$message.success('添加成功');
                        this.getitle();
                    }
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            onSubmit(){
                if(this.addform.fTitle){
                    this.addTitle()
                }else{
                    this.$message.error('分类名称不能为空~');
                }
            },
            //编辑分类
            handleEdit(index, row) {
                this.eTitle = row.fTitle;
                this.msg = row.fId;
                this.editVisible = true;
            },
            saveEdit(){
                this.edititle();
            },
            // 删除分类
            handleDelete(index, row) {
                this.msg = row.fId;
                this.delVisible = true;
            },
            //确认删除
            deleteRow(){
                this.deltitle();
            }
        }
    }

</script>

<style scoped>
    .form-box {
        width: 500px;
    }
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
