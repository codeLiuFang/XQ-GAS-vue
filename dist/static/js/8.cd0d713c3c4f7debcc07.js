webpackJsonp([8],{"1FVd":function(a,t,e){var s=e("8qRK");"string"==typeof s&&(s=[[a.i,s,""]]),s.locals&&(a.exports=s.locals);e("rjj0")("7e1c772a",s,!0)},"8qRK":function(a,t,e){(a.exports=e("FZ+f")(!1)).push([a.i,"\n.pstyle[data-v-c5a3ec50] {\r\n    position: absolute;\r\n    /* top: 135%; */\r\n    /* left: 10%; */\r\n    margin-left: 15px;\n}\n.fbody[data-v-c5a3ec50] {\r\n    position: relative;\n}\n.gtable[data-v-c5a3ec50]{\r\n    width:90%; \r\n    border: 1px solid #d7dde9; \r\n    margin-left: 15px;\r\n    margin-top: 20px;\n}\n.htable[data-v-c5a3ec50]{\r\n    background-color: #f6f6f6;\n}\r\n",""])},elgh:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=e("vLgD"),n={data:function(){return{tableData:[],select:"",pagesize:10,highlightId:-1,currentPage:1,start:1,totalCount:1e3,dateRange:"",companyNamesearch:"",selectStatus:"",radio:"1",options:[{value:"选项1",label:"已填报"},{value:"选项2",label:"未填报"}],value:""}},created:function(){this.loadData(this.currentPage,this.pagesize)},methods:{handleSizeChange:function(a){this.pagesize=a,this.loadData(this.currentPage,this.pagesize)},handleCurrentChange:function(a){this.currentPage=a,this.loadData(this.currentPage,this.pagesize)},formaterAmount:function(a,t){var e=a[t.property];return 0===e?"":e},loadData:function(a,t){var e=this;s.a.get("/gas/plans",{params:{pageNumber:a,pageSize:t}}).then(function(a){if("success"===a.data.msg){for(var t=a.data.data.rows,s=0;s<t.length;s++)t[s].isEdit=!1;e.tableData=t,e.totalCount=a.data.data.total}})},handleEdit:function(a,t){t.isEdit=!0},handleSave:function(a,t){var e=this,n="/companies/"+t.companyId+"/gas/plans",r={estimatedAmount:t.estimatedAmount,reportPerson:""};s.a.post(n,r).then(function(a){"success"===a.data.msg?(e.$message({message:"编辑成功",type:"success"}),e.loadData(e.currentPage,e.pagesize)):e.$message({message:a.data.msg,type:"error"})})},searchByCompanyId:function(){var a=this;if(""===this.companyNamesearch)this.loadData(this.currentPage,this.pagesize);else{var t="/companies/name/"+this.companyNamesearch;s.a.get(t,{params:{pageNumber:pageNumber,pageSize:pageSize}}).then(function(t){if("success"===t.data.msg)if(console.log(t.data.data.rows),t.data.data.rows.length>0){var e="/companies/"+t.data.data.rows[0].id+"/gas/plans";s.a.get(e,{params:{pageNumber:a.pageNumber,pageSize:a.pageSize}}).then(function(t){if("success"===t.data.msg){var e=t.data.data.rows;a.tableData=e,a.totalCount=t.data.data.total}})}else a.tableData=""})}},searchByDate:function(){var a=this;if(""===this.dateRange)this.$message({showClose:!0,message:"请选择日期",type:"warning"});else{var t=this.dateRange,e="/gas/plans/"+t[0]+"~"+t[1];s.a.get(e,{params:{pageNumber:this.pageNumber,pageSize:this.pageSize}}).then(function(t){if("success"===t.data.msg){for(var e=t.data.data.rows,s=0;s<e.length;s++)e[s].isEdit=!1;a.tableData=e,a.totalCount=t.data.data.total}})}},changeStatus:function(a){var t,e=this;if(""!==(t=this.options.find(function(t){return t.value===a}))&&void 0!==t){this.selectStatus=t.label;var n="/gas/plans/status/"+this.selectStatus;s.a.get(n,{params:{pageNumber:this.pageNumber,pageSize:this.pageSize}}).then(function(a){if("success"===a.data.msg){var t=a.data.data.rows;e.tableData=t,e.totalCount=a.data.data.total}})}}}},r={render:function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"pbody"},[e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:4}},[e("el-input",{staticStyle:{"padding-bottom":"10px","margin-left":"15px"},attrs:{placeholder:"请输入单位名称进行查询"},model:{value:a.companyNamesearch,callback:function(t){a.companyNamesearch=t},expression:"companyNamesearch"}})],1),a._v(" "),e("el-col",{attrs:{span:4}},[e("el-button",{attrs:{type:"primary"},on:{click:a.searchByCompanyId}},[a._v("查询")])],1),a._v(" "),e("el-col",{attrs:{span:4}},[e("el-select",{attrs:{placeholder:"请选择"},on:{change:a.changeStatus},model:{value:a.selectStatus,callback:function(t){a.selectStatus=t},expression:"selectStatus"}},a._l(a.options,function(a){return e("el-option",{key:a.value,attrs:{label:a.label,value:a.value}})}))],1),a._v(" "),e("el-col",{attrs:{span:6}},[e("div",{staticClass:"block"},[e("el-date-picker",{attrs:{type:"daterange","start-placeholder":"开始日期","end-placeholder":"结束日期","default-time":["00:00:00","23:59:59"],"value-format":"yyyy-MM-dd"},model:{value:a.dateRange,callback:function(t){a.dateRange=t},expression:"dateRange"}})],1)]),a._v(" "),e("el-col",{attrs:{span:4}},[e("el-button",{attrs:{type:"primary"},on:{click:a.searchByDate}},[a._v("查询")])],1)],1),a._v(" "),e("el-table",{ref:"testTable",staticClass:"gtable",attrs:{data:a.tableData,"header-cell-style":{"background-color":"#f6f6f6"},border:"","default-sort":{prop:"companyName",order:"ascending"}}},[e("el-table-column",{attrs:{prop:"estimatedDate",label:"计划日期",sortable:""}}),a._v(" "),e("el-table-column",{attrs:{prop:"companyName",label:"单位名称","show-overflow-tooltip":""}}),a._v(" "),e("el-table-column",{attrs:{prop:"estimatedAmount",label:"计划用气(元/方)",sortable:""},scopedSlots:a._u([{key:"default",fn:function(t){return[t.row.isEdit?e("el-input",{model:{value:t.row.estimatedAmount,callback:function(e){a.$set(t.row,"estimatedAmount",e)},expression:"scope.row.estimatedAmount"}}):a._e(),a._v(" "),t.row.isEdit?a._e():e("label",[a._v(a._s(0===t.row.estimatedAmount?"":t.row.estimatedAmount))])]}}])}),a._v(" "),e("el-table-column",{attrs:{prop:"realAmount",formatter:a.formaterAmount,label:"实际用气",sortable:""}}),a._v(" "),e("el-table-column",{attrs:{prop:"reportPerson",label:"填报人",sortable:""}}),a._v(" "),e("el-table-column",{attrs:{prop:"reportTime",label:"填报时间","value-format":"yyyy-MM-dd",sortable:""}}),a._v(" "),e("el-table-column",{attrs:{label:"操作"},scopedSlots:a._u([{key:"default",fn:function(t){return[t.row.isEdit?a._e():e("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(e){a.handleEdit(t.$index,t.row)}}},[a._v("填报")]),a._v(" "),""!=t.row.estimatedAmount&&t.row.isEdit?e("el-button",{attrs:{size:"small",type:"warning"},on:{click:function(e){a.handleSave(t.$index,t.row)}}},[a._v("保存")]):a._e()]}}])})],1),a._v(" "),e("el-pagination",{staticClass:"pstyle",attrs:{"current-page":a.currentPage,"page-sizes":[10,20,30,40],"page-size":a.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:a.totalCount},on:{"size-change":a.handleSizeChange,"current-change":a.handleCurrentChange}})],1)},staticRenderFns:[]};var o=e("VU/8")(n,r,!1,function(a){e("1FVd")},"data-v-c5a3ec50",null);t.default=o.exports}});