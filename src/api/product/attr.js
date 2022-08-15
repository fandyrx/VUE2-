import request from "@/utils/request";

    // GET /admin/product/getCategory1
export   const reqCategoryList1 = ()=>request({url:"/admin/product/getCategory1",method:"get"})


//2 GET /admin/product/getCategory2/{category1Id}
export const reqCategoryList2 = (category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:"get"})

//3 
export const reqCategoryList3 = (category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:"get"})

//get goodsattr  GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:"get"})

//添加 属性接口 /admin/product/saveAttrInfo
export const reqAddAttr = (data)=>request ({url:"/admin/product/saveAttrInfo",method:"post",data})