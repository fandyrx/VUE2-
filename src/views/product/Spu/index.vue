<template>
  <div >
    <el-card style="margin:20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
    </el-card>

     <el-card>
<!-- 展示 -->
    <div v-show="scene == 0">
   
        <el-button type="primary" icon="el-icon-plus" :disabled="!Category3Id" @click="addSpu">添加SPU</el-button>
        <el-table  style="width: 100%" border :data="records">
          <el-table-column prop="prop" label="序号" type="index" width="80" align="center" >
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
              <!-- {{records.spuName}} prop 表格显示内容 且，table用了data,不必再次引用-->
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <hint-button  type='success' icon ='el-icon-plus' size='mini' title="添加spu" @click="addSku(row)"></hint-button>
             
              <hint-button  type='warning' icon ='el-icon-edit' size='mini' title="编辑spu" @click="updateSpu(row)" ></hint-button>
            
              <hint-button  type='info' icon ='el-icon-info' size='mini' title="查看spu" @click="handler(row)"></hint-button>
               <el-dialog :title="`${spu.spuName}的列表`" :visible.sync="dialogTableVisible" :before-close="close">
                      <el-table  :data="skuList"  style="width: 100%" border v-loading="loading">
                        <el-table-column    prop="skuName" label="名称"   width="80"></el-table-column>
                        <el-table-column  prop="skuPrice" label="价格" width="width"></el-table-column>
                        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
                        <el-table-column  label="默认图片" width="width">
                          <template slot-scope="{row,$index}">
                            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
                          </template>
                        </el-table-column>
                      </el-table>
               </el-dialog>

                <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)" >
                     <hint-button  type='danger' icon ='el-icon-delete' size='mini' title="删除spu"  slot="reference"></hint-button>
                </el-popconfirm >
            </template>
          </el-table-column>
        </el-table>
  
         <!-- @current-change="handleCurrentChange" -->
        <el-pagination
          style="text-align:center"

          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="  prev, pager, next, jumper,->,sizes,total"
          :total="total"
           @current-change="getSpuList"
           @size-change="handleSizeChange" >
        </el-pagination>
      
    
    </div>
<!-- 添加spu  -->
    
      <spuForm  v-show="scene == 1" @changeScene="changeScene" ref="spu"></spuForm>
   
<!-- sku添加 -->
  
      <skuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></skuForm>
    
  </el-card>
   
  </div>
</template>

<script>
import skuForm from "./skuForm"
import spuForm from "./spuForm"
// 子组件引入
export default {
    name:"Spu",
    data(){
      return{
        Category1Id:'',
        Category2Id:'',
        Category3Id:'',
       
        page:1,     //当前页数
        limit:3,    //每页数据
        records:[], //分页数据
        total:0, //分页一共需要展示数据条数
        scene:0, //0代表展示SPU列表数据  1代表展示添修改spu  2 添加sku
        dialogTableVisible:false,  //控制查看列表是否显示
        spu:{},
        skuList:[],
        loading:true
      }
    },
    methods:{
      getCategoryId({categoryId,level}){
          if(level ==1 ){
            this.Category1Id = categoryId;
            this.Category2Id = '';
            this.Category3Id = '';
          }else if(level == 2){
            this.Category2Id = categoryId;
            this.Category3Id = '';
          }else {
            this.Category3Id = categoryId
            this.getSpuList();
            //获取数据
          }
      },
     async getSpuList(pages = 1){
        this.page =pages 
        const {page,limit,Category3Id} =this;
        
            
          let result = await this.$API.spu.reqSpuList(page,limit,Category3Id)
          
          this.total = result.data.total;
          this.records =result.data.records;
      },
      //分页器 点击事件
      // handleCurrentChange(page){
      //   this.page =page ;
      //   this.getSpuList();
      // },
      //分页展示条数改变  回调
      handleSizeChange(limit){
          this.limit =limit ;
          this.getSpuList();
      },
      //添加spu
      addSpu(){
        this.scene = 1;
        //切换场景时，需要通知子组件获取 可添加销售属性 和 可选品牌 
        this.$refs.spu.addSpuData(this.Category3Id);
      },
      //修改spu
      updateSpu(row){
          this.scene = 1;
          this.$refs.spu.initSpuData(row);
      },
      //删除SPU
      async deleteSpu(row){
          let result = await this.$API.spu.reqDeleteSpu(row.id)
          if(result.code == 200){
            this.$message({type:'success',message:'删除成功'})
            //当前展示 >1 停留，否则返回上一页
            this.getSpuList(this.records.length > 1?this.page:this.page-1);
          }
      },

// 子组件spuForm 取消按钮，触发Spu组件事件回调
      changeScene({scene,flag}){
       this.scene = scene;
      
       if(flag == 'edit'){
        this.getSpuList(this.page);
       }else{
         this.getSpuList(1);
       }
       
      },

      //添加sku
      addSku(row){
          this.scene = 2
          //切换组件时，选择子组件，调用其身上getData 方法
          this.$refs.sku.getData(this.Category1Id,this.Category2Id,row);
      },
      //skuform 取消按钮通知父组件切换场景
      changeScenes(scene){
        this.scene = scene;
      },

      //查看sku 按钮
     async handler(spu){
          this.dialogTableVisible = true
          this.spu = spu;
         
          let result = await this.$API.spu.reqSkuList(spu.id);
         
          if(result.code ==200){
            this.skuList = result.data
            this.loading = false;
          }
      },
      //关闭对话框
      close(done){
          this.loading = true
          this.skuList= []
          //done 用于关闭对话框，关闭前，清空残留信息
          done();
      }   
      
    },
    components:{
      spuForm,
      skuForm
    }
}
</script>

<style>

</style>