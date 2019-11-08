<template>
  <div>
    <el-table :data="tableData" v-loading="tableLoading" style="width: 100%" stripe border>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="页面名称" width="180" align="center">
        <el-table-column prop="name" width="180" align="center">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" placeholder="输入名称搜索" clearable />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="页面 ID" align="center">
        <el-table-column prop="id" width="180" align="center">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" placeholder="输入 ID 搜索" clearable />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="创建者" align="center">
        <el-table-column prop="creater_name" width="180" align="center">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" placeholder="输入创建者搜索" clearable />
            <el-select v-model="form.permission" placeholder="请选择页面编辑权限">
              <el-option label="本人" title="private" :value="0"></el-option>
              <el-option label="同组" title="internal" :value="1"></el-option>
              <el-option label="所有" title="public" :value="2"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="有效期" align="center">
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <el-date-picker
              v-model="form.expiry"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </template>
          <template slot-scope="scope">
            {{ scope.row.expiry_start | parseTime }}
            <i class="el-icon-timer"></i>
            {{ scope.row.expiry_end | parseTime }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <el-table-column align="center" width="260">
          <template slot="header" slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-search"
              circle
              plain
              @click="handleSearch"
              title="搜索"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-close"
              circle
              plain
              @click="handleClear"
              title="清空"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-plus"
              round
              plain
              @click="handleCreateNewPage"
            >新建页面</el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="text" @click="handleSearch">配置</el-button>
            <!-- <el-popover placement="top" width="160" v-model="deleteConfirmVisible">
              <p>确认删除页面？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="deleteConfirmVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deletedConfirmClick">确定</el-button>
              </div>
              <el-button slot="reference" type="text" @click="handleClear">删除</el-button>
            </el-popover>-->
            <el-button type="text" @click="handleEditorEntry(scope.row.id)">
              进入编辑器
              <i class="el-icon-d-arrow-right"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.page"
        :page-size="pagination.pageSize"
        layout="prev, pager, next, jumper"
        :total="pagination.pageTotal"
      ></el-pagination>
    </div>
    <el-dialog title="新建页面" :visible.sync="dialogNewPageVisible" :close-on-click-modal="false">
      <el-form ref="createPageForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="页面名称" prop="name">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="页面创建者" prop="creater_name">
          <el-input v-model="form.creater_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="页面编辑权限" prop="permission">
          <el-select v-model="form.permission" placeholder="请选择页面编辑权限">
            <el-option label="私人" title="private" :value="0"></el-option>
            <el-option label="组内" title="internal" :value="1"></el-option>
            <el-option label="公开" title="public" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面有效时间" prop="expiry">
          <el-date-picker
            v-model="form.expiry"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="页面备注">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm('createPageForm')">立即创建</el-button>
          <el-button @click="resetForm('createPageForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { reqGetPageList, reqCreatePage } from "@api/page";
/*
const (
	Private  permission = iota // 0 私人
	Internal                   // 1 组内
	Public                     // 2 公开
)
*/
export default {
  data() {
    return {
      search: "",
      currentPage: 1,
      deleteConfirmVisible: false,
      dialogNewPageVisible: false,
      tableLoading: false,
      tableData: [],
      form: {
        name: "年度盛典",
        creater_name: "ped",
        expiry: null,
        expiry_start: "",
        expiry_end: "",
        permission: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ],
        permission: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        expiry: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      },
      pagination: {
        page: 1,
        pageSize: 10,
        pageTotal: 0
      }
    };
  },
  created() {
    this.reloadTableData();
  },
  methods: {
    handleSearch() {},
    deletedConfirmClick() {
      this.deleteConfirmVisible = false;
    },
    reloadTableData() {
      this.tableLoading = true;
      reqGetPageList(this.pagination).then(res => {
        this.tableLoading = false;
        this.tableData = res.data.pageList;
        this.pagination.pageTotal = res.data.pageTotal;
      });
    },
    handleClear() {},
    handleEditorEntry(pageID) {
      window.open(`${location.origin}/editor?id=${pageID}`, "_blank");
    },
    handleCreateNewPage() {
      this.dialogNewPageVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.expiry_start = this.form.expiry[0];
          this.form.expiry_end = this.form.expiry[1];
          reqCreatePage(this.form).then(res => {
            if (res.code === 0) {
              this.resetForm("createPageForm");
              this.dialogNewPageVisible = false;
              this.$message({
                message: "创建成功",
                type: "success"
              });
              this.reloadTableData();
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCurrentChange() {
      this.reloadTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  text-align: center;
  padding-top: 20px;
}
</style>
