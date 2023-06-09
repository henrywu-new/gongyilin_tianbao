import request from '@/utils/request'

export const CommonApi = {
  // 保存天保信息
  saveTbInfo: (data) => {
    return request({
      url: `/forest-api/tempearl-allowance`,
      method: 'post',
      data
    })
  },
  // 更新天保信息
  updateTbInfo: (data) => {
    return request({
      url: `/forest-api/tempearl-allowance`,
      method: 'put',
      data
    })
  },
  // 天保相差
  getTbDiff: () => {
    return request({
      url: `/forest-api/tempearl-allowance/diff`,
      method: 'get'
    })
  },
  // 天保查询
  getTbList(params) {
    return request({
      url: `/forest-api/tempearl-allowance/search`,
      method: 'get',
      params
    })
  },
  // 乡村天保相差
  getVillageTbDiff(params) {
    return request({
      url: `/forest-api/tempearl-allowance/selectDiff`,
      method: 'get',
      params
    })
  },
  // 导入天保上一年度数据
  uploadLastYearData(data) {
    return request({
      url: `/forest-api/tempearl-allowance/upload`,
      method: 'post',
      data
    })
  },
  // 删除天保数据
  delTbData(id) {
    return request({
      url: `/forest-api/tempearl-allowance/${id}`,
      method: 'delete'
    })
  },
  getGyList(params) {
    return request({
      url: `/forest-api/public-allowance/search`,
      method: 'get',
      params
    })
  },
  getGyDiff(params) {
    return request({
      url: `/forest-api/public-allowance/diff`,
      method: 'get',
      params
    })
  },
  getVillageGyDiff(params) {
    return request({
      url: `/forest-api/public-allowance/selectDiff`,
      method: 'get',
      params
    })
  },
  saveGyInfo(data) {
    return request({
      url: `/forest-api/public-allowance`,
      method: 'post',
      data
    })
  },
  uploadGyInfo(data) {
    return request({
      url: `/forest-api/public-allowance/upload`,
      method: 'post',
      data
    })
  },
  delGyInfo(id) {
    return request({
      url: `/forest-api/public-allowance/${id}`,
      method: 'delete'
    })
  },
  updateGyInfo(params) {
    return request({
      url: `/forest-api/public-allowance`,
      method: 'put',
      params
    })
  },
  // 乡村信息查询
  getCountryInfo(params) {
    return request({
      url: `/forest-api/area-village`,
      method: 'get',
      params
    })
  },
  // 保存乡村信息
  saveCountryInfo(data) {
    return request({
      url: `/forest-api/area-village`,
      method: 'post',
      data
    })
  },
  // 更新乡村信息
  updateCountryInfo(data) {
    return request({
      url: `/forest-api/area-village`,
      method: 'put',
      data
    })
  },
  // 新增用户基础数据
  addUserBaseInfo(data) {
    return request({
      url: `/forest-api/base-userinfo`,
      method: 'post',
      data
    })
  },
  // 更新用户基础数据
  updateUserBaseInfo(data) {
    return request({
      url: `/forest-api/base-userinfo`,
      method: 'put',
      data
    })
  },
  // 查询用户列表
  getUserList(params) {
    return request({
      url: `/forest-api/base-userinfo/search`,
      method: 'get',
      params
    })
  },
  // 导入用户数据
  uploadUsers(data) {
    return request({
      url: `/forest-api/base-userinfo/upload`,
      method: 'post',
      data
    })
  },
  // 添加账号
  addAccount(data) {
    return request({
      url: `/forest-api/account`,
      method: 'post',
      data
    })
  },
  // 更新账号
  updateAccount(data) {
    return request({
      url: `/forest-api/account`,
      method: 'put',
      data
    })
  },
  // login
  login(data) {
    return request({
      url: `/forest-api/account/login`,
      method: 'post',
      data
    })
  },
  // logout
  logout() {
    return request({
      url: `/forest-api/account/logout`,
      method: 'get'
    })
  },
  // register
  register(data) {
    return request({
      url: `/forest-api/account/register`,
      method: 'psot',
      data
    })
  },
  // 获取账号列表
  getAccountList(params) {
    return request({
      url: `/forest-api/account/search`,
      method: 'get',
      params
    })
  },
  // 删除账号
  delAccountById(id) {
    return request({
      url: `/forest-api/account/${id}`,
      method: 'delete'
    })
  },
  // 保存基本配置
  saveBaseInfo(data) {
    return request({
      url: `/forest-api/base-config`,
      method: 'post',
      data
    })
  },
  // 更新基本配置
  updateBaseInfo(data) {
    return request({
      url: `/forest-api/base-config`,
      method: 'put',
      data
    })
  },
  // 基本配置查询
  getBaseInfoList(params) {
    return request({
      url: `/forest-api/base-config/search`,
      method: 'get',
      params
    })
  },
  // 删除基本配置
  delBaseInfoById(id) {
    return request({
      url: `/forest-api/base-config/${id}`,
      method: 'delete'
    })
  },
  getAreaByCode(code) {
    return request({
      url: `/forest-api/area/getOne/${code}`,
      method: 'get'
    })
  },
  getAreaList(pcode) {
    return request({
      url: `/forest-api/area/list/${pcode}`,
      method: 'get'
    })
  },
  exportGyExcel() {
    return request({
      url: `/forest-api/public-allowance/download`,
      method: 'get',
      responseType: 'blob'
    })
  },
  exportTbExcel() {
    return request({
      url: `/forest-api/tempearl-allowance/download`,
      method: 'get',
      responseType: 'blob'
    })
  }
}

export default CommonApi
