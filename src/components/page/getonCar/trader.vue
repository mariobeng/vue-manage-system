<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 收款信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" @click="addDialog = true">添加收款信息</el-button>
            </div>
            <div class="box">
                <el-table :data="tableData" border class="table" ref="multipleTable">
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="真实姓名" align="center">
                    </el-table-column>
                    <el-table-column prop="type" label="收款方式" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.type | payType }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
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
        </div>
        <!-- 添加收款信息 begin-->
        <el-dialog title="添加收款信息" :visible.sync="addDialog">
            <div class="form-box">
                <el-form :rules="rules" ref="addform" :model="addform" label-width="160px">
                    <el-form-item label="收款方式" prop="type">
                        <el-select v-model="addform.type" placeholder="请选择">
                            <el-option
                            v-for="item in types"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="addform.type == 1 || addform.type == 2" label="用户名" prop="account">
                        <el-input v-model="addform.account"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="name">
                        <el-input v-model="addform.name"></el-input>
                    </el-form-item>
                    <el-form-item v-if="addform.type == 1 || addform.type == 2" label="收款码" prop="qrcode">
                        <el-upload
                        class="avatar-uploader"
                        name="pic"
                        :action="uploadUrl()"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        :before-upload="beforeAvatarUpload">
                        <el-image style="width:178px;" :fit="fit" v-if="addform.qrcode" :src="addform.qrcode" class="avatar"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item v-if="addform.type == 3" label="开户行" prop="bankName">
                        <el-input v-model="addform.bankName"></el-input>
                    </el-form-item>
                    <el-form-item v-if="addform.type == 3" label="开户支行" prop="bankDetailName">
                        <el-input v-model="addform.bankDetailName"></el-input>
                    </el-form-item>
                    <el-form-item v-if="addform.type == 3" label="银行卡号" prop="card">
                        <el-input v-model="addform.card"></el-input>
                    </el-form-item>
                    <el-form-item v-if="addform.type == 3" label="确认银行卡号" prop="confirmCard">
                        <el-input v-model="addform.confirmCard"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="addform.type == 1 || addform.type == 2" type="primary" @click="validAdd('addform')">提交</el-button>
                        <el-button v-if="addform.type == 3" type="primary" @click="validCard('addform')">提交</el-button>
                        <el-button type="info" @click="addDialog = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!-- 查看收款信息 -->
        <el-dialog title="收款信息" :visible.sync="seeDialog">
            <div class="form-box">
                <el-form ref="seeform" :model="seeform" label-width="100px">
                    <el-form-item label="收款方式：">
                        <span>{{seeform.type | payType}}</span>
                    </el-form-item>
                    <el-form-item label="用户名：" v-if="seeform.type == 1 || seeform.type == 2">
                        <span>{{seeform.account}}</span>
                    </el-form-item>
                    <el-form-item label="真实姓名：">
                        <span>{{seeform.name}}</span>
                    </el-form-item>
                    <el-form-item label="收款码：" v-if="seeform.type == 1 || seeform.type == 2">
                        <el-image :src="seeform.qrcode" :fit="fit" style="width:150px;"></el-image>
                    </el-form-item>
                    <el-form-item label="开户行：" v-if="seeform.type == 3">
                        <span>{{seeform.bankName}}</span>
                    </el-form-item>
                    <el-form-item label="开户支行：" v-if="seeform.type == 3">
                        <span>{{seeform.bankDetailName}}</span>
                    </el-form-item>
                    <el-form-item label="银行卡号：" v-if="seeform.type == 3">
                        <span>{{seeform.card}}</span>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑收款信息" :visible.sync="editVisible">
            <div class="form-box">
                <el-form :rules="rules" ref="editform" :model="editform" label-width="160px">
                    <el-form-item label="收款方式" prop="type">
                        <el-select v-model="editform.type" placeholder="请选择">
                            <el-option
                            v-for="item in types"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="editform.type == 1 || editform.type == 2" label="用户名" prop="account">
                        <el-input v-model="editform.account"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="name">
                        <el-input v-model="editform.name"></el-input>
                    </el-form-item>
                    <el-form-item v-if="editform.type == 1 || editform.type == 2" label="收款码" prop="qrcode">
                        <el-upload
                        class="avatar-uploader"
                        name="pic"
                        :action="uploadUrl()"
                        :show-file-list="false"
                        :on-success="editSuccess"
                        :before-upload="beforeAvatarUpload">
                        <el-image style="width:178px;" :fit="fit" v-if="editform.qrcode" :src="editform.qrcode" class="avatar"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item v-if="editform.type == 3" label="开户行" prop="bankName">
                        <el-input v-model="editform.bankName"></el-input>
                    </el-form-item>
                    <el-form-item v-if="editform.type == 3" label="开户支行" prop="bankDetailName">
                        <el-input v-model="editform.bankDetailName"></el-input>
                    </el-form-item>
                    <el-form-item v-if="editform.type == 3" label="银行卡号" prop="card">
                        <el-input v-model="editform.card"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="editform.type == 1 || editform.type == 2" type="primary" @click="validEdit('editform')">提交</el-button>
                        <el-button v-if="editform.type == 3" type="primary" @click="editvalidCard('editform')">提交</el-button>
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
    import service from '../../../api/axios.js'
    export default {
        name: 'basetable',
        filters: {
            payType(val){
                if(val == 1){
                    return "微信"
                }
                if(val == 2){
                    return "支付宝"
                }
                if(val == 3){
                    return "银行卡"
                }
            }
        },
        data() {
            return {
                tableData: [],
                total: 0,//数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                select_word: '',
                addDialog: false,
                seeDialog: false,
                editVisible: false,
                delVisible: false,
                rules: {
                    type: [{ required: true, message: '请选择收款方式', trigger: 'blur' }],
                    account: [{ required: true, message: '请输入昵称或用户名', trigger: 'blur' }],
                    name: [{ required: true, message: '请填写真实姓名', trigger: 'blur' }],
                    bankName: [{ required: true, message: '请填写开户行名称', trigger: 'blur' }],
                    bankDetailName: [{ required: true, message: '请填写开户支行名称', trigger: 'blur' }],
                    card: [{ required: true, message: '请填写银行卡号', trigger: 'blur' }],
                    confirmCard: [{ required: true, message: '请再次填写银行卡号', trigger: 'blur' }]
                },
                types: [
                    {
                        value: 1,
                        label: '微信'
                    },
                    {
                        value: 2,
                        label: '支付宝'
                    },
                    {
                        value: 3,
                        label: '银行卡'
                    }
                ],
                addform: {
                    type: 1,
                    account: '',
                    name: '',
                    qrcode: '',
                    bankName: '',
                    bankDetailName: '',
                    card: '',
                    confirmCard: ''
                },
                editform: {
                    type: 1,
                    detailId: '',
                    account: '',
                    name: '',
                    qrcode: '',
                    bankName: '',
                    bankDetailName: '',
                    card: '',
                    confirmCard: ''
                },
                seeform: {
                    type: 1,
                    account: '',
                    name: '',
                    qrcode: '',
                    bankName: '',
                    bankDetailName: '',
                    card: '',
                    confirmCard: ''
                },
                fit: 'scale-down',
                deldata: {
                    type: 1,
                    detailId: ''
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
                    url:'/deal/queryGathering',
                    method:'post',
                    data: {
                        pageNum: this.currentPage
                    }
                })
                .then(res=> {
                    console.log(res);
                    this.total = res.data.total;
                    this.tableData = res.data.list;
                })
            },
            search() {

            },
            handleSee(index, row) {
                this.seeDialog = true
                this.seeform.type = row.type
                this.seeform.account = row.account
                this.seeform.name = row.name
                this.seeform.qrcode = row.qrcode
                this.seeform.bankName = row.bankName
                this.seeform.bankDetailName = row.bankDetailName
                this.seeform.card = row.card
            },
            handleEdit(index, row) {
                this.editVisible = true
                this.editform.type = row.type
                this.editform.detailId = row.detailId
                this.editform.account = row.account
                this.editform.name = row.name
                this.editform.qrcode = row.qrcode
                this.editform.bankName = row.bankName
                this.editform.bankDetailName = row.bankDetailName
                this.editform.card = row.card
            },
            handleDelete(index, row) {
                this.delVisible = true
                this.deldata.type = row.type
                this.deldata.detailId = row.detailId
            },
            // 保存编辑
            saveEdit() {

            },
            // 确定删除
            deleteRow(){
                service({
                    url:'/deal/removeGathering',
                    method:'post',
                    data: {
                        type: this.deldata.type,
                        detailId: this.deldata.detailId
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.delVisible = false;
                        this.$message.success('删除成功');
                        this.getData();
                    }
                })
            },
            //文件上传成功时的钩子，用来获取后台返回的数据
            handleSuccess(res, file) {
                console.log(res);
                this.addform.qrcode = res.data;
            },
            editSuccess(res, file) {
                console.log(res);
                this.editform.qrcode = res.data;
            },
            //微信和支付宝添加提交
            validAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addSubmit();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            addSubmit(){
                if(!this.addform.qrcode){
                    this.$message.error('请上传收款码');
                    return false;
                }else{
                    this.subSocial();
                }
            },
            subSocial(){
                service({
                    url:'/deal/insertGathering',
                    method:'post',
                    data: {
                        type: this.addform.type,
                        name: this.addform.name,
                        account: this.addform.account,
                        qrcode: this.addform.qrcode,
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.addDialog = false;
                        this.$message.success('收款信息添加成功');
                        this.getData();
                    }
                })
            },
            //微信和支付宝编辑提交
            validEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editSubmit();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editSubmit(){
                if(!this.editform.qrcode){
                    this.$message.error('请上传收款码');
                    return false;
                }else{
                    this.editSocial();
                }
            },
            editSocial(){
                console.log(this.editform.type);
                service({
                    url:'/deal/alterGathering',
                    method:'post',
                    data: {
                        type: this.editform.type,
                        detailId: this.editform.detailId,
                        name: this.editform.name,
                        account: this.editform.account,
                        qrcode: this.editform.qrcode,
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.editVisible = false;
                        this.$message.success('收款信息修改成功');
                        this.getData();
                    }
                })
            },
            //银行卡添加提交
            validCard(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.subCard();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            subCard(){
                service({
                    url:'/deal/insertGathering',
                    method:'post',
                    data: {
                        type: this.addform.type,
                        name: this.addform.name,
                        bankName: this.addform.bankName,
                        bankDetailName: this.addform.bankDetailName,
                        card: this.addform.card,
                        confirmCard: this.addform.confirmCard
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.addDialog = false;
                        this.$message.success('收款信息添加成功');
                        this.getData();
                    }
                })
            },
            //银行卡修改提交
            editvalidCard(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editsubCard();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editsubCard(){
                service({
                    url:'/deal/alterGathering',
                    method:'post',
                    data: {
                        type: this.addform.type,
                        detailId: this.editform.detailId,
                        name: this.addform.name,
                        bankName: this.addform.bankName,
                        bankDetailName: this.addform.bankDetailName,
                        card: this.addform.card,
                        confirmCard: this.addform.confirmCard
                    }
                })
                .then(res=> {
                    console.log(res);
                    if(res.data){
                        this.editVisible = false;
                        this.$message.success('收款信息添加成功');
                        this.getData();
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
                    this.$message.error('上传图片大小不能超过 5MB!');
                }
                return (isJPG || isBMP || isGIF || isPNG) && isLt5M;
            },
            uploadUrl(){
                // console.log(process.env.BASE_URL);
                // var url = process.env.BASE_API + "/start/upload";
                var url = 'http://47.52.192.24:8080/start/uploadQRcode'
                return url;
            }
        }
    }

</script>

<style lang="scss" scoped>
    $borderColor:#EBEEF5;
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
    .box{
        h3{
            margin-bottom: 10px;
            line-height: 40px;
        }
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .el-upload{
        width: 178px !important;
    }
</style>
