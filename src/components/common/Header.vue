<template>
    <div class="header">
        <div class="logo">{{branchName}}</div>
        <div class="notice"><i class="el-icon-location"></i>公告:{{notice}}</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" :src="userHeadLogo" >
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: 'linxin',
                branchNameDefault: '大海教育',
                defaultHeadLogo:'../../../static/img/img.jpg',
                notices:"",
                notice:"",
                noticeIndex:0
            }
        },
        computed:{
            userHeadLogo(){
                let user = sessionStorage.getItem('userInfo');
                let userHeadLogo=JSON.parse(user).headLogo;
                console.debug(userHeadLogo);
                return userHeadLogo ? userHeadLogo : this.defaultHeadLogo;
            },
            username(){
                let user = sessionStorage.getItem('userInfo');
                let username = JSON.parse(user).nickName;
                return username ? username : this.name;
            },
            branchName(){
                let branch = sessionStorage.getItem('branch');
                console.debug(branch);
                let branchName = JSON.parse(branch).branchName;
                return branchName ? branchName : this.branchNameDefault;
            }
        },
        created(){
            this.loadNotice();
        },

        methods:{
            loadNotice(){
                this.getData();
                let self = this;
                function setNotice(){
                    self.notice = self.notices[self.noticeIndex].content;
                    self.noticeIndex=self.noticeIndex+1;
                    if(self.noticeIndex==(self.notices.length)){
                        self.noticeIndex = 0;
                    }
                }
                window.setInterval(setNotice, 1000);
            },
            getData(){
                let self = this;
                this.$axios.get("organization/findNoticeAll").then( (res) => {
                    var data = res.data;
                    if (data.code==200) {
                        self.notices=data.data;
                    }
                })
            },
            handleCommand(command) {
                if(command == 'loginout'){
                    sessionStorage.removeItem("userInfo");
                    sessionStorage.removeItem("branch");
                    this.$axios.get("organization/loginout").then( (res) => {
                            var data = res.data;
                            if (data.code==200) {//退出成功
                                sessionStorage.removeItem("token");
                            }
                            this.$router.push('/login');
                        })
                    
                }
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .notice{
       float: left; 
       position: absolute;
       font-size: 18px;
       left: 45%;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
