<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "progressChart",
  mounted() {
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        min:0,
        max:100
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: ['78'],
          color:'lightgreen',
          barWidth:10,
           label:{
            show:true,
             formatter:'|',
          
              position:'right'

           }
          
          }
          
      ],
       grid: {
        //布局
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
  
   
     
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
