<template>
  <el-form ref="form" label-width="80px" :model="spu">
    <el-form-item label="SPU名称">
      <el-input placeholder="spu名称" v-model="spu.spuName"></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spu.tmId">
        <el-option
          :label="tm.tmName"
          :value="tm.id"
          v-for="(tm, index) in tradeMarkList"
          :key="tm.id"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述" :model="spu">
      <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spu.description"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload
        action="dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handlerSuccess"
        :file-list="spuImage"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-select :placeholder="`还有${unSelectAttr.length}个未选择`" v-model="attrIdAndAttrName" >
        <el-option :label="unselect.name" :value="`${unselect.id} :${unselect.name}`" v-for="(unselect,index) in unSelectAttr" :key="unselect.id"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click='addSaleAttr'>添加销售属性</el-button>

      <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="属性值" width="width">
          <template slot-scope="{row,$index}">
            
            
            <el-tag :key="tag.id"  v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false"  @close="row.spuSaleAttrValueList.splice(index,1)">
              {{ tag.saleAttrValueName }}
              
            </el-tag>
              <!--   @keyup.enter.native="handleInputConfirm"  -->
            <el-input class="input-new-tag"  v-if="row.inputVisible"  v-model="row.inputValue" ref="saveTagInput" 
            size="small"
            @blur="handleInputConfirm(row)" >
            </el-input>

            
            <el-button
              v-else
              class="button-new-tag"
              size="small"
                @click="addSaleAttrValue(row)"
              >添加</el-button
            >
          </template>

        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete"  size="mini"  @click="row.spuSaleAttrValueList($index,1)" ></el-button>
            </template>
        </el-table-column>
      </el-table>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button type="info" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        //图片信息 收集
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0,
          // },
        ],
        //spu名称
        spuName: "",
        // 平台销售属性
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: '',
          //   id: '',
          //   saleAttrName: "",
          //   spuId: '',
          //   spuSaleAttrValueList: [
          //     // {
          //     //   baseSaleAttrId: '',
          //     //   id: '',
          //     //   isChecked: "",
          //     //   saleAttrName: "",
          //     //   saleAttrValueName: "",
          //     //   spuId: ''
          //     // },
          //   ],
          // },
        ],
        // 品牌id
        tmId: '',
      }, //存储spu信息属性

      description:'', //spu描述
      tradeMarkList: [], //存储品牌信息
      spuImage: [], //spu图片
      saleAttrList: [], //销售属性
      attrIdAndAttrName:'', //下拉框未选择的 属性ID
    };
  },

  methods: {
    handleRemove(file, fileList) {
      //收集照片墙 ,剩余的  file 是删除的图片
      this.spuImage = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
     //照片墙上传成功 回调
    handlerSuccess(response,file,fileList){
      
    },
    //初始化SPUFORM数据
    async initSpuData(spu) {
      //  获取spu信息
      let result = await this.$API.spu.reqSpu(spu.id);
      
      if (result.code == 200) {
        this.spu = result.data;
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //spu图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listAttr = spuImageResult.data;

        //照片墙需要展示数据name ,url 属性
        //对返回数据做一定修改 再返回
        listAttr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImage = listAttr;
      }
      //获取平台，全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加属性
    addSaleAttr(){
      //收集到的未勾选属性,id 结构赋值

      const[baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':');

      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]};
      this.spu.spuSaleAttrList.push(newSaleAttr);

      //清空可选框内容
       this.attrIdAndAttrName = '';
    },
    //attr add value
    addSaleAttrValue(row){
      //点击销售属性值当中添加按钮时，button，变input ，通过当前销售属性的 inputVisible控制
      //挂载再销售属性身上，响应式数据inVisible，控制切换  
     
        this.$set(row,'inputVisible',true);
      //通过响应式数据，inputValue 收集新增的销售属性值
        this.$set(row,'inputValue','');
    },
    //button 失去焦点事件
    handleInputConfirm(row){
        
        const {baseSaleAttrId,inputValue} = row ;
        if(inputValue.trim() == ''){
          this.$message('属性值不能为空')
          return;
          //为空则返回，中断编译
        }
        // //属性值重复
        let result = row.spuSaleAttrValueList.every(item=> item.saleAttrValueName != inputValue)
        //已有的属性值 不等于  收集的输入属性值  为true 
      
        if(!result) return this.$message('属性值重复');
        //如果false ,代表有重复值 返回 中断，不执行下方推入新数组语句
        
        //结构当前所需传递元素，整理为新对象KV一致者，省略V  推入展示数组 更行数据自动渲染
        let newSaleAttrValue  = {baseSaleAttrId,saleAttrValueName:inputValue};
        row.spuSaleAttrValueList.push(newSaleAttrValue);

        row.inputVisible = false;

    },
  //保存 属性按钮
   async addOrUpdateSpu(){
     this.spu.spuImageList = this.spuImage.map(item=>{
        return{
          //照片墙新增图片没有imageUrl 属性，所以需要重新整理数据，再发送给服务器。
          
        imageName:item.name,
        imageUrl:(item.response&&item.response.data) || item.url
      }
      });
      //发送，更新后台数据
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code == 200){
          this.$message({type:'success',message:'保存成功'})
          //返回场景0
          this.$emit('changeScene',{scene:0,flag:this.spu.id?'edit':'add'});
      }
      //清除数据
       Object.assign(this._data,this.$options.data());
    },
   
   //添加新属性按钮  触发请求 可选属性及品牌获取
 
    async addSpuData(category3Id){
           //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
       //获取平台，全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
      this.spu.category3Id = category3Id
    },

    //取消按钮
    cancel(){
      this.$emit('changeScene', {scene:0,flag:''});
      Object.assign(this._data,this.$options.data());
      //初始化的配置对象，data() 返回的，覆盖到响应式的数据（动态变化中的），起初始化数据作用

    }


   
  },

  computed:{
    //还未选择的销售属性
    unSelectAttr(){
      return this.saleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(item1 =>{
          return item.name != item1.saleAttrName
        })
      })
    }
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

