<template>
  <el-card class="box-card" style="margin: 10px 0px">
    <div slot="header" class="clearfix">
      <!-- @tab-click="handleClick" -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!--  v-model="value1" -->
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </el-date-picker>
      </div>
    </div>
    <!-- 下方显示数据 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器准备 -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6" class="right"> 
          
          <div >
            <h3>门店{{title}}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">123</span>
              </li>
              <li>
                 <span class="rindex">2</span>
                <span>肯德基</span>
                <span class="rvalue">123</span>
              </li>
              <li>
                 <span class="rindex">3</span>
                <span>肯德基</span>
                <span class="rvalue">123</span>
              </li>
              <li>
                 <span >4</span>
                <span>肯德基</span>
                <span class="rvalue">123</span>
              </li>
              <li>
                 <span >5</span>
                <span>肯德基</span>
                <span class="rvalue">123</span>
              </li>
              <li>
                 <span >6</span>
                <span>肯德基</span>
                <span class="rvalue">123</span>
              </li>
              
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import dayjs from "dayjs";
import * as echarts from "echarts";
import {mapState} from 'vuex'
export default {
  name: "",
  data() {
    return {
      activeName: "sale",
      mycharts:null,
      date:[]
    };
  },
  computed:{
    //标题计算属性
    title(){
      return  this.activeName == 'sale'?'销售额':'访问量' 
    },
    //mock数据 listState ：通过,获取到仓库 store.state .home仓库 的list数据 计算得出  
    ...mapState({
      listState:state=>state.home.list
      
    })
  },
  watch:{
    title(){
        this.mycharts.setOption({
          title:{
            text:this.title
          },
           xAxis: [{
            data:this.title =='销售额'?this.listState.orderFullYearAxis:this.listState.userFullYearAxis
           }],
            series: [
          {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.title =='销售额'?this.listState.orderFullYear:this.listState.userFullYear,
          color:'yellowgreen'
        },
      ],
        })
    },
    listState(){
            this.mycharts.setOption({
        
        xAxis: [
          {
            data: this.listState.orderFullYearAxis,
          },
        ],
        series: [
          {
            data:this.listState.orderFullYear,
          },
        ],
      })
      }
    },
  mounted() {
   
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title:{
        text: this.title +"趋势"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        { 
          axisLine:{
            show:true
            },
           axisTick:{
            show:true
           },
          type: "value",
        },
      ],
     
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
          color:'yellowgreen'
        },
      ],
    });
  },
  methods:{
    //今日
    setDay(){
      const day = dayjs().format('YYYY-MM-DD');
      this.date = [day,day]
    },
    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start,end]
    },
    setMonth(){
      const start =dayjs().startOf('month').format('YYYY-MM-DD')
      const end =dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start,end]
    },
    setYear(){
         const start =dayjs().startOf('year').format('YYYY-MM-DD')
         const end =dayjs().endOf('year').format('YYYY-MM-DD')
         this.date = [start,end]
    }
  }
};
</script>

<style scoped>

.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  
  position: absolute;
  right: 0;
}
.right span{
  margin: 0 10px;
}
.date {
  width: 250px;
  margin:0 20px; 
}
.charts {
  width: 100%;
  height: 300px;
}
ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li{
  height: 8%;
}
.rindex{
  float: left;
  width: 20px;
  height:20px;
  background: black;
  border-radius: 50%;
  color: white;
  text-align: center;

}
.rvalue{
  float: right;
}

</style>
