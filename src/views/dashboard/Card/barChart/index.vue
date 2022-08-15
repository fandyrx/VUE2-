<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "barChart",
  mounted() {
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        data:['人数','金额','示例','示例','示例','示例','示例'],
        type: "category",
      
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [20, 18, 80, 50, 80, 54, 99],
          color:'skyblue'
        
          }
          
      ],
       grid: {
        //布局
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip:{}
   
     
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
  
}
</style>
