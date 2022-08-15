<template>
  <div>
    <el-table  style="width: 100%" border :data="records">
      <el-table-column type="index"  label="序号"  width="80"> </el-table-column>
      <el-table-column prop="skuName"   label="名称"  width="width"> </el-table-column>
      <el-table-column prop="skuDesc"   label="描述"  width="width"> </el-table-column>
      <el-table-column    label="默认图片"  width="110">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" alt="" style="width:80px;height:80px">
            </template>
      </el-table-column>
      <el-table-column prop="weight"   label="重量"  width="80"> </el-table-column>
      <el-table-column prop="price"   label="价格"  width="80"> </el-table-column>
      <el-table-column prop="prop"   label="操作"  width="width">
        <template slot-scope="{row,$index}">
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-if="row.isSale == 0" @click="sale(row)"></el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini" v-else @click="cancel(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(row)"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
      
    <el-pagination
      @current-change="getSkuList"
      @size-change="handlerSizeChange"
      style='text-align:center'
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total">
    </el-pagination>

    <!-- drawer -->
    <el-drawer  :visible.sync="show"  :show-close='false' size="50%" >
          <el-row>
            <el-col :span="5">名称</el-col>
            <el-col :span="16">{{skuInfo.skuName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">描述</el-col>
            <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">价格</el-col>
            <el-col :span="16">{{skuInfo.price}}元</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">平台属性</el-col>
            <el-col :span="16">
              <template >
                <el-tag type="success" v-for="(skuValue,index) in skuInfo.skuAttrValueList" 
                :key="skuValue.id" 
                style="margin-right:10px;" >
                {{skuValue.attrId}}-{{skuValue.valueId}}
                </el-tag>
              </template>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">商品图片</el-col>
            <el-col :span="16">
                 <el-carousel height="300px">
                    <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                        <img :src="item.imgUrl" style="width:100%;height:100%">
                    </el-carousel-item>
                  </el-carousel>
            </el-col>
          </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
    name:"Sku",
    data() {
      return {
        page:1, //当前页码
        limit:10, //当前展示数据数
        records:[], //sku列表数据
        total:0, //分页器总共展示数据数
        skuInfo:[], //skuInfo 展示
       show:false, //drawer show
      }
    },
    mounted(){
      this.getSkuList();
    },
    methods:{
     async getSkuList(pages = 1){
      this.page = pages //默认为1 ，有参数传入则使用参数 
        const{page,limit} = this
          let result = await this.$API.sku.reqSkuList(page,limit);
          console.log(result);
          if(result.code == 200){
            this.total = result.data.total;
            this.records = result.data.records
          }
      },
      //展示数据条数改变
     handlerSizeChange(limit){
        this.limit = limit
        this.getSkuList()
     },
     //上架
    async sale(row){
        let result  = await this.$API.sku.reqSale(row.id);

        if(result.code == 200){
          row.isSale = 1
          this.$message({type:'success',message:'上架成功'})
        }
     },
     //下架
    async cancel(row){
        let result  = await this.$API.sku.reqCancel(row.id);

        if(result.code == 200){
          row.isSale = 0
          this.$message({type:'info',message:'下架成功'})
        }
     },
     //编辑
     edit(row){
      this.$message('正在开发中')
     },
     //sku详情
    async getSkuInfo(sku){
      this.show = true
      let result = await this.$API.sku.reqSkuById(sku.id)
      if(result.code == 200){
      this.skuInfo = result.data
      }

     }

    }
}
</script>



<style>
 
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

 .el-carousel__button{
    border-radius: 50%;
    background-color: pink;
    width: 10px;
    height: 10px;
 }
</style>




<style  scoped>
  .el-row .el-col-5{
    font-weight: 700;
    font-size: 18px;
    text-align: right;
  }
  .el-col{
  margin: 10px 10px;
  }
</style>



