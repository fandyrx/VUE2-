<template>
  <div>
      <div class="card-header">
        <span>{{title}}</span>
        <svg t="1657952692850" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2254" width="32" height="32"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2255" fill="#cdcdcd"></path></svg>
      </div>
      <div class="card-content">
        {{count}}
      </div>
      <div class="card-charts">
        <slot name="charts"></slot>
      </div>
      <div class="card-footer">
        <slot name="footer"></slot>
      </div>
  </div>
</template>

<script>


export default {
  name:'Detail',
  props:['title','count']
}
</script>

<style>
  .card-header{
    color:rgba(64, 56, 56, 0.336);
    display:flex;
    justify-content: space-between;
  }
  .card-content{
    font-size: 30px;
    padding:10px 0;
  }
  .card-charts{
    height:40px;
  }
  .card-footer{
    border-top :1px solid #eee;
    padding-top:10px
  }
</style>