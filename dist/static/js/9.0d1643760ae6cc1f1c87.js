webpackJsonp([9],{"/RoX":function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,"\n.pstyle {\r\n    position: absolute;\r\n    /* top: 135%; */\r\n    /* left: 10%; */\r\n    margin-left: 15px;\n}\n.fbody {\r\n    position: relative;\n}\n.gtable{\r\n    width:90%; \r\n    border: 1px solid #d7dde9; \r\n    margin-left: 15px;\r\n    margin-top: 20px;\n}\n.htable{\r\n    background-color: #f6f6f6;\n}\n.tb-edit .el-input { \r\n  display: none\n}\n.tb-edit .current-row .el-input \r\n{ display: block\n}\n.tb-edit .current-row .el-input+span\r\n { display: none\n}\r\n\r\n",""])},E3x7:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("vLgD"),r={data:function(){return{tableData:[],name:"",select:"",pagesize:10,highlightId:-1,currentPage:1,start:1,totalCount:1e3}},created:function(){this.loadData(this.currentPage,this.pagesize)},methods:{handleSizeChange:function(t){this.pagesize=t,this.loadData(this.currentPage,this.pagesize)},handleCurrentChange:function(t){this.currentPage=t,this.loadData(this.currentPage,this.pagesize)},loadData:function(t,e){var a=this;n.a.get("/predictions",{params:{pageNumber:t,pageSize:e}}).then(function(t){if("success"===t.data.msg){var e=t.data.data.rows;a.tableData=e,a.totalCount=t.data.data.total}})},handleEdit:function(t,e){var a=this,r={id:e.id,staffPredictionAmount:e.staffPredictionAmount};n.a.put("/predictions",r).then(function(t){"success"===t.data.msg?(a.$message({message:"编辑成功",type:"success"}),a.loadData(a.currentPage,a.pagesize)):a.$message({message:t.data.msg,type:"error"})})}}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"pbody"},[a("el-table",{ref:"testTable",staticClass:"gtable tb-edit",attrs:{data:t.tableData,border:"","header-cell-style":{"background-color":"#f6f6f6"},"highlight-current-row":""},on:{"row-click":t.handleCurrentChange}},[a("el-table-column",{attrs:{prop:"date",label:"日期",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{prop:"predictedAmount",label:"分析模型预测用量",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{prop:"realAmount",label:"实际燃气用量",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{prop:"staffPredictionAmount",label:"人工预测用量",sortable:""},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-input",{attrs:{size:"small",placeholder:"请输入内容"},on:{change:function(a){t.handleEdit(e.$index,e.row)}},model:{value:e.row.staffPredictionAmount,callback:function(a){t.$set(e.row,"staffPredictionAmount",a)},expression:"scope.row.staffPredictionAmount"}}),t._v(" "),a("span",[t._v(t._s(e.row.staffPredictionAmount))])]}}])})],1),t._v(" "),a("el-pagination",{staticClass:"pstyle",attrs:{"current-page":t.currentPage,"page-sizes":[10,20,30,40],"page-size":t.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:t.totalCount},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)},staticRenderFns:[]};var s=a("VU/8")(r,o,!1,function(t){a("ePoS")},null,null);e.default=s.exports},ePoS:function(t,e,a){var n=a("/RoX");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("rjj0")("75d629ba",n,!0)}});