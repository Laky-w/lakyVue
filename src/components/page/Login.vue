
<template>
    <div class="login-wrap">
        <!-- <div class="ms-title">后台管理系统</div> -->
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <div class="message">湖之教育</div>
                <div id="darkbannerwrap"></div>
                <el-form-item prop="serial">
                    <!-- <el-input id="password" v-model="password" type="password" placeholder="请输入密码">
                        <template slot="prepend">密码</template>
                    </el-input>   -->
                    <!-- <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker> -->
                    <el-input v-model="ruleForm.serial" name="serial" placeholder="机构代码">
                        <template slot="prepend"><i class="el-icon-laky-branch"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="userName">
                    <el-input v-model="ruleForm.userName" name="userName" placeholder="用户名/邮箱/电话">
                        <template slot="prepend"><i class="el-icon-laky-user"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input type="password"  placeholder="密码" name="pwd" v-model="ruleForm.pwd" autofocus @keyup.enter.native="submitForm('ruleForm')">
                        <template slot="prepend"><i class="el-icon-laky-lock"></i></template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button :loading="loadForm" type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#fff000;"></p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                loadForm:false,
                ruleForm: {
                    serial: '001',
                    userName: 'admin',
                    pwd: '123456'
                },
                rules: {
                    serial: [
                        { required: true, message: '请输入机构代码', trigger: 'blur' }
                    ],
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },

        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.loadForm=true;
                        self.$axios.post("organization/login",this.ruleForm).then( (res) => {
                            var data = res.data;
                            self.loadForm=false;
                            if (data.code==200) {//登录成功

                                sessionStorage.setItem("token",data.data["token"]);
                                sessionStorage.setItem("branch",JSON.stringify(data.data["branch"]));
                                sessionStorage.setItem("userInfo",JSON.stringify(data.data["userInfo"]));
                                let isOut=sessionStorage.getItem("isOut");
                                if(isOut==="false"){
                                    sessionStorage.removeItem("isOut");
                                    window.history.back(-1);
                                }else{
                                    self.$router.push('/laky');
                                }

                            } else {
                                this.$message.error(data.data);
                            }
                        })
                       // localStorage.setItem('ms_username',self.ruleForm.username);
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        mounted: function () {
            // var code = sessionStorage.getItem("code");
            // if(code == 420) {
            //     this.$message({
            //         showClose: true,
            //         message: sessionStorage.getItem("message"),
            //         type: 'warning'
            //     });
            //     sessionStorage.removeItem("code");
            //     sessionStorage.removeItem("message");
            // }
        },
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:320px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
