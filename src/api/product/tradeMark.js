import request from '@/utils/request' 
///admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

//添加品牌 POST /admin/product/baseTrademark/save

//修改品牌PUT /admin/product/baseTrademark/update 
// 功能类似，除了参数 所以封装再一起
export const reqAddOrUpdateTradeMark =(tradeMark)=>{
    if(tradeMark.id){
        //携带ID传参则为修改
        return request({url:"/admin/product/baseTrademark/update",method:'put',data:tradeMark});
    }else{
        return request({url:"/admin/product/baseTrademark/save",method:'post',data:tradeMark});
    }
}

//delete  /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark= (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
