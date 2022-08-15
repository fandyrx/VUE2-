import request from "@/utils/request"

///admin/product/{page}/{limit}     category3Id

export const  reqSpuList = (page,limit,category3Id) =>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}});

//  /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId)=>request ({url:`/admin/product/getSpuById/${spuId}`,method:'get'});

//GET /admin/product/baseTrademark/getTrademarkList

export const  reqTradeMarkList =()=>request ({url:"/admin/product/baseTrademark/getTrademarkList",method:'get'});

//图片 GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId)=>request ({url:`/admin/product/spuImageList/${spuId}`,method:'get'});

//平台所有销售属性 /admin/product/baseSaleAttrList

export const reqBaseSaleAttrList =()=>request ({url:'/admin/product/baseSaleAttrList',method:'get'});

//修改和添加SPU
export const reqAddOrUpdateSpu = (spuInfo)=>{
    if(spuInfo.id){
        //有ID为修改
        return request({url:'/admin/product/updateSpuInfo',method:"post",data:spuInfo})
    }else{
        //添加
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
    }

}

//删除SPU  /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:"delete"})

//添加模块

//spu图片信息获取  GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList1 = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//spu 销售属性获取
export const reqSpuSaleAttrList = (spuId)=>request ({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'GET'})

//平台属性获取  GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//b保存 sku 
export const reqSaveSpuInfo = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

//添加sku 
export const  reqAddSku = (skuInfo)=>request({url:"/admin/product/saveSkuInfo",method:'post',data:skuInfo})

//获取SKU列表 /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) =>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})