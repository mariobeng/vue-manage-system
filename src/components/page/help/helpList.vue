<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 帮助中心 - 文章列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="add">添加文章</el-button>
            </div>
            <el-table :data="Article" border class="table" ref="multipleTable">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="sTitle" label="文章标题" align="center">
                </el-table-column>
                <el-table-column prop="fTitle" label="所属分类" align="center">
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
        <!-- 添加文章 begin-->
        <el-dialog title="添加文章" :visible.sync="addDialog">
            <div class="form-box">
                <el-form :label-position="labelPosition" :rules="rules" ref="addform" :model="addform" label-width="100px">
                    <el-form-item label="所属一级分类" prop="fId">
                        <el-select v-model="addform.fId" placeholder="请选择">
                            <el-option
                            v-for="item in fTitle"
                            :key="item.fId"
                            :label="item.fTitle"
                            :value="item.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题" prop="sTitle">
                        <el-input v-model="addform.sTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <editor :catchData="catchData" :content="addform.content"></editor>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('addform')">提交</el-button>
                        <el-button type="info" @click="addDialog = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!-- 添加文章 end-->
        <!-- 编辑文章 begin-->
        <el-dialog title="编辑文章" :visible.sync="editDialog">
            <div class="form-box">
                <el-form :label-position="labelPosition" :rules="rules" ref="editform" :model="editform" label-width="100px">
                    <el-form-item label="所属一级分类" prop="fId">
                        <el-select v-model="editform.fId" placeholder="请选择">
                            <el-option
                            v-for="item in fTitle"
                            :key="item.fId"
                            :label="item.fTitle"
                            :value="item.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题" prop="sTitle">
                        <el-input v-model="editform.sTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <editor :catchData="catchData" :content="editform.content"></editor>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="editSubmit('editform')">保存</el-button>
                        <el-button type="info" @click="editDialog = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!-- 编辑文章 end-->
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
    import editor from '../../editor/index'
    export default {
        name: 'basetable',
        data() {
            return {
                Article: [],//数据展示
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                addDialog: false,//添加文章
                editDialog: false,//编辑文章
                select_word: '',//搜索关键词
                delVisible: false,
                msg:'',
                fTitle: [],//一级标题
                labelPosition: 'top',
                addform: {
                    fId: '',
                    sTitle: '',
                    content: ''
                },
                editform: {
                    fId: '',
                    sTitle: '',
                    content: ''
                },
                rules: {
                    fId: [
                        { required: true, message: '请选择一级分类', trigger: ['change','blur'] }
                    ],
                    sTitle: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ]
                },
                fIdValue: '',
                //富文本
                content: ''
            }
        },
        created() {
            this.getArticle();
        },
        methods: {
            // 分页导航
            CurrentChange:function(currentPage){
                this.currentPage = currentPage;
                this.getArticle();
            },
            //获取一级标题
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
                    this.fTitle = res.data.list;
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            // 文章列表
            getArticle() {
                service({
                    url:'/customer/title/select/second',
                    method:'post',
                    data: {
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.Article = res.data.list;
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            //添加文章
            faArticle(){
                service({
                    url:'/customer/title/insert/second',
                    method:'post',
                    data: {
                        fId: this.addform.fId,
                        sTitle: this.addform.sTitle,
                        content: this.addform.content
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.addDialog = false;
                        this.getArticle();
                        this.$message.success('文章添加成功');
                    }
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            add(){
                this.addDialog = true;
                this.getitle();
            },
            onSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.addform.content == '' || this.addform.content == '<p><br></p>'){
                            console.log(this.addform.content);
                            this.$message.error('文章内容不能为空');
                            return false;
                        }else{
                            this.faArticle();
                        }
                    } else {
                        return false;
                    }
                });
            },
            editSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.editform.content == '' || this.editform.content == '<p><br></p>'){
                            console.log(this.editform.content);
                            this.$message.error('文章内容不能为空');
                            return false;
                        }else{
                            this.editContent();
                        }
                    } else {
                        return false;
                    }
                });
            },
            catchData(value){
                this.addform.content = value; //在这里接受子组件传过来的参数，赋值给data里的参数
            },
            //回显文章内容
            getContent(){
                service({
                    url:'/customer/title/selectOne',
                    method:'post',
                    data: {
                        sId: this.msg,
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.editform.fId = res.data.fId;
                    this.editform.sTitle = res.data.sTitle;
                    this.editform.content = res.data.content;
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            //保存编辑
            editContent(){
                service({
                    url:'/customer/title/edit/second',
                    method:'post',
                    data: {
                        sId: this.msg,
                        fId: this.editform.fId,
                        sTitle: this.editform.sTitle,
                        content: this.editform.content
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.editDialog = false;
                        this.getArticle();
                        this.$message.success('修改成功');
                    }
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            //点击编辑
            handleEdit(index, row){
                this.msg = row.sId;
                this.editDialog = true;
                this.getitle();
                this.getContent();
            },
            //删除文章
            delArticle(){
                service({
                    url:'/customer/title/delete/second',
                    method:'post',
                    data: {
                        sId: this.msg
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.delVisible = false;
                        this.$message.success('删除成功');
                        this.getArticle();
                    }
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            search() {

            },
            //删除文章
            handleDelete(index, row) {
                this.msg = row.sId;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){
                this.delArticle();
            }
        },
        components: {
            editor: editor
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
