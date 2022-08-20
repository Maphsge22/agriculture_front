<template>
  <div id="TbCell">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-s-order"></i> 阈值查询
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true" model="formdata">
          <el-form-item>
            <el-select v-model="select.type" clearable placeholder="查询依据">
              <el-option label="设备ID" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!--  下面v-if的1 和label="设备ID" :value="1" 的value这个1对应 -->
            <el-select
                v-model="query.equipId"
                v-if="select.type === 1"
                placeholder="设备ID"
                @change="handleSearch"
            >
              <el-option
                  v-for="item in equipmentId"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-button
              type="info"
              icon="el-icon-refresh"
              class="button"
              @click="getData"
          >刷新
          </el-button
          >
          <el-button type="primary" icon="el-icon-edit" @click="showForm">添加 / 修改</el-button>
          <!--          <el-button type="primary" icon="el-icon-edit" @click="dialogFormVisible = true"></el-button>-->
          <!--          <el-button type="primary" @click= "addBatch()">保存全部</el-button>-->

        </el-form>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
<!--        <el-table-column-->
<!--            type="selection"-->
<!--            width="55"-->
<!--            align="center"-->
<!--        ></el-table-column>-->
        <el-table-column
            prop="id"
            label="设备ID"
            width="105"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="areaId"
            label="区域ID"
            width="105"
            align="center"
        ></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column prop="tempMax" label="温度最大值" align="center"></el-table-column>
        <el-table-column prop="humiMax" label="湿度最大值" align="center"></el-table-column>
        <el-table-column prop="tempMin" label="温度最小值" align="center"></el-table-column>
        <el-table-column prop="humiMin" label="湿度最小值" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
                type="text"
                icon="el-icon-edit"
                class="green"
                @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--   下面的是element-ui官网的源代码。-->
    <!-- 有一个代码版本的(vue3.x)原本有个template标签，但是被我删了才正常显示;-->
    <!--    使用 <template> 标签在页面加载时该标签中的内容不会显示，加载后可以使用 JavaScript 来显示它-->
    <el-dialog v-model="dialogFormVisible" title="新增一个阈值信息">
      <el-form :model="form">
        <el-form-item label="设备ID" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="区域ID" :label-width="formLabelWidth">
          <el-input v-model="form.area" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="温度最大值" :label-width="formLabelWidth">
          <el-input v-model="form.tempMax" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="湿度最大值" :label-width="formLabelWidth">
          <el-input v-model="form.humiMax" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="温度最小值" :label-width="formLabelWidth">
          <el-input v-model="form.tempMin" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="湿度最小值" :label-width="formLabelWidth">
          <el-input v-model="form.humiMin" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addRow()"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>


  </div>
</template>

<!--之前的项目中，下一行的标签只是script，有一个element-ui的模板(vue3.x)需要写lang="ts" setup，否则报错-->
<script>
import {BACKEND} from "@/utils/backend";
import request from "../utils/request.js";

export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        area: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        tempMax: '',
        tempMin: '',
        humiMax: '',
        humiMin: ''
      },
      formLabelWidth: '120px',
      tableData: [],
      query: {
        equipId: ""
      },
      select: {type: ""},
      table: {data: [], hidden: true},
      equipmentId: [],
      roleInfo: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {   // 你自己自定义的那些函数要写在这里面！！
    showForm() {
      this.dialogFormVisible = true;
      // this.form.name = "dollar";
    },
    addRow() {
      // console.log(this.form.humiMin);
      request({
        url: `${BACKEND}/dataservice/value/editValue?id=${this.form.name}&areaId=${this.form.area}&desc=${this.form.desc}&tempMax=${this.form.tempMax}&tempMin=${this.form.tempMin}&humiMax=${this.form.humiMax}&humiMin=${this.form.humiMin}`,
        method: "post",
      }).then((response) => {
        if (response.success) {
          this.tableData = response.data.list;
          this.$message({
            message: "编辑成功",
            type: "success",
          });

        } else {
          this.$message.error(response.message);
        }
      });
      this.dialogFormVisible = false;
      console.log(this.query.equipId);
      // this.getData();
      // setTimeout(this.handleSearch(),3000);
    },
    // 多选操作
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    // },
    getData() {
      request({
        url: `${BACKEND}/dataservice/value/valueList`,
        method: "get",
      }).then((response) => {
        if (response.success) {
          this.equipmentId = [];
          let len = response.data.list.length;
          for (let i = 0; i < len; i++) {
            this.equipmentId.push({
              value: response.data.list[i].id,
              label: response.data.list[i].id,
            });
          }
        } else {
          this.$message.error(response.message);
        }
      });
    },
    handleSearch() {
      request({
        url: `${BACKEND}/dataservice/value/valueInfo?id=${this.query.equipId}`,
        method: "get",
      }).then((response) => {
        if (response.success) {
          this.tableData = response.data.list;
          console.log(response.data);
          console.log("查询成功");
        } else {
          this.$message.error(response.message);
        }
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
                url: `${BACKEND}/dataservice/value/delete?id=${this.tableData[index].id}`,
                method: "delete",
              }).then(() => {
                this.$message.success("删除成功");
                this.tableData.splice(index, 1);
              })
          )
          .catch(() => {
          });
    },
    handleEdit(index) {
      this.dialogFormVisible = true;
      this.form.name = this.tableData[index].id;
      this.form.area = this.tableData[index].areaId;
      this.form.desc = this.tableData[index].description;
      this.form.tempMax = this.tableData[index].tempMax;
      this.form.tempMin = this.tableData[index].tempMin;
      this.form.humiMax = this.tableData[index].humiMax;
      this.form.humiMin = this.tableData[index].humiMin;
    },
    //     先调用按钮修改dialogFormVisible为true
    // 才能打开弹窗
    // 添加用户

  },
};
</script>

<style scoped>
.el-button--text {
  margin-right: 15px;
}

.el-select {
  width: 300px;
}

.el-input {
  width: 300px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

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
