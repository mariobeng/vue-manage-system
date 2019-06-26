<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-info"></i> 社群信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="官网">
                        <el-input v-model="form.name" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="twitter">
                        <el-input v-model="form.name" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="微信">
                        <el-input v-model="form.name" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="form.name" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">编辑</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data: function(){
            return {
                disabled: true,
                form: {}
            }
        },
        methods: {
            onSubmit() {
                this.$message.success('提交成功！');
            }
        }
    }
</script>
