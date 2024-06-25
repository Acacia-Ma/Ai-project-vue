import service from './index.js'


// 添加部门人员信息
export function addDepartment(data){
    return service.request({
        method: "post",
        url: "/adddepartment/",
        data: data
    });
}

// 添加部门
export function addDepart(data){
    return service.request({
        method: "post",
        url: "/adddepart/",
        data: data
    });
}

// 获取子部门信息
export function getSubDepart(data){
    return service.request({
        method: "post",
        url: "/subdepart/",
        data: data
    });
}

// 获取部门中的人员信息
export function getDepartPerson(data){
    return service.request({
        method: "post",
        url: "/getperson/",
        data: data
    });
}

// 获取部门信息
export function getdepartment(){
    return service.request({
        method: "post",
        url: "/getdepartment/",
    });
}

// 编辑部门名称(修改部门名称)
export function editDepartment(data){
    return service.request({
        method: "post",
        url: "/editdepartment/",
        data: data
    });
}

// 删除部门
export function delDepartment(data){
    return service.request({
        method: "post",
        url: "/deldepartment/",
        data: data
    });
}

// 删除部门人员
export function delDepartPerson(data){
    return service.request({
        method: "post",
        url: "/delperson/",
        data: data
    });
}