<template>
  <div
    :class="className"
    :style="{height:height,width:width}"
  ></div>
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
      default: '1750px'
    },
    height: {
      type: String,
      default: '310px'
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
    setOptions({ xAxisData, yAxisData1, yAxisData2 } = {}) {
      // console.log(xAxisData, yAxisData1, yAxisData2)
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#ccc'
            }
          }
        },
        legend: {
          x: 'right',
          top: '10px',
          left: '1200px',
          data: ['报备用气量', '实际用气量'],
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
                fontSize: '12'
              },
              interval: 0
              // rotate: 10
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // min: 0,
            // max: 100000,
            // interval: 20000,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: '12' }
            },
            splitLine: { show: false },
            splitArea: { show: false }
          }
        ],
        series: [
          {
            name: '报备用气量',
            type: 'bar',
            barWidth: 25,
            data: yAxisData1.value,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#00d2ff'
                },
                { offset: 1, color: '#07213f' }])
              }
            }
          },
          {
            name: '实际用气量',
            type: 'bar',
            barWidth: 25,
            data: yAxisData2.value,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#ffd950'
                },
                { offset: 1, color: '#092647' }]),
                lineStyle: {
                  color: '#ffff00',
                  width: 1
                }
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
