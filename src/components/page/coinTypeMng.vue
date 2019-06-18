<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 币种管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="搜索币种" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addDialog = true">币种添加</el-button>
            </div>
            <el-table :data="coinList" border class="table" ref="multipleTable">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="币种全称" align="center">
                </el-table-column>
                <el-table-column prop="symbol" label="简称" align="center">
                </el-table-column>
                <el-table-column prop="description" label="币种描述" align="center">
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
            <!-- 添加币种 begin-->
            <el-dialog title="添加币种" :visible.sync="addDialog">
                <div class="form-box">
                    <el-form :label-position="labelPosition" ref="addform" :model="addform" label-width="100px">
                        <el-form-item label="全称">
                            <el-input v-model="addform.name"></el-input>
                        </el-form-item>
                        <el-form-item label="简称">
                            <el-input v-model="addform.symbol"></el-input>
                        </el-form-item>
                        <el-form-item label="token地址">
                            <el-input v-model="addform.address"></el-input>
                        </el-form-item>
                        <el-form-item label="币种描述">
                            <el-input type="textarea" rows="5" v-model="addform.description"></el-input>
                        </el-form-item>
                        <el-form-item label="上传币种图片（透明背景，尺寸小于800*800）">
                            <el-upload
                            class="avatar-uploader"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                            <el-button type="info" @click="addDialog = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
            <!-- 添加币种 end-->
        </div>

    </div>
</template>

<script>
    import service from '../../api/axios.js'
    export default {
        name: 'basetable',
        data: function(){
            return {
                coinList: [],
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                addDialog: false,
                imageUrl: '',
                //↓暂时无用
                select_word: '',
                del_list: [],
                editVisible: false,
                delVisible: false,
                //form: {},
                idx: -1,
                //币种添加↓
                labelPosition: 'top',
                options:[],
                addform: {
                    name: '',
                    symbol: '',
                    description: ''
                }
            }
        },
        created() {
            this.getCoinList();
        },
        methods: {
            //数据展示
            getCoinList(){
                service({
                    url:'/getCoinList',
                    method:'post',
                    data: {
                        pageNum: this.currentPage
                    }
                })
                .then(response=> {
                    console.log(response);
                    this.total = response.data.total;
                    this.coinList = response.data.lists;
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            //搜索
            searchList(){
                service({
                    url:'/queryCoin',
                    method:'post',
                    data: {
                        pageNum: this.currentPage,
                        CoinName: this.select_word
                    }
                })
                .then(response=> {
                    console.log(response);
                    this.total = response.data.total;
                    this.coinList = response.data.lists;
                })
                .catch(error=>{
                    console.log(error);
                });
            },
            search() {
                if(this.select_word){
                    console.log(this.select_word);
                    this.searchList();
                }
                this.$message.error('搜索框不能为空~');
            },
            // 分页导航
            CurrentChange:function(currentPage){
                this.currentPage = currentPage;
                this.getCoinList();
                console.log(this.coinList.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize));
            },
            onSubmit() {
                this.$message.success('提交成功！');
            },
            //文件上传成功时的钩子，用来获取后台返回的数据
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
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
