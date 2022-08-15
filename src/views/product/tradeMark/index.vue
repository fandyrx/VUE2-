<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >

    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        prop=""
        label="序号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, index }">
          <img :src="row.logoUrl" alt="s" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updataTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :page-count="7"
      layout=" prev,pager, next, jumper, ->,sizes,total"
      :total="total"
      @current-change="getPageList"
      @size-change="handlerSizeChange"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,

      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 5,
            message: "长度在 2 到 5 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请上传图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      //解构赋值，获取本组件的初始数据参数
      //获取品牌列表的接口
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handlerSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //显示对话框 添加按钮
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改品牌
    updataTradeMark(row) {
      this.dialogFormVisible = true;
      //row是当前品牌信息，从服务器返回的，有ID存在
      // 这样会覆盖掉，即使点取消也修i改了
      // this.tmForm = row;
      this.tmForm = { ...row }; //浅拷贝 才可以
    },
    //添加品牌图片回调
    handleAvatarSuccess(res, file) {
      //res上传成功后返回前端的数据 file上传成功后服务器 返回 前端的数据
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加按钮
    addOrUpdateTradeMark() {
      //验证表单信息是否齐全
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          //成功验证则执行，布尔值

          //点击后不可视，关闭窗口
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            this.getPageList(this.tmForm.id ? this.page : 1); //更新列表,有ID停在此页，否则到1
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

//删除商品
    deleteTradeMark(row){
        this.$confirm(`此操作将删除${row.tmName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
           if(result.code ==200){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getPageList(this.list.length<1?this.page:this.page-1)
        }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
