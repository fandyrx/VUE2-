<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称" >
        <el-input placeholder="请输入SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格（元）" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(kg)">
        <el-input placeholder="重量（千克）" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in AttrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId" >
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in SpuSaleAttrList" :key='saleAttr.id'>
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId" >
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片展示">
        <el-table border style="width: 100%" :data="spuImageList"  @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            prop="prop"
            label="label"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>

          <el-table-column width="width" align="center" prop="imgName" label="名称" >
          </el-table-column>

          <el-table-column  width="width" align="center"  prop="prop" label="操作" >
              <template slot-scope="{row,$index}">
                  <el-button type="primary" v-if="row.isDefault ==0" @click="changeDefault(row)">设置默认</el-button>
                  <el-button v-else>默认</el-button>
              </template>
         </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save" >保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
    
      spuImageList: [],
      SpuSaleAttrList: [],
      AttrInfoList: [],
      //上方为存储获取数据，下方为需要发送数据
      skuInfo: {
        //父组件数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //本页面收集数据 v-model 表单类
        skuName: "",
        price: '',
        weight: "",
        skuDesc: "",
        //本页面收集  需要手写代码
         skuDefaultImg: "string",
         //默认图片 ↑
         skuImageList: [
        //   {
        //     id: 0,
        //     imgName: "string",
        //     imgUrl: "string",
        //     isDefault: "string",
        //     skuId: 0,
        //     spuImgId: 0,
        //   },
        ],
         //平台属性
        skuAttrValueList: [
        //   {
        //     attrId: 0,
        //     attrName: "string",
        //     id: 0,
        //     skuId: 0,
        //     valueId: 0,
        //     valueName: "string",
        //   },
        ],
       //销售属性
        skuSaleAttrValueList: [
        //   {
        //     id: 0,
        //     saleAttrId: 0,
        //     saleAttrName: "string",
        //     saleAttrValueId: 0,
        //     saleAttrValueName: "string",
        //     skuId: 0,
        //     spuId: 0,
        //   }, 
        ],
      },
      //收集SPU
      spu:{},
      //收集图片的数据字段，目前缺少isDefault 字段
      imageList:[]
    };
  },
  methods: {
    async getData(Category1Id, Category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      //获取SPU图片信息
      let result = await this.$API.spu.reqSpuImageList1(spu.id);
      
      if (result.code == 200) {
        let list =  result.data;
        list.forEach(item=>{
          item.isDefault = 0; 
        })
        this.spuImageList = list
      }
      // 获取销售属性数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
     
      if (result1.code == 200) {
        this.SpuSaleAttrList = result1.data;
      }

      //平台销售属性 获取
      let result2 = await this.$API.spu.reqAttrInfoList(
        Category1Id,
        Category2Id,
        spu.category3Id
      );
     
      if (result2.code == 200) {
        this.AttrInfoList = result2.data;
      }
    },
    //图片列表 获取勾选信复选框信息
    handleSelectionChange(params){
      this.imageList = params;
    },
    //切换操作 默认设置
    changeDefault(row){
      this.spuImageList.forEach(item=>{item.isDefault = 0}) 
      row.isDefault = 1;

      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //取消按钮
    cancel(){
      //自定义事件，让父组件切换场景0
      this.$emit('changeScenes',0)
      //取消返回后初始化本页面数据
      Object.assign(this._data,this.$options.data());
    },
    //保存按钮 
    async save(){
      //整理收集的所需数据
      const{AttrInfoList,skuInfo,SpuSaleAttrList,imageList} = this;
      // 1.整理平台属性  将返回值赋值给 skuInfo 等待发送给服务器
      skuInfo.skuAttrValueList = AttrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          //用户已勾选，则会有这个数据 执行回调 按照所需字段 解构赋值
          const[attrId,valueId] = item.attrIdAndValueId.split(':');
          //往初始值prev传入[]，现在把收集数据 推入 因为需要对象{} 
          prev.push({attrId,valueId});
        }
        //循环结束后，返回
        return prev
      },[])

      //2.整理销售属性
      skuInfo.skuSaleAttrValueList = SpuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const[saleAttrId,saleAttrValueId] =item.attrIdAndValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])
      //3.整理图片
      skuInfo.skuImageList = imageList.map(item=>{
        return{
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id,
        };
      });

      //4.发送请求
       
      let result =  await this.$API.spu.reqAddSku(skuInfo)
        if(result.code ==200){
          this.$message({type:'success',message:'添加成功'})
          this.$emit('changeScenes',0)
        }
    },
   
   
  },
};
</script>

<style></style>
