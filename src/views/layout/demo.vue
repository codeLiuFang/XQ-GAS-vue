<template>

  <div class="bodyImage">
      <div class="tcf">
        <span @click="logout" class="tc" style="display:block;"></span>
      </div>
      
      <div class="gasCount">
        <span style="top:30px;">当年年度用气量</span><br><br>
        <span style="color: #00fffc;text-decoration:underline;font-size: 28px; ">{{gasCount}}</span>
        <span style="font-weight:normal">&nbsp;&nbsp;万方</span>
      </div>
      <div class="weather">
        <span style="left:60px;position: absolute;font-size: 24px;">气象实时信息</span>
        <div class="weaicon"><img :src="weather.weatherCode" /></div>
        <!-- <div class="weatherInfo">
           <div>1°</div>
           <div>西北风3级</div>
           <div>湿度20%</div>
        </div> -->
        <div class="weatherInfo">
          <span class="temp">{{weather.temperatue}}</span><br>
          <span>{{weather.windDirection}}</span>
          <span class="windl">&nbsp;&nbsp;{{weather.windLevel}}&nbsp;&nbsp;</span>级<br>
          <span class="shidu">湿度</span>&nbsp;&nbsp;
          <span class="hum">{{weather.humidity}}</span>
        </div>
      </div>
      <div>
        <span class="yongqishenbao">用气申报批复情况</span>
        <div class="shenbaounit">(单位：万方)</div>
        <ring-chart style="top:570px;left:100px;" class="ring1" :chart-data="ring1ChartData"></ring-chart>
        <!-- <ul class="ul1">
          <li><span>计划量：</span>
            <span>{{applicationAmount}}</span>
          </li>
          <li><span>指标量：</span>
            <span>{{approvalAmount}}</span>
          </li>
          <li><span>差值：&nbsp;</span>
            <span>{{dvalue}}</span>
          </li>
        </ul> -->
        <el-form class="ul1" label-width="80px">
          <el-form-item style="color:#fff" label="计划量：">
            <span>{{applicationAmount}}</span>
          </el-form-item>
          <el-form-item label="指标量：">
            <span>{{approvalAmount}}</span>
          </el-form-item>
          <el-form-item label="差值：">
            <span>{{dvalue}}</span>
          </el-form-item>
        </el-form>
        <ring-month style="top:540px;left:100px;" class="ring2" :chart-data="ring2ChartData"></ring-month>
        <el-form class="ul2" label-width="80px">
          <el-form-item label="计划量：">
            <span>{{applicationAmountMonth}}</span>
          </el-form-item>
          <el-form-item label="指标量：">
            <span>{{approvalAmountMonth}}</span>
          </el-form-item>
          <el-form-item label="差值：">
            <span>{{dvalueMonth}}</span>
          </el-form-item>
        </el-form>
        <!-- <ul class="ul2">
          <li><span>计划量：</span>
            <span>{{applicationAmountMonth}}</span>
          </li>
          <li><span>指标量：</span>
            <span>{{approvalAmountMonth.toFixed(2)}}</span>
          </li>
          <li><span>差值：&nbsp;</span>
            <span>{{dvalueMonth}}</span>
          </li>
        </ul> -->
        <ring-year style="top:520px;left:100px;" class="ring3" :chart-data="ring3ChartData"></ring-year>
        <el-form class="ul3" label-width="80px">
          <el-form-item label="计划量：">
            <span>{{applicationAmountYear}}</span>
          </el-form-item>
          <el-form-item label="指标量：">
            <span>{{approvalAmountYear}}</span>
          </el-form-item>
          <el-form-item label="差值：">
            <span>{{dvalueYear}}</span>
          </el-form-item>
        </el-form>
        <!-- <ul class="ul3">
          <li>
            <span>计划量：</span>
            <span>{{applicationAmountYear}}</span>
          </li>
          <li>
            <span>指标量：</span>
            <span>{{approvalAmountYear.toFixed(2)}}</span>
          </li>
          <li>
            <span>差值：&nbsp;</span>
            <span>{{dvalueYear}}</span>
          </li>
        </ul> -->
      </div>

      <div class="head1">
        <h4 class="title1">全区燃气日用量预测</h4>
        <div class="unit">(单位：万方)</div>
        <div class="todayCount">
          <div id="1" style="top:5px;left:-50px;position: absolute;width:170px;height:50px;white-space: nowrap;text-align:center;">
            <p class="p1">{{realAmount}}</p>
            <span>燃气用量</span>
          </div>
          <div style="top:5px;left:130px;position: absolute;white-space: nowrap;width:170px;height:50px;text-align:center;">
            <p class="p2">{{predictedAmount}}</p>
            <span>模型预测量</span>
          </div>
          <div style="top:5px;left:310px;position: absolute;white-space: nowrap;width:170px;height:50px;text-align:center;">
            <p class="p3">{{staffPredictionAmount}}</p>
            <span>人工预测量</span>
          </div>

        </div>
        <double-line class="headBar" :chart-data="lineChartData"></double-line>
      </div>
      <div class="head2">
        <h4 class="title2">当年度月用气量</h4>
        <!-- <div class="unit2">(单位：万方)</div> -->
        <div style="left:600px;position: absolute;top:10px;" class="hd" id="hd">
          <span style="font-size:18px;white-space: nowrap;width:120px;height:30px;" v-for="(tab ,index) in tabs" :key="tab.value" :class="{current:iscur==index}" @click="iscur=index,tabChange(index + 1)">{{tab.name}}</span>
        </div>

        <!-- <component :chart-data="barLineChartData" v-bind:is="tabView"></component> -->
        <bar-line class="mainBar" :chart-data="barLineChartData"></bar-line>
      </div>
      <div class="head3">
        <el-select size="mini" style="top:22px;left:120px;z-index:9999;width:90px;" v-model="selectCount" @change="changeCount" placeholder="Top 10">
          <el-option size="mini" v-for="item in options" :key="item.value" :label="item.label" :value="item.value" style="height:25px;">
          </el-option>
        </el-select>
        <h4 class="title3">重点企业昨日用气</h4>
        <div class="unit1">(单位：方)</div>
        <double-bar :chart-data="barChartData" class="footerBar"></double-bar>
      </div>

      <!-- <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group> -->

      <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <double-line :chart-data="lineChartData"></double-line>
    </el-row> -->
  </div>

</template>
<script>
import axios from '@/utils/request'
import DoubleLineChart from '../dashboard/admin/components/DoubleLineChart'
import DoubleBar from '../dashboard/admin/components/DoubleBar'
import BarLine from '../dashboard/admin/components/BarLine'
import RingChart from '../dashboard/admin/components/RingChart'
import RingMonth from '../dashboard/admin/components/RingMonth'
import RingYear from '../dashboard/admin/components/RingYear'
// import BarLineMonth from '../dashboard/admin/components/BarLineMonth'
// import BarLineDay from '../dashboard/admin/components/BarLineDay'

export default {
  components: {
    'double-line': DoubleLineChart,
    'double-bar': DoubleBar,
    'bar-line': BarLine,
    'ring-chart': RingChart,
    'ring-month': RingMonth,
    'ring-year': RingYear
    // BarLineMonth,
    // BarLineDay
  },
  data() {
    return {
      tabView: 'BarLine',
      tabs: [{ name: '分钟用气量' }, { name: '日用气量' }, { name: '月用气量' }],
      iscur: 1,
      predictedAmount: '',
      realAmount: '',
      staffPredictionAmount: '',
      applicationAmount: '',
      approvalAmount: '',
      applicationAmountMonth: '',
      approvalAmountMonth: '',
      applicationAmountYear: '',
      approvalAmountYear: '',
      dvalue: '',
      dvalueMonth: '',
      dvalueYear: '',
      gasCount: '',
      value: '',
      selectCount: 'Top 20',
      options: [{
        value: '选项1',
        label: 'Top 20'
      }, {
        value: '选项2',
        label: 'Top 10'
      }],
      barLineChartData: {
        xAxisData: [],
        yAxisData: {
          name: '用气量',
          value: [],
          showTootip: []
        },
        yAxisData1: {
          name: '温度',
          value: [],
          showTootip: []
        },
        yAxisData2: {
          name: '湿度',
          value: [],
          showTootip: []
        },
        yAxisData3: {
          name: '风力',
          value: [],
          showTootip: []
        },
        yDept: {
          min: 0,
          max: 0,
          interval: 0
        },
        legendValue: []

      },
      lineChartData: {
        xAxisData: [],
        yAxisData1: {
          y: '预测值',
          value: []
        },
        yAxisData2: {
          y: '实际值',
          value: []
        },
        yAxisData3: {
          y: '人工预测',
          value: []
        }
      },
      barChartData: {
        xAxisData: [],
        yAxisData1: {
          y: '报备用气量',
          value: []
        },
        yAxisData2: {
          y: '实际用气量',
          value: []
        }
      },
      ring1ChartData: {
        ringData1: '',
        ringData2: ''
      },
      ring2ChartData: {
        ringData1: '',
        ringData2: ''
      },
      ring3ChartData: {
        ringData1: '',
        ringData2: ''
      },
      weather: {
        weatherCode: '',
        temperatue: '',
        windDirection: '',
        windLevel: '',
        humidity: ''
      },
      // 当前时间
      date: new Date(),
      timer: null,
      timer1: null
    }
  },
  mounted() {
    // clearInterval(this.timer)
    const labelelement = document.querySelectorAll('.el-form-item__label')
    const array = Array.from(labelelement)
    Array.from(labelelement).forEach(label => {
      label.style.color = 'white'
      label.style.fontWeight = '500'
      label.style.fontSize = '16px'
    })
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    // if (this.timer1) {
    //   clearInterval(this.timer1)
    // }
  },
  created: function() {
    this.setTimer()
    this.loadData()
    this.getGasCount()
    this.getDayGas()
    this.getApplication()
    this.zuoriCount(this.options[0].label)
    this.getWeather()
  },
  methods: {
    // 退出
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    setTimer: function() {
      this.timer = setInterval(() => {
        // this.date = new Date().getMinutes()
        // var hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
        // var mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
        // this.date = hh + ':' + mm
        // console.log(this.date)
        // if (this.date === '8:10') {
        // 预测折线图
        this.loadData()
        // 年度总用气量
        this.getGasCount()
        // 日用气量
        // this.getDayGas()
        // 申报批复
        this.getApplication()
        // 企业数据
        this.zuoriCount(this.selectCount)
        // 天气
        this.getWeather()
        // 获取分钟日月用气量
        if (this.iscur === 1) {
          this.getDayGas()
        } else if (this.iscur === 0) {
          this.getMinuteGas()
        } else if (this.iscur === 2) {
          this.getMonthGas()
        }
        // }
      }, 300000)
    },
    // 获取年度总量
    getGasCount: function() {
      var url = '/gas/statistics/year'
      axios.get(url).then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data
          this.gasCount = (data.amount).toFixed(2)
        }
      })
    },
    // 申报批复接口
    getApplication: function() {
      axios.get('/gas/application/statistics').then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data.day
          var data1 = response.data.data.month
          var data2 = response.data.data.year
          this.applicationAmount = data.applicationAmount
          this.approvalAmount = data.approvalAmount
          this.dvalue = (this.approvalAmount - this.applicationAmount).toFixed(2)
          this.ring1ChartData.ringData1 = data.applicationAmount
          this.ring1ChartData.ringData2 = data.approvalAmount
          // -------------------------------------------
          this.applicationAmountMonth = data1.applicationAmount
          this.approvalAmountMonth = data1.approvalAmount
          this.dvalueMonth = (this.approvalAmountMonth - this.applicationAmountMonth).toFixed(2)
          this.ring2ChartData.ringData1 = data1.applicationAmount
          this.ring2ChartData.ringData2 = data1.approvalAmount
          // --------------------------------------------
          this.applicationAmountYear = data2.applicationAmount
          this.approvalAmountYear = data2.approvalAmount
          this.dvalueYear = (this.approvalAmountYear - this.applicationAmountYear).toFixed(2)
          this.ring3ChartData.ringData1 = data2.applicationAmount
          this.ring3ChartData.ringData2 = data2.approvalAmount
        }
      })
    },
    // tab切换
    tabChange: function(tab) {
      // 分钟用气量
      if (tab === 1) {
        this.getMinuteGas()
      } else if (tab === 2) {
        this.getDayGas()
      } else if (tab === 3) {
        this.getMonthGas()
      }
    },
    // 分钟用气量
    getMinuteGas: function() {
      // BarLine接口获取
      var url = '/gas/statistics/minute/'
      axios.get(url).then((response) => {
        if (response.data.msg === 'success') {
          this.barLineChartData.yDept.min = 0
          this.barLineChartData.yDept.max = 20000
          this.barLineChartData.yDept.interval = 4000
          this.barLineChartData.xAxisData = []
          this.barLineChartData.yAxisData.value = []
          this.barLineChartData.yAxisData1.value = []
          this.barLineChartData.yAxisData2.value = []
          this.barLineChartData.yAxisData3.value = []
          this.legendValue = []
          this.barLineChartData.legendValue.push('用气量')
          this.barLineChartData.legendValue.push('温度')
          this.barLineChartData.legendValue.push('湿度')
          this.barLineChartData.legendValue.push('风力')
          var data = response.data.data
          for (let i = 0; i < data.length; i++) {
            var xHour = data[i].hour
            var xMin = xHour.substr(xHour.length - 5)
            this.barLineChartData.xAxisData.push(xMin)
            this.barLineChartData.yAxisData.value.push(data[i].gas)
            this.barLineChartData.yAxisData2.value.push(data[i].humidity.standardizedAmount)
            this.barLineChartData.yAxisData2.showTootip.push(data[i].humidity.showAmount)
            this.barLineChartData.yAxisData1.value.push(data[i].temperature.standardizedAmount)
            this.barLineChartData.yAxisData1.showTootip.push(data[i].temperature.showAmount)
            this.barLineChartData.yAxisData3.value.push(data[i].windLevel.standardizedAmount)
            this.barLineChartData.yAxisData3.showTootip.push(data[i].windLevel.showAmount)
          }
        }
      })
    },
    // 日用气量
    getDayGas: function() {
      var url2 = '/gas/statistics/daily/'
      axios.get(url2).then((response) => {
        var data = response.data.data
        this.barLineChartData.yDept.min = 0
        this.barLineChartData.yDept.max = 700000
        this.barLineChartData.yDept.interval = 150000
        this.barLineChartData.xAxisData = []
        this.barLineChartData.yAxisData.value = []
        this.barLineChartData.yAxisData1.value = []
        this.barLineChartData.yAxisData2.value = []
        this.barLineChartData.yAxisData3.value = []
        this.barLineChartData.legendValue = []
        this.barLineChartData.legendValue.push('用气量')
        for (let i = 0; i < data.length; i++) {
          var xDay = data[i].date
          var str = xDay.substr(xDay.length - 5)
          this.barLineChartData.xAxisData.push(str)
          // console.log(data[0].date)
          this.barLineChartData.yAxisData.value.push(data[i].amount)
          // this.barLineChartData.yAxisData1.value.push(data[i].humidity.standardizedAmount)
          // this.barLineChartData.yAxisData2.value.push(data[i].temperature.standardizedAmount)
          // this.barLineChartData.yAxisData3.value.push(data[i].windLevel.standardizedAmount)
        }
      })
    },
    // 月用气量
    getMonthGas: function() {
      this.barLineChartData.yDept.min = 0
      this.barLineChartData.yDept.max = 2000
      this.barLineChartData.yDept.interval = 400
      this.barLineChartData.xAxisData = []
      this.barLineChartData.yAxisData.value = []
      this.barLineChartData.yAxisData1.value = []
      this.barLineChartData.yAxisData2.value = []
      this.barLineChartData.yAxisData3.value = []
      this.barLineChartData.legendValue = []
      this.barLineChartData.legendValue.push('用气量')
      var url3 = '/gas/statistics/month/'
      axios.get(url3).then((response) => {
        var data = response.data.data
        for (let i = 0; i < data.length; i++) {
          //   var xHour = data[i].hour
          //   var xMin = xHour.substr(8, 2)
          this.barLineChartData.xAxisData.push(data[i].month)
          this.barLineChartData.yAxisData.value.push(data[i].totalAmount)
          //   this.barLineChartData.yAxisData1.value.push(data[i].humidity.standardizedAmount)
          //   this.barLineChartData.yAxisData2.value.push(data[i].temperature.standardizedAmount)
          //   this.barLineChartData.yAxisData3.value.push(data[i].windLevel.standardizedAmount)
        }
      })
    },
    // 重点企业昨日用气量
    changeCount: function(val) {
      var obj = {}
      obj = this.options.find((item) => { return item.value === val })
      if (obj !== '' && obj !== undefined) {
        this.selectCount = obj.label
        var selectedCount = this.selectCount
        // console.log(selectedCount)
        this.zuoriCount(selectedCount)
      }
    },
    // 重点企业昨日用气量
    zuoriCount: function(val) {
      if (val === 'Top 20') {
        val = 20
      } else {
        val = 10
      }
      var url = '/companies/consumption/top/' + val
      axios.get(url).then((response) => {
        if (response.data.msg === 'success') {
          this.barChartData.xAxisData = []
          this.barChartData.yAxisData1.value = []
          this.barChartData.yAxisData2.value = []
          var data = response.data.data
          for (let i = 0; i < data.length; i++) {
            this.barChartData.xAxisData.push(data[i].companyAbbreviation)
            this.barChartData.yAxisData1.value.push(data[i].reportedGasConsumption)
            this.barChartData.yAxisData2.value.push(data[i].dailyPeakOfGasConsumption)
          }
          // console.log(this.barChartData.yAxisData1)
        }
      })
    },
    // logout() {
    //   this.$store.dispatch('FedLogOut').then(() => {
    //     location.reload()
    //   })
    // },
    // 获取天气信息
    getWeather: function() {
      axios.get('/weather/current').then((response) => {
        var getData = response.data.data
        if (getData) {
          this.weather.weatherCode = '../../../static/images/' + getData.weatherCode + '.png'
          this.weather.temperatue = getData.temperature + '°C'
          // this.weather.wind = getData.windDirection + getData.windLevel + '级'
          this.weather.windDirection = getData.windDirection
          this.weather.windLevel = getData.windLevel
          this.weather.humidity = getData.humidity.substr(0, 2) + '%'
          // this.getData.windLevel.style.color = '#02b2df'
        }
      })
    },
    // 折线图
    loadData: function() {
      // kpi值获取
      axios.get('/predictions/current').then((response) => {
        var getData = response.data.data
        this.predictedAmount = getData.predictedAmount
        this.realAmount = getData.realAmount
        this.staffPredictionAmount = getData.staffPredictionAmount
      })
      var url = '/predictions/latest/30'
      axios.get(url).then((response) => {
        // console.log(JSON.parse(JSON.stringify(response.data.data.rows)))
        if (response.data.msg === 'success') {
          var data = response.data.data
          this.lineChartData.xAxisData = []
          this.lineChartData.yAxisData1.value = []
          this.lineChartData.yAxisData2.value = []
          this.lineChartData.yAxisData3.value = []
          // console.log(response.data)
          // this.tableData = data
          // this.totalCount = response.data.data.total
          // console.log(data)
          for (let i = data.length - 1; i >= 0; i--) {
            this.lineChartData.xAxisData.push(data[i].date)
            this.lineChartData.yAxisData1.value.push(data[i].predictedAmount)
            this.lineChartData.yAxisData2.value.push(data[i].realAmount)
            this.lineChartData.yAxisData3.value.push(data[i].staffPredictionAmount)
          }
        }
      })
    }
  }
}
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}

/* .el-select >>> dropdown_list {
  background-color: rgb(18,33,52) ;
} */
/* .el-scrollbar_wrap {
  overflow-x: hidden;
  overflow-y: hidden;
} */
.today1,
.today2,
.today3 {
  display: inline-block;
  width: 180px;
  height: 40px;
  border-right: 2px solid #fff;
}
.today1 {
  border-left: 2px solid #fff;
}
.today1 span {
  display: block;
  text-align: center;
}
.today2 span {
  display: block;
  text-align: center;
}
.today3 span {
  display: block;
  text-align: center;
}

.ul1 .el-form-item__label {
  color: white !important;
}

.el-form-item__label {
  color: white;
  /* text-align: right;
    float: left;
    font-size: 16px !important;
    color:#fff !important;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    font-weight: 500; */
}
.el-select-dropdown__list li span {
  color: #000;
}
.el-select-dropdown__item {
  text-align: center;
  /* background-color: #1d2e41; */
}
.el-select-dropdown__item:hover {
  background-color: #02b2df;
}
.weatherInfo {
  position: absolute;
  color: white;
  left: 130px;
  top: 60px;
  text-align: center;
}
.weatherInfo div {
  line-height: 30px;
}
.temp {
  color: #02b2df;
  font-size: 30px;
}
.windl {
  color: #02b2df;
}
.hum {
  color: #02b2df;
}
.shidu {
  /* position: absolute; */
  left: 0px;
  white-space: nowrap;
}
.todayCount {
  position: absolute;
  font-size: 20px;
  font-weight: normal;
  left: 560px;
}
.yongqishenbao {
  left: 140px;
  top: 500px;
  position: absolute;
  font-size: 24px;
  font-weight: normal;
}
.el-select >>> input {
  background-color: rgb(12, 36, 67);
  text-align: center;
  font-size: 12px;
  color: rgb(246, 248, 250);
  /* color: #ff1e00; */
}
.el-form span {
  font-size: 16px;
}
.ul1 {
  top: 600px;
  left: 230px;
  position: absolute;
}
.ul2 {
  top: 730px;
  left: 230px;
  position: absolute;
}
.ul3 {
  top: 875px;
  left: 230px;
  position: absolute;
}
.p1 {
  /* left: -20px;
  position: relative; */
  text-align: center;
  color: #ffd950;
  font-size: 24px;
  font-weight: bold;
}
.p2 {
  text-align: center;
  color: #ff1e00;
  font-size: 24px;
  font-weight: bold;
}
.p3 {
  text-align: center;
  color: #00d2ff;
  font-size: 24px;
  font-weight: bold;
}
.el-main {
  padding: 0px;
  padding-top: 117px;
  overflow: hidden;
}
.bodyImage {
  /* background: url(../../assets/images/bbgc.png) no-repeat; */
  background-image: url(../../assets/images/bbgc.png);
  background-repeat: no-repeat;
  /* background-size: 1920px 1080px; */
  /* -moz-background-size: 100% 100%; */
  overflow-y: hidden;
  overflow-x: hidden;
  height: 1080px;
  width: 100%; 
}
/* .scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: hidden;
} */
.weather {
  font-size: 20px;
  width: 296px;
  height: 196px;
  left: 100px;
  top: 310px;
  position: absolute;
}
.weaicon {
  position: absolute;
  left: 15px;
  top: 45px;
}
.headBar {
  left: -70px;
  top: 20px;
  position: absolute;
}
.el-option {
  height: 90px;
}
.gasCount {
  font-size: 24px;
  font-weight: normal;
  width: 300px;
  height: 130px;
  left: 80px;
  top: 180px;
  text-align: center;
  position: absolute;
}
.gasYear {
  width: 122px;
  top: 40px;
  left: 20px;
  text-align: center;
  /* font-size: 18px; */
  position: absolute;
  /* font-weight: bold; */
}
h4 {
  text-align: center;
  color: white;
  padding-top: 18px;
}
span {
  color: white;
}
.footerBar {
  left: -70px;
  position: absolute;
  top: 10px;
  /* z-index: normal; */
}
.mainBar {
  left: -70px;
  top: 0px;
  position: absolute;
}
.el-aside {
  margin-top: 160px;
  margin-left: 85px;
}
.title1 {
  position: absolute;
  font-weight: normal;
  font-size: 20px;
  left: 100px;
  top: -8px;
}
.title2 {
  position: absolute;
  font-weight: normal;
  font-size: 20px;
  left: 105px;
  top: -6px;
}
.title3 {
  position: absolute;
  font-weight: normal;
  font-size: 20px;
  left: 250px;
  top: 7px;
}
.head1 {
  top: -360px;
  left: 350px;
  position: relative;
  height: 375px;
  width: 80%;
  overflow: hidden;
}
.head2 {
  top: -360px;
  left: 350px;
  position: relative;
  height: 250px;
  width: 80%;
  overflow: hidden;
}
.head3 {
  top: -350px;
  left: 350px;
  position: relative;
  height: 284px;
  width: 80%;
  overflow: hidden;
}

.el-select {
  width: 116px;
  left: 100px;
  top: 30px;
  /* z-index: 99999; */
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
.el-select .el-input__inner {
  border-color: rgb(246, 248, 250);
  background-color: #1d334a;
  color: rgb(246, 248, 250);
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: rgb(246, 248, 250);
  background-color: #1d334a;
}
/* .el-scrollbar {
  overflow: hidden;
  position: relative;
} */
.hd {
  height: 30px;
  left: 440px;
  position: absolute;
  top: 20px;
  z-index: 100;
}
.hd span {
  display: inline-block;
  width: 90px;
  background-color: #0a5683;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #02b3df;
}
.hd span.current {
  background-color: #02b3df;
}
/* .bd div {
            height: 255px;
            background-color: purple;
            display: none;
        } */
.bd div.current {
  display: block;
}
.shenbaounit {
  position: absolute;
  color: white;
  top: 545px;
  left: 280px;
  font-size: 16px;
}
.unit {
  position: absolute;
  color: white;
  top: 23px;
  left: 300px;
  font-size: 16px;
  overflow: hidden;
}
.unit2 {
  position: absolute;
  color: white;
  top: 26px;
  left: 300px;
  font-size: 16px;
  overflow: hidden;
}
.unit1 {
  left: 430px;
  top: 38px;
  position: absolute;
  color: white;
  font-size: 16px;
  overflow: hidden;
}
.tcf {
  position: relative;
}
.tc {
  width: 100%;
  height: 200px;
  margin-top: 60px;
  position: absolute;
  text-align: center;
  overflow: hidden;
}
</style>
