<template>
  <div>
    <el-form :inline="true"  class="demo-form-inline" :model="cForm">
      
      <el-form-item label="一级分类">
        <el-select  placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label='c1.name' :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select  placeholder="请选择"  v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id"  v-for="(c2,index) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="三级分类">
        <el-select placeholder="请选择"  v-model="cForm.category3Id" @change="handler3"  :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option> 
        </el-select>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
import { reqCategoryList3 } from '@/api/product/attr';
export default {
  name: "CategorySelect",
  props:['show'],
  data(){
    return{
      list1:[],
      list2:[],
      list3:[],
      //id收集
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:'',
      },
      //测试用
      test: []
    }
  },
  mounted(){
    this.getCategoryList1()
  },
  methods:{
   async getCategoryList1(){
        let result = await this.$API.attr.reqCategoryList1(); 
      if (result.code ==200){
        this.list1 = result.data
      }
    },
   async handler1(){
      //  一级改变，清除列表展示残留,id残留
     this.list2=[]
     this.list3=[]
     this.cForm.category2Id = ''
     this.cForm.category3Id = ''

      const {category1Id} = this.cForm;
      //传递1id给父组件Attr,触发父组件回调  并传参
      this.$emit('getCategoryId',{categoryId:category1Id,level:1}) 
      let result = await this.$API.attr.reqCategoryList2(category1Id);
       if (result.code == 200){
      this.list2 = result.data;
     }
    
    
    },
    async handler2(){
      //清除残留
     this.list3=[]
     this.cForm.category3Id = ''

      const {category2Id} = this.cForm;
      this.$emit('getCategoryId',{categoryId:category2Id,level:2})
       let result = await this.$API.attr.reqCategoryList3(category2Id)
      if(result.code == 200){
        this.list3 =  result.data;
      }
    },
    async handler3(){
      const{category1Id,category2Id,category3Id} = this.cForm;
    
       this.$emit('getCategoryId',{categoryId:category3Id,level:3})
      
      // let result = await this.$API.attr.reqAttrInfoList(category1Id,category2Id,category3Id);
      // this.test = result.data
      //  这种方式就是获取数据再传一次 少了打标记，跟父组件拿ID， 后面父组件需要ID？？
      //   this.$emit('getCategoryId',this.test)
    }
  }
};
</script>

<style></style>
