<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            prop="prop"
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <!-- {{row}}
                                {{$index}} -->
              <el-tag
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
              >
                {{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updataAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>

        <el-table
          style="width: 100%; margin: 20px 0px"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            prop="prop"
            type="index"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                 :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
            ></el-button>
              </el-popconfirm>
            </template>
           
          </el-table-column>
        </el-table>
        <el-button type="primary"  @click = "addOrUpdateAttr"  :disabled="attrInfo.attrValueList.length <1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,

      //新增属性，修改属性收集
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [], //属性值 对象/个
        categoryId: 0,
        categoryLevel: 3, //3级id
        id: 0,
      },
    };
  },
  // methods:{
  //     //获取到数据直接只传数据也行
  //     getCategoryId(test){
  //         this.attrList = test
  //     }
  // }
  methods: {
    //自定义事件回调
    getCategoryId({ categoryId, level }) {
      // 区分ID级别父组件存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
        //
      }
    },
    //获取属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      3;
      this.attrList = result.data;
    },
    //添加属性按钮
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
        //每次添加时，单个元素添加一个控制flag
      });
      this.$nextTick(() => {
            this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //add
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [], //属性值 对象/个
        categoryId: this.category3Id,
        categoryLevel: 3,
        id: 0,
      };
    },

    //updataAttr
    updataAttr(row) {
      
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);
      //引用 clonedeep 深拷贝 创造新对象，数据互不影响
      //Vue 探测不到普通的添加属性，所以要用Set 响应式数据才行。 上面是因为是为响应式数据且 push也实现了数组变更，替换
      this.attrInfo.attrValueList.forEach(item => {
        
           this.$set(item, "flag", false);
      });
     
    },

    //失去焦点事件，切换为查看模式
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message("请输入一个正常属性值");
        return;
      }
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        //item 数组内的元素, row 当前输入元素。
        //1.判断时，需要先把 已有元素中，去掉当前输入 再做对比。
        // row !== item 这个条件就是用于排除自身做对比， 当前输入 即为最后一个索引号的  item数组元素。
        // 只有 row 不等于 item 才执行 里面的判断，是否有相同值，否则自身做对比，始终会返回true
        if (row !== item) {
          //2.当前输入元素 row  与非自身元素 做 以下判断

          return row.valueName == item.valueName; //判断条件，当前输入row元素 等于 数组内元素 ？  符合的话some() 返回 true
        }
      });
      if (isRepeat) return;
      row.flag = false;
    },
    //点击 转编辑模式
    toEdit(row,index) {
      row.flag = true;

      //$nextTick 保证，当节点渲染完毕了，会执行一次。直接focus会因为节点重绘渲染时，节点未存在，而绑定失败
      //$refs[] 为什么用【】 来获取？  index是传参不是数组的元素
      this.$nextTick(() => {
        console.log(this.$refs[index]);
        
        this.$refs[index].focus();
      });
    },

    //气泡悬浮框确认删除属性值
    deleteAttrValue(index){
      //该操作不用发请求，因为删除的是还未存到服务器数据
        this.attrInfo.attrValueList.splice(index,1)
    },
    //save button callback
   async addOrUpdateAttr(){
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item)=>{
          if(item.valueName != ""){
            //添加非空属性值 时，去除自定义的flag属性 ，判断为true返回一个数据到新数组
            delete item.flag;
            return true;
          } 
        })
      try {
        await  this.$API.attr.reqAddAttr(this.attrInfo)
        this.isShowTable = true;
          this.$message({type:'success',message:'保存成功'})
          this.getAttrList();
      } catch (error) {
        
      }
    }
  }
};
</script>

<style></style>
