const { createApp, ref, computed, onMounted, watch, nextTick } = Vue;

const app = createApp({
  setup() {
    const currentMenu = ref('dashboard');
    const loading = ref(false);
    const searchKeyword = ref('');
    const filterStatus = ref('');
    const filterType = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const activeFlowTab = ref('leave');
    const detailDialogVisible = ref(false);
    const createDialogVisible = ref(false);
    const showAlerts = ref(false);
    const currentApplication = ref(null);
    const approveComment = ref('');
    
    const menus = [
      { key: 'dashboard', label: '工作台', icon: 'Odometer' },
      { key: 'applications', label: '申请列表', icon: 'Document' },
      { key: 'flow', label: '审批流程', icon: 'Connection' },
      { key: 'roles', label: '权限角色', icon: 'User' },
      { key: 'logs', label: '操作记录', icon: 'Tickets' },
      { key: 'statistics', label: '数据统计', icon: 'DataLine' }
    ];

    const currentUser = ref(mockData.currentUser);
    const applications = ref(mockData.applications);
    const leaveFlow = ref(mockData.leaveFlow);
    const expenseFlow = ref(mockData.expenseFlow);
    const purchaseFlow = ref(mockData.purchaseFlow);
    const amountRules = ref(mockData.amountRules);
    const roles = ref(mockData.roles);
    const permissionMatrix = ref(mockData.permissionMatrix);
    const operationLogs = ref(mockData.operationLogs);
    const alerts = ref(mockData.alerts);
    const logFilter = ref({ type: '', dateRange: [] });

    const newApplication = ref({
      type: '',
      title: '',
      amount: 0,
      reason: ''
    });

    const alertCount = computed(() => alerts.value.length);

    const stats = computed(() => {
      const total = applications.value.length;
      const pending = applications.value.filter(a => 
        (a.status === 'pending' || a.status === 'processing') && 
        a.currentNode.includes('经理')
      ).length;
      const approved = applications.value.filter(a => a.status === 'approved').length;
      const completionRate = total > 0 ? Math.round((approved / total) * 100) : 0;
      return { total, pending, approved, completionRate };
    });

    const pendingList = computed(() => {
      return applications.value.filter(a => a.status === 'pending' || a.status === 'processing');
    });

    const filteredApplications = computed(() => {
      let result = [...applications.value];
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        result = result.filter(a => 
          a.title.toLowerCase().includes(keyword) ||
          a.applicant.toLowerCase().includes(keyword)
        );
      }
      if (filterStatus.value) {
        result = result.filter(a => a.status === filterStatus.value);
      }
      if (filterType.value) {
        result = result.filter(a => a.type === filterType.value);
      }
      return result;
    });

    const filteredLogs = computed(() => {
      let result = [...operationLogs.value];
      if (logFilter.value.type) {
        result = result.filter(l => l.type === logFilter.value.type);
      }
      return result;
    });

    const getStatusText = (status) => {
      const map = {
        pending: '待审批',
        processing: '审批中',
        approved: '已通过',
        rejected: '已驳回'
      };
      return map[status] || status;
    };

    const getStatusTagType = (status) => {
      const map = {
        pending: 'warning',
        processing: 'primary',
        approved: 'success',
        rejected: 'danger'
      };
      return map[status] || 'info';
    };

    const getTypeTagType = (type) => {
      const map = {
        '请假': 'primary',
        '报销': 'success',
        '采购': 'warning',
        '出差': 'info'
      };
      return map[type] || 'info';
    };

    const getNodeColor = (status) => {
      const map = {
        approved: '#67c23a',
        active: '#409eff',
        pending: '#909399'
      };
      return map[status] || '#909399';
    };

    const getNodeBgColor = (status) => {
      const map = {
        approved: '#f0f9eb',
        active: '#ecf5ff',
        pending: '#f4f4f5'
      };
      return map[status] || '#f4f4f5';
    };

    const getLogType = (type) => {
      const map = {
        create: 'primary',
        approve: 'success',
        reject: 'danger',
        update: 'warning',
        system: 'info'
      };
      return map[type] || 'info';
    };

    const getLogColor = (type) => {
      const map = {
        create: '#409eff',
        approve: '#67c23a',
        reject: '#f56c6c',
        update: '#e6a23c',
        system: '#909399'
      };
      return map[type] || '#909399';
    };

    const getLogTagType = (type) => {
      const map = {
        create: 'primary',
        approve: 'success',
        reject: 'danger',
        update: 'warning',
        system: 'info'
      };
      return map[type] || 'info';
    };

    const getLogTypeName = (type) => {
      const map = {
        create: '创建',
        approve: '审批',
        reject: '驳回',
        update: '修改',
        system: '系统'
      };
      return map[type] || type;
    };

    const canApprove = (app) => {
      return currentUser.value.role === 'department_manager';
    };

    const getCurrentStepIndex = () => {
      if (!currentApplication.value) return 0;
      const nodes = currentApplication.value.flowNodes;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].status === 'process' || nodes[i].status === 'wait') {
          return i;
        }
      }
      return nodes.length;
    };

    const viewApplication = (app) => {
      currentApplication.value = app;
      detailDialogVisible.value = true;
    };

    const viewFlow = (app) => {
      currentApplication.value = app;
      detailDialogVisible.value = true;
    };

    const approveApplication = (app) => {
      currentApplication.value = app;
      approveComment.value = '';
      detailDialogVisible.value = true;
    };

    const quickApprove = (app) => {
      currentApplication.value = app;
      approveComment.value = '';
      detailDialogVisible.value = true;
    };

    const submitApprove = () => {
      if (currentApplication.value) {
        const app = applications.value.find(a => a.id === currentApplication.value.id);
        if (app) {
          const nodes = app.flowNodes;
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].status === 'process') {
              nodes[i].status = 'finish';
              nodes[i].approver = currentUser.value.name;
              nodes[i].time = new Date().toLocaleString();
              if (i + 1 < nodes.length) {
                nodes[i + 1].status = 'process';
                app.currentNode = nodes[i + 1].name;
              } else {
                app.status = 'approved';
                app.currentNode = '已完成';
              }
              break;
            }
          }
        }
        ElementPlus.ElMessage.success('审批通过');
        detailDialogVisible.value = false;
        addLog('approve', `审批通过了申请`, app.id);
      }
    };

    const submitReject = () => {
      if (currentApplication.value) {
        const app = applications.value.find(a => a.id === currentApplication.value.id);
        if (app) {
          app.status = 'rejected';
          app.currentNode = '已驳回';
          const nodes = app.flowNodes;
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].status === 'process') {
              nodes[i].status = 'error';
              nodes[i].approver = currentUser.value.name;
              nodes[i].comment = approveComment.value;
              break;
            }
          }
        }
        ElementPlus.ElMessage.success('已驳回申请');
        detailDialogVisible.value = false;
        addLog('reject', `驳回了申请`, app.id);
      }
    };

    const openCreateDialog = () => {
      newApplication.value = { type: '', title: '', amount: 0, reason: '' };
      createDialogVisible.value = true;
    };

    const submitApplication = () => {
      if (!newApplication.value.type || !newApplication.value.title || !newApplication.value.reason) {
        ElementPlus.ElMessage.warning('请填写完整信息');
        return;
      }
      const id = 'AP' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + 
                 String(applications.value.length + 1).padStart(3, '0');
      const newApp = {
        id,
        title: newApplication.value.title,
        type: newApplication.value.type,
        applicant: currentUser.value.name,
        department: currentUser.value.department,
        amount: newApplication.value.amount || null,
        reason: newApplication.value.reason,
        status: 'pending',
        currentNode: '直属主管审批',
        createTime: new Date().toLocaleString(),
        flowNodes: [
          { name: '提交申请', status: 'finish', approver: currentUser.value.name, time: new Date().toLocaleString() },
          { name: '直属主管审批', status: 'process', approver: '', time: '' },
          { name: '部门经理审批', status: 'wait', approver: '', time: '' },
          { name: 'HR备案', status: 'wait', approver: '', time: '' }
        ]
      };
      applications.value.unshift(newApp);
      createDialogVisible.value = false;
      ElementPlus.ElMessage.success('申请提交成功');
      addLog('create', `提交了${newApplication.value.type}申请`, newApp.id);
    };

    const addLog = (type, action, applicationId = '') => {
      const newLog = {
        id: operationLogs.value.length + 1,
        type,
        user: currentUser.value.name,
        action,
        applicationId,
        time: new Date().toLocaleString(),
        detail: ''
      };
      operationLogs.value.unshift(newLog);
    };

    const handleUserCommand = (command) => {
      if (command === 'logout') {
        ElementPlus.ElMessage.info('退出登录');
      } else if (command === 'profile') {
        ElementPlus.ElMessage.info('个人中心');
      }
    };

    const editRole = (role) => {
      ElementPlus.ElMessage.info(`配置角色: ${role.name}`);
    };

    const initCharts = () => {
      nextTick(() => {
        initTrendChart();
        initTypeChart();
        if (currentMenu.value === 'statistics') {
          initStatisticsCharts();
        }
      });
    };

    const initTrendChart = () => {
      const el = document.querySelector('[ref="trendChart"]');
      if (!el) return;
      const chart = echarts.init(el);
      const data = mockData.charts.trendData;
      chart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: data.months },
        yAxis: { type: 'value' },
        series: [{
          data: data.counts,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
              { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
            ])
          },
          lineStyle: { color: '#667eea', width: 3 },
          itemStyle: { color: '#667eea' }
        }]
      });
    };

    const initTypeChart = () => {
      const el = document.querySelector('[ref="typeChart"]');
      if (!el) return;
      const chart = echarts.init(el);
      const data = mockData.charts.typeData;
      chart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: data
        }]
      });
    };

    const initStatisticsCharts = () => {
      nextTick(() => {
        initMonthlyChart();
        initDeptChart();
        initEfficiencyChart();
        initPassRateChart();
        initAmountChart();
      });
    };

    const initMonthlyChart = () => {
      const el = document.querySelector('[ref="monthlyChart"]');
      if (!el) return;
      const chart = echarts.init(el);
      const data = mockData.charts.monthlyData;
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['已通过', '已驳回', '待审批'] },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: data.months },
        yAxis: { type: 'value' },
        series: [
          { name: '已通过', type: 'bar', data: data.approved, itemStyle: { color: '#67c23a' } },
          { name: '已驳回', type: 'bar', data: data.rejected, itemStyle: { color: '#f56c6c' } },
          { name: '待审批', type: 'bar', data: data.pending, itemStyle: { color: '#e6a23c' } }
        ]
      });
    };

    const initDeptChart = () => {
      const el = document.querySelector('[ref="deptChart"]');
      if (!el) return;
      const chart = echarts.init(el);
      const data = mockData.charts.deptData.sort((a, b) => a.value - b.value);
      chart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: data.map(d => d.name) },
        series: [{
          type: 'bar',
          data: data.map(d => d.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        }]
      });
    };

    const initEfficiencyChart = () => {
      const el = document.querySelector('[ref="efficiencyChart"]');
      if (!el) return;
      const chart = echarts.init(el);
      const data = mockData.charts.efficiencyData;
      chart.setOption({
        tooltip: { trigger: 'axis' },
        radar: {
          indicator: data.map(d => ({ name: d.name, max: 5 }))
        },
        series: [{
          type: 'radar',
          data: [{
            value: data.map(d => 5 - d.avg),
            name: '审批效率',
            areaStyle: { color: 'rgba(102, 126, 234, 0.3)' },
            lineStyle: { color: '#667eea' },
            itemStyle: { color: '#667eea' }
          }]
        }]
      });
    };

    const initPassRateChart = () => {
      const el = document.querySelector('[ref="passRateChart"]');
      if (!el) return;
      const chart = echarts.init(el);
      const data = mockData.charts.passRateData;
      chart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: data.types },
        yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
        series: [{
          type: 'bar',
          data: data.rates,
          barWidth: '50%',
          itemStyle: {
            color: (params) => {
              const colors = ['#67c23a', '#409eff', '#e6a23c', '#909399'];
              return colors[params.dataIndex];
            }
          },
          label: { show: true, position: 'top', formatter: '{c}%' }
        }]
      });
    };

    const initAmountChart = () => {
      const el = document.querySelector('[ref="amountChart"]');
      if (!el) return;
      const chart = echarts.init(el);
      const data = mockData.charts.amountData;
      chart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: data.months },
        yAxis: { type: 'value', axisLabel: { formatter: '¥{value}' } },
        series: [{
          type: 'line',
          data: data.amounts,
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(79, 208, 127, 0.5)' },
              { offset: 1, color: 'rgba(79, 208, 127, 0.05)' }
            ])
          },
          lineStyle: { color: '#4fd07f', width: 3 },
          itemStyle: { color: '#4fd07f' }
        }]
      });
    };

    watch(currentMenu, (newVal) => {
      nextTick(() => {
        if (newVal === 'dashboard') {
          initTrendChart();
          initTypeChart();
        } else if (newVal === 'statistics') {
          initStatisticsCharts();
        }
      });
    });

    onMounted(() => {
      initCharts();
      window.addEventListener('resize', () => {
        document.querySelectorAll('.chart-container').forEach(el => {
          const chart = echarts.getInstanceByDom(el);
          if (chart) chart.resize();
        });
      });
    });

    return {
      currentMenu,
      menus,
      loading,
      searchKeyword,
      filterStatus,
      filterType,
      currentPage,
      pageSize,
      activeFlowTab,
      detailDialogVisible,
      createDialogVisible,
      showAlerts,
      currentApplication,
      approveComment,
      newApplication,
      currentUser,
      applications,
      leaveFlow,
      expenseFlow,
      purchaseFlow,
      amountRules,
      roles,
      permissionMatrix,
      operationLogs,
      alerts,
      logFilter,
      alertCount,
      stats,
      pendingList,
      filteredApplications,
      filteredLogs,
      getStatusText,
      getStatusTagType,
      getTypeTagType,
      getNodeColor,
      getNodeBgColor,
      getLogType,
      getLogColor,
      getLogTagType,
      getLogTypeName,
      canApprove,
      getCurrentStepIndex,
      viewApplication,
      viewFlow,
      approveApplication,
      quickApprove,
      submitApprove,
      submitReject,
      openCreateDialog,
      submitApplication,
      handleUserCommand,
      editRole
    };
  }
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.mount('#app');
