<template>

          <el-result
            icon="warning"
            title="404"
            sub-title="你找到页面丢失了，请确认网址是否正确"
          >
            <template #extra>
              <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
            </template>
          </el-result>

</template>