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
                <el-button type="primary" icon="el-icon-plus" @click="addvisible">币种添加</el-button>
            </div>
            <el-table :data="coinList" border class="table" ref="multipleTable">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="币种全称" align="center">
                </el-table-column>
                <el-table-column prop="symbol" label="简称" align="center">
                </el-table-column>
                <el-table-column prop="contract" label="合约地址" align="center">
                </el-table-column>
                <el-table-column prop="description" label="币种描述" align="center">
                </el-table-column>
                <!-- <el-table-column prop="icon" label="logo" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.icon"  width="50" height="50" />
                    </template>
                </el-table-column> -->
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
                    <el-form :label-position="labelPosition" :rules="rules" ref="addform" :model="addform" label-width="100px">
                        <el-form-item label="全称" prop="name">
                            <el-input v-model="addform.name"></el-input>
                        </el-form-item>
                        <el-form-item label="简称" prop="symbol">
                            <el-input v-model="addform.symbol"></el-input>
                        </el-form-item>
                        <el-form-item label="token地址" prop="contract">
                            <el-input v-model="addform.contract"></el-input>
                        </el-form-item>
                        <el-form-item label="精确位数" prop="decimals">
                            <el-input v-model="addform.decimals"></el-input>
                        </el-form-item>
                        <el-form-item label="币种描述" prop="description">
                            <el-input type="textarea" rows="5" v-model="addform.description"></el-input>
                        </el-form-item>
                        <el-form-item label="上传币种图片（透明背景，尺寸小于800*800）" prop="imgurl">
                            <el-upload
                            class="avatar-uploader"
                            name="pic"
                            :action="uploadUrl()"
                            :show-file-list="false"
                            :on-success="handleSuccess"
                            :before-upload="beforeAvatarUpload">
                            <el-image v-if="addform.imgurl" :src="addform.imgurl" class="avatar"></el-image>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('addform')">提交</el-button>
                            <el-button type="info" @click="addDialog = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
            <!-- 添加币种 end-->
            <!-- 编辑币种 -->
            <el-dialog title="编辑币种" :visible.sync="editDialog">
                <div class="form-box">
                    <el-form :label-position="labelPosition" :rules="rules" ref="editform" :model="editform" label-width="100px">
                        <el-form-item label="全称" prop="name">
                            <el-input v-model="editform.name"></el-input>
                        </el-form-item>
                        <el-form-item label="简称" prop="symbol">
                            <el-input v-model="editform.symbol"></el-input>
                        </el-form-item>
                        <el-form-item label="token地址" prop="contract">
                            <el-input v-model="editform.contract"></el-input>
                        </el-form-item>
                        <el-form-item label="精确位数" prop="decimals">
                            <el-input v-model="editform.decimals"></el-input>
                        </el-form-item>
                        <el-form-item label="币种描述" prop="description">
                            <el-input type="textarea" rows="5" v-model="editform.description"></el-input>
                        </el-form-item>
                        <el-form-item label="上传币种图片（透明背景，尺寸小于800*800）" prop="imgurl">
                            <el-upload
                            class="avatar-uploader"
                            name="pic"
                            :action="uploadUrl()"
                            :show-file-list="false"
                            :on-success="editSuccess"
                            :before-upload="beforeAvatarUpload">
                            <el-image v-if="editform.imgurl" :src="editform.imgurl" class="avatar"></el-image>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="EsubForm('editform')">提交</el-button>
                            <el-button type="info" @click="editDialog = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </div>
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
        data: function(){
            return {
                coinList: [],
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                addDialog: false,
                editDialog: false,
                imageUrl: '',
                select_word: '',
                editVisible: false,
                delVisible: false,
                tableUrl: '',
                fit: 'contain',
                //币种添加↓
                labelPosition: 'top',
                addform: {
                    name: '',
                    symbol: '',
                    contract: '',
                    decimals: 18,
                    description: '',
                    imgurl: ''
                },
                editform: {
                    index:0,
                    name: '',
                    symbol: '',
                    contract: '',
                    decimals: 18,
                    description: '',
                    imgurl: ''
                },
                rules: {
                    name: [{ required: true, message: '请输入币种全称', trigger: 'blur' }],
                    symbol: [{ required: true, message: '请输入币种简称', trigger: 'blur' }],
                    contract: [{ required: true, message: '请输入合约地址', trigger: 'blur' }],
                    decimals: [{ required: true, message: '请输入精确位数', trigger: 'blur' }],
                    description: [{ required: true, message: '请输入币种描述', trigger: 'blur' }]
                },
                delId:''
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
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.coinList = res.data.lists;
                    this.tableUrl = res.data.lists.icon;
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
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.coinList = res.data.lists;
                })
            },
            search() {
                if(this.select_word){
                    console.log(this.select_word);
                    this.searchList();
                }else{
                    this.getCoinList()
                }
            },
            //编辑
            handleEdit(index, row) {
                this.editDialog = true
                this.editform.index = row.index
                this.editform.name = row.name
                this.editform.symbol = row.symbol
                this.editform.contract = row.contract
                this.editform.decimals = row.decimals
                this.editform.description = row.description
                this.editform.imgurl = row.icon
            },
            //删除
            deleteRow(){
                service({
                    url:'/deleteCoinDesc',
                    method:'post',
                    data: {
                        contract: this.delId
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.delVisible = false;
                        this.$message.success('删除成功');
                        this.getCoinList();
                    }
                })
            },
            handleDelete(index, row) {
                this.delVisible = true;
                this.delId = row.contract;
            },
            // 分页导航
            CurrentChange:function(currentPage){
                this.currentPage = currentPage;
                this.getCoinList();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.onSubmit()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            onSubmit() {
                if(!this.addform.imgurl){
                    this.$message.error('请上传币种logo');
                    return false;
                }else{
                    this.addSubmit();
                }
            },
            //编辑提交
            EsubForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editSubmit()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editSubmit() {
                if(!this.editform.imgurl){
                    this.$message.error('请上传币种logo');
                    return false;
                }else{
                    this.getEdit();
                }
            },
            //文件上传成功时的钩子，用来获取后台返回的数据
            handleSuccess(res, file) {
                console.log(res);
                this.addform.imgurl = res.data;
            },
            editSuccess(res, file) {
                console.log(res);
                this.editform.imgurl = res.data;
            },
            addSubmit(){
                service({
                    url:'/insertCoinDesc',
                    method:'post',
                    data: {
                        name: this.addform.name,
                        symbol: this.addform.symbol,
                        contract: this.addform.contract,
                        decimals: this.addform.decimals,
                        description: this.addform.description,
                        icon: this.addform.imgurl,
                        token: 'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjEwODQ1NzUsInN1YiI6IjEiLCJleHAiOjE1NjE2ODkzNzV9.gSCY8RIhm-LbUNYbKJ-O5PhjxlRmcztcvkVfQ1Yy5PU'
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.addDialog = false;
                        this.$message.success('币种添加成功');
                        this.getCoinList();
                    }
                })
            },
            getEdit(){
                service({
                    url:'/updateCoinDescInfo',
                    method:'post',
                    data: {
                        index: this.editform.index,
                        name: this.editform.name,
                        symbol: this.editform.symbol,
                        contract: this.editform.contract,
                        decimals: this.editform.decimals,
                        description: this.editform.description,
                        icon: this.editform.imgurl
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.editDialog = false;
                        this.$message.success('修改成功');
                        this.getCoinList();
                    }
                })
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isGIF = file.type === 'image/gif';
                const isPNG = file.type === 'image/png';
                const isBMP = file.type === 'image/bmp';
                const isLt5M = file.size / 1024 / 1024 < 5;

                if (!isJPG && !isGIF && !isPNG && !isBMP) {
                    this.$message.error('上传图片必须是JPG/GIF/PNG/BMP格式');
                }
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return (isJPG || isBMP || isGIF || isPNG) && isLt5M;
            },
            addvisible(){
                this.addDialog = true;
            },
            uploadUrl(){
                // console.log(process.env.BASE_URL);
                // var url = process.env.BASE_API + "/start/upload";
                var url = 'http://47.52.192.24:8080/start/upload'
                return url;
            }
        }
    }
</script>
<style lang="scss">
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
    .el-upload{
        width: 178px !important;
    }
</style>
