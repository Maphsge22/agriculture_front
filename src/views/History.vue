<template>
  <div id="Account">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-user-solid"></i> 历史数据分析
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true" model="formdata"
        >
          <el-button
              type="danger"
              icon="el-icon-delete"
              class="handle-del mr10"
              @click="delAllSelection"
          >批量删除
          </el-button
          >

          <el-button
              type="info"
              icon="el-icon-refresh"
              class="button"
              @click="getData"
          >刷新
          </el-button
          >
        </el-form>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            width="55"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="equipmentId"
            label="设备ID"
            width="105"
            align="center"
        ></el-table-column>
        <el-table-column prop="recordTime" label="采集时间" width="225" align="center"></el-table-column>
        <el-table-column prop="temp" label="温度" align="center"></el-table-column>
        <el-table-column prop="humidity" label="湿度" align="center"></el-table-column>
        <el-table-column prop="motor" label="电机" align="center"></el-table-column>
        <el-table-column prop="valve" label="水阀" align="center"></el-table-column>

        <!-- <el-table-column prop="date" label="注册时间"></el-table-column> -->
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {BACKEND} from "../utils/backend";
import request from "../utils/request";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      idx: -1,
      id: -1,
      currentDate: new Date(),

    };
  },
  created() {
    // console.log("hahaha");  //  这个会在浏览器f12的控制台中输出
    this.getData();
  },
  methods: {
    getData() {
      request({
        url: `${BACKEND}/dataservice/history/historyList`,
        method: "get",
      }).then((res) => {
        this.tableData = res.data.list;
        this.pageTotal = 1;
      });
    },
    handleDelete(index) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() =>
              request({
                url: `${BACKEND}/dataservice/history/delete?equipmentId=${this.tableData[index].equipmentId}&recordTime=${this.tableData[index].recordTime}`,
                method: "delete",
              }).then(() => {
                this.$message.success("删除成功");
                this.tableData.splice(index, 1);
              })
          )
          .catch(() => {
          });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    delAllSelection() {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.multipleSelection.forEach((item) =>
                request({
                  url: `${BACKEND}/dataservice/history/delete?equipmentId=${item.equipmentId}&recordTime=${item.recordTime}`,
                  method: "delete",
                })
            );
            this.$message.success(`正在处理`);
            setTimeout(() => {
              this.$message.success(`操作完成`);
              this.multipleSelection = [];
              this.getData();
            }, 500);
          })
          .catch(() => {
          });
    },
  },
};
</script>

<style scoped>
.option-card {
  height: 250px;
  width: 230px;
}

#title {
  margin-top: 30px;
}

#upload {
  margin-top: 100px;
}

#main,
#body {
  position: relative;
  top: 50px;
  left: 5%;
  right: 5%;
}

.hrefButton {
  position: absolute;
  right: 10px;
  bottom: 0px;
}

.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.green {
  color: #67c23a;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
