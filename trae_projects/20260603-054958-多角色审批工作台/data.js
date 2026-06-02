const mockData = {
  currentUser: {
    id: 1,
    name: '张经理',
    role: 'department_manager',
    department: '技术部'
  },

  applications: [
    {
      id: 'AP20240601001',
      title: '年假申请-张三',
      type: '请假',
      applicant: '张三',
      department: '技术部',
      amount: null,
      reason: '因个人事务需要申请5天年假，时间为6月10日至6月14日',
      status: 'pending',
      currentNode: '部门经理审批',
      createTime: '2024-06-03 09:30:00',
      flowNodes: [
        { name: '提交申请', status: 'finish', approver: '张三', time: '2024-06-03 09:30' },
        { name: '直属主管审批', status: 'finish', approver: '李主管', time: '2024-06-03 10:15' },
        { name: '部门经理审批', status: 'process', approver: '', time: '' },
        { name: 'HR备案', status: 'wait', approver: '', time: '' }
      ]
    },
    {
      id: 'AP20240601002',
      title: '6月出差报销-李四',
      type: '报销',
      applicant: '李四',
      department: '销售部',
      amount: 5680.00,
      reason: '上海出差5天，包含交通、住宿、餐饮等费用',
      status: 'processing',
      currentNode: '财务复核',
      createTime: '2024-06-02 14:20:00',
      flowNodes: [
        { name: '提交申请', status: 'finish', approver: '李四', time: '2024-06-02 14:20' },
        { name: '部门经理审批', status: 'finish', approver: '王总监', time: '2024-06-02 16:00' },
        { name: '财务复核', status: 'process', approver: '', time: '' },
        { name: '总经理审批', status: 'wait', approver: '', time: '' },
        { name: '出纳打款', status: 'wait', approver: '', time: '' }
      ]
    },
    {
      id: 'AP20240601003',
      title: '办公设备采购申请',
      type: '采购',
      applicant: '王五',
      department: '行政部',
      amount: 25000.00,
      reason: '采购10台办公电脑及相关配件，用于新入职员工',
      status: 'approved',
      currentNode: '已完成',
      createTime: '2024-06-01 10:00:00',
      flowNodes: [
        { name: '提交申请', status: 'finish', approver: '王五', time: '2024-06-01 10:00' },
        { name: '部门经理审批', status: 'finish', approver: '赵经理', time: '2024-06-01 11:30' },
        { name: '采购审核', status: 'finish', approver: '孙采购', time: '2024-06-01 14:00' },
        { name: '财务审批', status: 'finish', approver: '钱财务', time: '2024-06-01 15:30' },
        { name: '总经理审批', status: 'finish', approver: '周总', time: '2024-06-01 17:00' }
      ]
    },
    {
      id: 'AP20240601004',
      title: '北京出差申请',
      type: '出差',
      applicant: '赵六',
      department: '市场部',
      amount: null,
      reason: '参加北京行业展会，时间6月15日-6月18日',
      status: 'pending',
      currentNode: '部门经理审批',
      createTime: '2024-06-03 11:00:00',
      flowNodes: [
        { name: '提交申请', status: 'finish', approver: '赵六', time: '2024-06-03 11:00' },
        { name: '部门经理审批', status: 'process', approver: '', time: '' },
        { name: '财务预算审核', status: 'wait', approver: '', time: '' },
        { name: 'HR备案', status: 'wait', approver: '', time: '' }
      ]
    },
    {
      id: 'AP20240501005',
      title: '病假申请-孙七',
      type: '请假',
      applicant: '孙七',
      department: '技术部',
      amount: null,
      reason: '感冒发烧，需要休息2天',
      status: 'rejected',
      currentNode: '已驳回',
      createTime: '2024-05-28 08:30:00',
      flowNodes: [
        { name: '提交申请', status: 'finish', approver: '孙七', time: '2024-05-28 08:30' },
        { name: '直属主管审批', status: 'error', approver: '李主管', time: '2024-05-28 09:15', comment: '项目关键时期，建议改期' }
      ]
    },
    {
      id: 'AP20240501006',
      title: '业务招待费报销',
      type: '报销',
      applicant: '周八',
      department: '销售部',
      amount: 2850.00,
      reason: '招待重要客户用餐费用',
      status: 'approved',
      currentNode: '已完成',
      createTime: '2024-05-25 15:00:00',
      flowNodes: [
        { name: '提交申请', status: 'finish', approver: '周八', time: '2024-05-25 15:00' },
        { name: '部门经理审批', status: 'finish', approver: '王总监', time: '2024-05-25 16:30' },
        { name: '财务复核', status: 'finish', approver: '吴会计', time: '2024-05-26 10:00' },
        { name: '出纳打款', status: 'finish', approver: '郑出纳', time: '2024-05-26 14:00' }
      ]
    },
    {
      id: 'AP20240501007',
      title: '办公用品采购',
      type: '采购',
      applicant: '吴九',
      department: '行政部',
      amount: 3200.00,
      reason: '采购打印纸、墨盒等日常办公用品',
      status: 'approved',
      currentNode: '已完成',
      createTime: '2024-05-20 09:00:00',
      flowNodes: [
        { name: '提交申请', status: 'finish', approver: '吴九', time: '2024-05-20 09:00' },
        { name: '部门经理审批', status: 'finish', approver: '赵经理', time: '2024-05-20 10:30' },
        { name: '采购审核', status: 'finish', approver: '孙采购', time: '2024-05-20 11:30' },
        { name: '财务审批', status: 'finish', approver: '钱财务', time: '2024-05-20 14:00' }
      ]
    },
    {
      id: 'AP20240501008',
      title: '调休申请-郑十',
      type: '请假',
      applicant: '郑十',
      department: '产品部',
      amount: null,
      reason: '上周六加班，申请调休1天',
      status: 'pending',
      currentNode: '直属主管审批',
      createTime: '2024-06-03 16:00:00',
      flowNodes: [
        { name: '提交申请', status: 'finish', approver: '郑十', time: '2024-06-03 16:00' },
        { name: '直属主管审批', status: 'process', approver: '', time: '' },
        { name: 'HR备案', status: 'wait', approver: '', time: '' }
      ]
    }
  ],

  leaveFlow: [
    { name: '申请人提交', role: '员工', timeLimit: '即时', status: 'approved' },
    { name: '直属主管审批', role: '主管', timeLimit: '3天', status: 'approved' },
    { name: '部门经理审批', role: '部门经理', timeLimit: '2天', status: 'active' },
    { name: 'HR备案', role: 'HR', timeLimit: '1天', status: 'pending' }
  ],

  expenseFlow: [
    { name: '申请人提交', role: '员工', timeLimit: '即时', status: 'approved' },
    { name: '部门经理审批', role: '部门经理', timeLimit: '2天', status: 'approved' },
    { name: '财务复核', role: '会计', timeLimit: '3天', status: 'active' },
    { name: '总经理审批', role: '总经理', timeLimit: '2天', status: 'pending' },
    { name: '出纳打款', role: '出纳', timeLimit: '1天', status: 'pending' }
  ],

  purchaseFlow: [
    { name: '申请人提交', role: '员工', timeLimit: '即时', status: 'approved' },
    { name: '部门经理审批', role: '部门经理', timeLimit: '2天', status: 'approved' },
    { name: '采购审核', role: '采购专员', timeLimit: '2天', status: 'approved' },
    { name: '财务审批', role: '财务经理', timeLimit: '2天', status: 'active' },
    { name: '总经理审批', role: '总经理', timeLimit: '3天', status: 'pending' }
  ],

  amountRules: [
    { range: '1000元以下', approver: '部门经理' },
    { range: '1000-5000元', approver: '财务经理' },
    { range: '5000-20000元', approver: '财务总监' },
    { range: '20000元以上', approver: '总经理' }
  ],

  roles: [
    {
      id: 'employee',
      name: '普通员工',
      icon: '👤',
      color: '#409eff',
      description: '可提交申请、查看自己的申请记录',
      permissions: ['提交申请', '查看申请', '撤销申请', '查看审批流']
    },
    {
      id: 'supervisor',
      name: '直属主管',
      icon: '👔',
      color: '#67c23a',
      description: '可审批下属的申请、查看部门申请',
      permissions: ['提交申请', '查看申请', '审批申请', '查看统计', '查看部门申请']
    },
    {
      id: 'department_manager',
      name: '部门经理',
      icon: '🎩',
      color: '#e6a23c',
      description: '可审批部门申请、管理部门权限',
      permissions: ['提交申请', '查看申请', '审批申请', '查看统计', '部门管理', '权限配置']
    },
    {
      id: 'finance',
      name: '财务人员',
      icon: '💰',
      color: '#f56c6c',
      description: '可审批财务相关申请、查看财务数据',
      permissions: ['查看申请', '财务审批', '查看财务数据', '导出报表', '预算管理']
    },
    {
      id: 'hr',
      name: 'HR专员',
      icon: '📋',
      color: '#909399',
      description: '可审批人事申请、管理人员信息',
      permissions: ['查看申请', '人事审批', '员工管理', '考勤管理', '薪资管理']
    },
    {
      id: 'admin',
      name: '系统管理员',
      icon: '⚙️',
      color: '#764ba2',
      description: '系统全权限管理',
      permissions: ['全部权限']
    }
  ],

  permissionMatrix: [
    { module: '提交申请', employee: true, supervisor: true, department_manager: true, finance: false, hr: false, admin: true },
    { module: '查看所有申请', employee: false, supervisor: false, department_manager: false, finance: false, hr: false, admin: true },
    { module: '审批申请', employee: false, supervisor: true, department_manager: true, finance: true, hr: true, admin: true },
    { module: '财务审批', employee: false, supervisor: false, department_manager: false, finance: true, hr: false, admin: true },
    { module: '人事审批', employee: false, supervisor: false, department_manager: false, finance: false, hr: true, admin: true },
    { module: '查看统计', employee: false, supervisor: true, department_manager: true, finance: true, hr: true, admin: true },
    { module: '导出报表', employee: false, supervisor: false, department_manager: true, finance: true, hr: true, admin: true },
    { module: '用户管理', employee: false, supervisor: false, department_manager: false, finance: false, hr: false, admin: true },
    { module: '流程配置', employee: false, supervisor: false, department_manager: false, finance: false, hr: false, admin: true },
    { module: '系统设置', employee: false, supervisor: false, department_manager: false, finance: false, hr: false, admin: true }
  ],

  operationLogs: [
    { id: 1, type: 'create', user: '张三', action: '提交了请假申请', applicationId: 'AP20240601001', time: '2024-06-03 09:30:00', detail: '申请时间：6月10日-6月14日，共5天' },
    { id: 2, type: 'approve', user: '李主管', action: '审批通过了张三的请假申请', applicationId: 'AP20240601001', time: '2024-06-03 10:15:00', detail: '审批意见：同意' },
    { id: 3, type: 'create', user: '李四', action: '提交了报销申请', applicationId: 'AP20240601002', time: '2024-06-02 14:20:00', detail: '报销金额：5680.00元' },
    { id: 4, type: 'approve', user: '王总监', action: '审批通过了李四的报销申请', applicationId: 'AP20240601002', time: '2024-06-02 16:00:00', detail: '审批意见：情况属实，同意报销' },
    { id: 5, type: 'create', user: '王五', action: '提交了采购申请', applicationId: 'AP20240601003', time: '2024-06-01 10:00:00', detail: '采购金额：25000.00元' },
    { id: 6, type: 'approve', user: '周总', action: '审批通过了采购申请', applicationId: 'AP20240601003', time: '2024-06-01 17:00:00', detail: '审批意见：同意采购' },
    { id: 7, type: 'create', user: '赵六', action: '提交了出差申请', applicationId: 'AP20240601004', time: '2024-06-03 11:00:00', detail: '出差地点：北京，时间6月15日-18日' },
    { id: 8, type: 'reject', user: '李主管', action: '驳回了孙七的病假申请', applicationId: 'AP20240501005', time: '2024-05-28 09:15:00', detail: '审批意见：项目关键时期，建议改期' },
    { id: 9, type: 'system', user: '系统', action: '自动提醒：3笔申请即将超时', applicationId: '', time: '2024-06-03 08:00:00', detail: '请相关审批人及时处理' },
    { id: 10, type: 'update', user: '李四', action: '修改了报销单金额', applicationId: 'AP20240601002', time: '2024-06-02 14:30:00', detail: '金额从5200元修改为5680元' },
    { id: 11, type: 'create', user: '周八', action: '提交了业务招待费报销', applicationId: 'AP20240501006', time: '2024-05-25 15:00:00', detail: '报销金额：2850.00元' },
    { id: 12, type: 'approve', user: '郑出纳', action: '完成了报销打款', applicationId: 'AP20240501006', time: '2024-05-26 14:00:00', detail: '款项已转入申请人账户' },
    { id: 13, type: 'create', user: '郑十', action: '提交了调休申请', applicationId: 'AP20240501008', time: '2024-06-03 16:00:00', detail: '调休时间：6月4日' }
  ],

  alerts: [
    {
      level: 'alert-error',
      icon: 'Warning',
      title: '审批即将超时',
      message: 'AP20240601001 请假申请已超过24小时未处理',
      time: '10分钟前'
    },
    {
      level: 'alert-warning',
      icon: 'Clock',
      title: '待办提醒',
      message: '您有3条待审批的申请需要处理',
      time: '1小时前'
    },
    {
      level: 'alert-info',
      icon: 'InfoFilled',
      title: '系统通知',
      message: '本月报销截止日期为6月25日，请及时提交',
      time: '今天 08:00'
    }
  ],

  charts: {
    trendData: {
      months: ['1月', '2月', '3月', '4月', '5月', '6月'],
      counts: [65, 78, 92, 85, 110, 45]
    },
    typeData: [
      { value: 35, name: '请假' },
      { value: 28, name: '报销' },
      { value: 22, name: '采购' },
      { value: 15, name: '出差' }
    ],
    monthlyData: {
      months: ['1月', '2月', '3月', '4月', '5月', '6月'],
      approved: [55, 68, 80, 72, 95, 38],
      rejected: [5, 4, 6, 8, 7, 2],
      pending: [5, 6, 6, 5, 8, 5]
    },
    deptData: [
      { name: '销售部', value: 156 },
      { name: '技术部', value: 124 },
      { name: '市场部', value: 89 },
      { name: '行政部', value: 67 },
      { name: '财务部', value: 45 },
      { name: '产品部', value: 78 }
    ],
    efficiencyData: [
      { name: '李主管', avg: 2.5 },
      { name: '王总监', avg: 3.2 },
      { name: '张经理', avg: 1.8 },
      { name: '赵经理', avg: 4.1 },
      { name: '钱财务', avg: 2.0 }
    ],
    passRateData: {
      types: ['请假', '报销', '采购', '出差'],
      rates: [92, 85, 78, 88]
    },
    amountData: {
      months: ['1月', '2月', '3月', '4月', '5月', '6月'],
      amounts: [45000, 52000, 68000, 55000, 78000, 32000]
    }
  }
};
