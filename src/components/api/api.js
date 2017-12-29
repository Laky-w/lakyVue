import axios from 'axios';

let base = '';
//获取当前校区id
export const _getCurrentUserInfo = params => { let user = JSON.parse(sessionStorage.getItem("userInfo")); return user };

// 请求登录
export const requestLogin = params => { return axios.post(`organization/login`, params).then(res => res.data); };
//退出登录
export const loginOut = params => { return axios.get(`organization/loginOut`).then(res => res.data); };
//系统=============
//获取菜单
export const getMenu = params => { return axios.get(`organization/getMenu`, params).then(res => res.data); };
//主页部分 公告
export const findNewNoticeAll = params => { return axios.get(`organization/findNewNoticeAll`, params).then(res => res.data); };
//查询公告
export const findNoticeAll = (pageNumber, pageSize, params) => { return axios.post(`organization/findNoticeAll/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//创建公告
export const createNotice = params => { return axios.post(`organization/createNotice`, params).then(res => res.data); };
//查询全部参数
export const findBranchParameterAll = (id, params) => { return axios.get(`organization/findBranchParameterAll`, params).then(res => res.data); };
//查询某类参数
export const findBranchParameterByType = (id, params) => { return axios.get(`organization/findBranchParameterByType/${id}`, params).then(res => res.data); };
//查询参数值
export const findBranchParameterValueAll = (id, params) => { return axios.get(`organization/findBranchParameterValueAll/${id}`, params).then(res => res.data); };
//创建参数
export const createBranchParameterValue = params => { return axios.post(`organization/createBranchParameterValue`, params).then(res => res.data); };
//查询全部校区
export const findSchoolZoneAll = (type, params) => { return axios.get(`organization/findSchoolZoneAll/${type}`, params).then(res => res.data); };
//findChildSchoolZoneAll
export const findChildSchoolZoneAll = (type, pid, params) => { return axios.get(`organization/findChildSchoolZoneAll/${type}/${pid}`, params).then(res => res.data); };
//创建校区或部门
export const createSchoolZone = params => { return axios.post(`organization/createSchoolZone`, params).then(res => res.data); };
//getRoleList
export const getRoleList = (pageNumber, pageSize, params) => { return axios.post(`organization/getRoleList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//查询校区职能
export const getRoleListBySchoolZoneId = (id, params) => { return axios.get(`organization/getRoleListBySchoolZoneId/${id}`, params).then(res => res.data) };
//创建员工职能
export const createNewRole = params => { return axios.post(`organization/createNewRole`, params).then(res => res.data); };

//校区查询用户
export const getUserList = (pageNumber, pageSize, params) => { return axios.post(`organization/getUserList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//创建用户
export const createUser = params => { return axios.post(`organization/createUser`, params).then(res => res.data); };
//系统=============

//日志=============
//查询邀约日志
export const findLoginLog = (pageNumber, pageSize, params) => { return axios.post(`log/findLoginLog/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//查询操作日志
export const findOperateLogAll = (pageNumber, pageSize, params) => { return axios.post(`log/findOperateLogAll/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//日志=============

//招生=============
//查询生源
export const getCustomerList = (pageNumber, pageSize, params) => { return axios.post(`supply/getCustomerList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//创建生源
export const createCustomer = params => { return axios.post(`supply/createCustomer`, params).then(res => res.data); };
//查询联系记录
export const getContactList = (pageNumber, pageSize, params) => { return axios.post(`supply/getContactList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//创建联系记录
export const createContact = params => { return axios.post(`supply/createContact`, params).then(res => res.data); };
//查询邀约记录
export const getInviteList = (pageNumber, pageSize, params) => { return axios.post(`supply/getInviteList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//创建邀约记录
export const createInvite = params => { return axios.post(`supply/createInvite`, params).then(res => res.data); };
//查询市场活动
export const getActivityList = (pageNumber, pageSize, params) => { return axios.post(`supply/getActivityList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//创建市场活动
export const createActivity = params => { return axios.post(`supply/createActivity`, params).then(res => res.data); };
//招生=============

//前台==========
//获取学生

//前台==========
//查询正式学员
export const getStudentList = (pageNumber, pageSize, params) => { return axios.post(`reception/getStudentList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//创建学员
export const createStudent = params => { return axios.post(`reception/createStudent`, params).then(res => res.data); };

//报名
export const createStudentApply = (studentId,params) => { return axios.post(`reception/createStudentApply/${studentId}`, params).then(res => res.data); };
//查询订单  getOrderList
export const getOrderList = (pageNumber, pageSize, params) => { return axios.post(`reception/getOrderList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//查询订单详情 getOrderDetailList
export const getOrderDetailList = (orderId) => { return axios.get(`reception/getOrderDetailList/${orderId}`).then(res => res.data); };
//教学=============
// 查询教室
export const getRoomList = (pageNumber, pageSize, params) => { return axios.post(`teach/getRoomList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
// 创建教室
export const createRoom = params => { return axios.post(`teach/createRoom`, params).then(res => res.data); };
//查询课程
export const getCourseList = (pageNumber, pageSize, params) => { return axios.post(`teach/getCourseList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//查询课程树
export const getCourseTreeList = (params) => { return axios.get(`teach/getCourseTreeList`, params).then(res => res.data); };
//创建课程
export const createCourse = params => { return axios.post(`teach/createCourse`, params).then(res => res.data); };
//查询课程收费标准
export const getChargeStandard = (courseId) => { return axios.get(`teach/getChargeStandard/`+courseId).then(res => res.data); };
// 查询班级
export const getSchoolClassList = (pageNumber, pageSize, params) => { return axios.post(`teach/getSchoolClassList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
// 创建班级
export const createSchoolClass = params => { return axios.post(`teach/createSchoolClass`, params).then(res => res.data); };
//查询待分班学员
export const getWaitStudentList = (pageNumber, pageSize, params) => { return axios.post(`teach/getWaitStudentList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//教学=============>>>

//财务=============>>>
//查询财务账户
export const getFinanceAccount = (pageNumber, pageSize, params) => { return axios.post(`finance/getFinanceAccountList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//创建财务账户
export const createFinanceAccount = params => { return axios.post(`finance/createFinanceAccount`, params).then(res => res.data); };
//查询收支记录
export const getMoneyRecord = (pageNumber, pageSize, params) => { return axios.post(`finance/getMoneyRecordList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//查询收支记录账户明细
export const getMoneyRecordAccountList = (recordId) => { return axios.get(`finance/getMoneyRecordAccountList/${recordId}`).then(res => res.data); };
//财务============

//后勤=============
//查询物品
export const getGoodsList = (pageNumber, pageSize, params) => { return axios.post(`logistics/getGoodsList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
//创建物品
export const createGoods = params => { return axios.post(`logistics/createGoods`, params).then(res => res.data); };
//查询库存
export const getRecordList = (pageNumber, pageSize, params) => { return axios.post(`logistics/getRecordList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
// 创建库存
export const createGoodsRecord = (params) => { return axios.post(`logistics/createGoodsRecord`, params).then(res => res.data); };
//查询出入库存
export const getRepositoryList = (pageNumber, pageSize, params) => { return axios.post(`logistics/getRepositoryList/${pageNumber}/${pageSize}`, params).then(res => res.data); };
// 创建出入库存
export const createRepository = params => { return axios.post(`logistics/createRepository`, params).then(res => res.data); };

//后勤=============
