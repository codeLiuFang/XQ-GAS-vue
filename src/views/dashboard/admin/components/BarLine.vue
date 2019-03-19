<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '1730px'
    },
    height: {
      type: String,
      default: '290px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    setOptions({ xAxisData, yAxisData, yAxisData1, yAxisData2, yAxisData3, yDept, legendValue } = {}) {
      // console.log(legendValue)
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            // console.log(JSON.stringify(params))
            var htmlStr = ''
            console.log(params)
            for (var i = 0; i < params.length; i++) {
              // console.log(params)
              var param = params[i]
              var xName = param.name // x轴的名称
              var seriesName = param.seriesName // 图例名称
              var color = param.color // 图例颜色
              if (i === 0) {
                htmlStr += xName + '<br/>'
              }
              htmlStr += '<div>'
              // 为了保证和原来的效果一样，这里自己实现了一个点的效果
              htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>'
              if (i === 0) {
                htmlStr += seriesName + '：' + param.value
              }
              if (i === 1) {
                var value2 = yAxisData1.showTootip[param.dataIndex]
                htmlStr += seriesName + '：' + value2 + '℃'
              }
              if (i === 2) {
                var value1 = yAxisData2.showTootip[param.dataIndex]
                htmlStr += seriesName + '：' + value1 + '%'
              }
              if (i === 3) {
                var value3 = yAxisData3.showTootip[param.dataIndex]
                htmlStr += seriesName + '：' + value3 + '级'
              }
              htmlStr += '</div>'
            }
            return htmlStr
          }
        },
        legend: {
          icon: 'rect',
          x: 'right',
          top: '10px',
          left: '1200px',
          data: legendValue,
          textStyle: {
            color: '#fff',
            fontSize: 18
          }
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: '12' }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: yDept.min,
            max: yDept.max,
            interval: yDept.interval,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: '12' }
            },
            splitLine: { show: false },
            splitArea: { show: false }
          }
          // {
          //   type: 'value',
          //   min: 0,
          //   max: 12,
          //   interval: 1,
          //   axisLabel: {
          //     formatter: '{value} 级',
          //     textStyle: {
          //       color: '#fff',
          //       fontSize: '12' }
          //   },
          //   splitLine: { show: false },
          //   splitArea: { show: false }
          // }
        ],
        series: [
          {
            name: yAxisData.name,
            type: 'bar',
            barWidth: 20,
            data: yAxisData.value,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#aeff00'
                },
                { offset: 1, color: '#092a4d' }])
              }
            }
          },
          {
            name: yAxisData1.name,
            type: 'line',
            // yAxisIndex: 1,
            data: yAxisData1.value,
            itemStyle: {
              normal: {
                color: '#ff1e00'
              }
            }
          },
          {
            name: yAxisData2.name,
            type: 'line',
            // yAxisIndex: 1,
            data: yAxisData2.value,
            itemStyle: {
              normal: {
                color: '#ffd950'
              }
            }
          },
          {
            name: yAxisData3.name,
            type: 'line',
            // yAxisIndex: 1,
            data: yAxisData3.value,
            itemStyle: {
              normal: {
                color: '#00d2ff'
              }
            }
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
