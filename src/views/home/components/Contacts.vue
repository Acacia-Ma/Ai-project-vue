<template>
    <div>
        <!-- 部门树形结构位于左侧 -->
        <el-tree
            :data="data"
            :render-content="renderContent"
            :props="{ label: 'label', children: 'children' }"
            node-key="id"
            :default-expanded-keys="[1]"
            :expand-on-click-node="false"
            :indent="16"
            class="tree"
        ></el-tree>
        <!-- 部门信息显示位于右侧 -->
        <div class="info">
            <h3>部门信息</h3>
            <el-form label-width="80px">
                <el-form-item label="部门名称">
                    <el-input v-model="data[0].label"></el-input>
                </el-form-item>
                <el-form-item label="部门人数">
                    <el-input v-model="data[0].children.length"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <!-- 部门人员信息显示位于右侧 -->
        <div class="info">
            <h3>部门人员信息</h3>
            <el-table :data="data[0].children" style="width: 100%">
                <el-table-column prop="label" label="姓名"></el-table-column>
                <el-table-column prop="id" label="工号"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
 
let id = 1000;
const data = ref([
    {
        id: 1,
        label: '一级 1',
        children: [
            {
                id: 4,
                label: '二级 1-1',
                children: [
                    {
                        id: 9,
                        label: '三级 1-1-1'
                    },
                    {
                        id: 10,
                        label: '三级 1-1-2'
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        label: '一级 2',
        children: [
            {
                id: 5,
                label: '二级 2-1'
            },
            {
                id: 6,
                label: '二级 2-2'
            }
        ]
    },
    {
        id: 3,
        label: '一级 3',
        children: [
            {
                id: 7,
                label: '二级 3-1'
            },
            {
                id: 8,
                label: '二级 3-2'
            }
        ]
    }
])
 
// 添加
function append(data) {
    const newChild = { id: id++, label: 'testtest', children: [] };
    if (!data.children) {
        data.children = []
    }
    data.children.push(newChild);
}
 
// 删除
function remove(node, data) {
    const parent = node.parent;
    const children = parent.data.children || parent.data;
    const index = children.findIndex(d => d.id === data.id);
    children.splice(index, 1);
}
 
// 编辑
function edit(data) {
    ElMessageBox.prompt('请输入标题', '编辑', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(({ value }) => {
        if (value != null) {
            data.label = value;
        }
    }).catch(() => { });
}
 
// 按钮渲染
function renderContent(h, { node, data, store }) {
    return h(
        "div",
        {
            class: "custom-tree-node",
            style: { width: '100%', display: "flex", justifyContent: "space-between" } // 设置父元素的样式
        },
        [
            h(
                "span",
                {
                    class: "node-label",
                    style: { flex: "1" } // 设置节点名称的样式，使其占据剩余空间
                },
                node.label
            ),
            h(
                "div",
                { class: "action-links" },
                [
                    h(
                        "a",
                        {
                            onClick: () => append(data),
                            style: { marginLeft: "50px", color: "#3c92fc" } // 设置添加按钮的样式，设置左边距
                        },
                        " 添加 "
                    ),
                    h(
                        "a",
                        {
                            onClick: () => edit(data),
                            style: { marginLeft: "10px", color: "#3c92fc" } // 设置编辑按钮的样式，设置左边距
                        },
                        " 编辑 "
                    ),
                    h(
                        "a",
                        {
                            onClick: () => remove(node, data, store),
                            style: { marginLeft: "10px", color: "#fd181d" } // 设置删除按钮的样式，设置左边距
                        },
                        " 删除 "
                    ),
 
                ]
            )
        ]
    );
}
 
</script>

<style scoped>
</style>