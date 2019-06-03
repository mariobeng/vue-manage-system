<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import service from '../../api/axios.js'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // setSha(){
            //     let sha256 =  require("js-sha256").sha256;
            //     let psw = sha256(this.ruleForm.password);
            // },
            submitForm(formName) {
                //debugger
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // axios.post('http://47.52.192.24:8080/userLogin',{
                        //     // userName: this.ruleForm.username,
                        //     // passWord: this.ruleForm.password
                        //     userName: 'admin',
                        //     passWord: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
                        // },
                        // {headers:{'Content-Type':'application/x-www-form-urlencoded'}}
                        // )
                        // .then(function (response) {
                        //     console.log("1");
                        //     console.log(response);
                        // })
                        // .catch(function (error) {
                        //     console.log("2");
                        //     console.log(error);
                        // });
                        //debugger
                        let postdata = {
                            userName: 'admin',
                            passWord: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
                        };
                        service({
                            url:'/userLogin',
                            method:'post',
                            data: postdata
                        })
                        .then(response=> {
                             console.log("1");
                             console.log(response);
                         })
                         .catch(error=>{
                             console.log("0");
                             console.log(error);
                         });
                        //localStorage.setItem('ms_username',this.ruleForm.username);
                        //this.$router.push('/');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>
