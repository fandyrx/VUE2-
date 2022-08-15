
import request from "@/utils/request";

//GET /admin/product/list/{page}/{limit} 
export const reqSkuList = (page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

//GET /admin/product/onSale/{skuId} 上架
export const reqSale = (skuId)=>request({url:`/admin/product/onSale/${skuId}`,method:'GET'})

//GET /admin/product/cancelSale/{skuId}下架
export const reqCancel = (skuId)=>request({url:`/admin/product/cancelSale/${skuId}`,method:'GET'})

//GET /admin/product/getSkuById/{skuId}
export const reqSkuById = (skuId)=>request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})