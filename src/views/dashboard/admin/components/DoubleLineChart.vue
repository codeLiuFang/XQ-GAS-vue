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
      default: '1750px'
    },
    height: {
      type: String,
      default: '350px'
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
    setOptions({ xAxisData, yAxisData1, yAxisData2, yAxisData3 } = {}) {
      // console.log(xAxisData, yAxisData1, yAxisData2)
      this.chart.setOption({
        xAxis: {
          data: xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: '12'
            },
            interval: 0,
            rotate: 50
          }
        },
        grid: {
          // left: 10,
          // right: 10,
          // bottom: 20,
          // top: 30,
          // containLabel: true
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false },
          splitArea: { show: false },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: '12' }
          }
        },
        legend: {
          icon: 'circle',
          color: ['#ff1e00', '#ffd950', '#00d2ff'],
          data: [yAxisData2.y, yAxisData1.y, yAxisData3.y],
          x: 'right',
          top: '0px',
          left: '1200px',
          textStyle: {
            color: '#fff',
            fontSize: 18
          }
        },
        series: [{
          name: yAxisData1.y, itemStyle: {
            normal: {
              color: '#ff1e00',
              lineStyle: {
                color: '#ff1e00',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: yAxisData1.value,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: yAxisData2.y,
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#ffd950',
              lineStyle: {
                color: '#ffd950',
                width: 2
              }
              // areaStyle: {
              //   color: '#f3f8ff'
              // }
            }
          },
          data: yAxisData2.value,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: yAxisData3.y,
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#00d2ff',
              lineStyle: {
                color: '#00d2ff',
                width: 2
              }
              // areaStyle: {
              //   color: '#f3f8ff'
              // }
            }
          },
          data: yAxisData3.value,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
