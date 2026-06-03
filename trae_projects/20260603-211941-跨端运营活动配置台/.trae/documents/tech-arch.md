## 1. 架构设计

```mermaid
graph TD
    subgraph "前端应用层"
        A["主工作台 App"]
        B["活动列表组件"]
        C["规则编辑器组件"]
        D["投放渠道组件"]
        E["实时预览组件"]
        F["数据概览组件"]
        G["校验系统组件"]
    end
    
    subgraph "状态管理层"
        H["React Context + useReducer"]
        I["活动状态 Store"]
        J["校验状态 Store"]
    end
    
    subgraph "数据层"
        K["TypeScript 类型定义"]
        L["Mock 数据服务"]
        M["本地校验引擎"]
    end
    
    subgraph "UI 组件层"
        N["TailwindCSS 样式系统"]
        O["Lucide React 图标"]
        P["Recharts 图表库"]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    
    B --> H
    C --> H
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I
    H --> J
    
    I --> K
    J --> M
    L --> K
    
    B --> N
    C --> N
    D --> N
    E --> N
    F --> N
    G --> N
    
    B --> O
    C --> O
    D --> O
    E --> O
    F --> O
    G --> O
    
    F --> P
```

## 2. 技术选型

- **前端框架**：React@18 + TypeScript@5
- **构建工具**：Vite@5
- **样式方案**：TailwindCSS@3 + PostCSS
- **状态管理**：React Context + useReducer（轻量场景，无需 Redux）
- **图标库**：Lucide React
- **图表库**：Recharts
- **表单处理**：React Hook Form
- **数据校验**：Zod（配合自定义校验引擎）
- **后端**：无，使用 Mock 数据模拟所有接口
- **数据库**：无，数据存储在浏览器 localStorage

## 3. 路由定义

| 路由 | 用途 |
|-------|---------|
| / | 主工作台，包含所有功能模块 |
| /activity/:id | 指定活动的编辑页面，带参数定位 |

说明：单页应用设计，所有模块在同一页面内通过状态切换展示，无需多路由。

## 4. 数据模型

### 4.1 核心数据类型定义

```typescript
// 活动状态
type ActivityStatus = 'draft' | 'pending' | 'active' | 'paused' | 'ended';

// 渠道类型
type ChannelType = 'wechat' | 'alipay' | 'app' | 'h5' | 'miniprogram';

// 渠道状态
type ChannelStatus = 'available' | 'unavailable' | 'maintenance';

// 规则条件类型
type RuleConditionType = 'user_level' | 'consume_amount' | 'sign_days' | 'region' | 'time_range';

// 规则动作类型
type RuleActionType = 'discount' | 'coupon' | 'points' | 'gift' | 'red_packet';

// 投放渠道
interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  status: ChannelStatus;
  enabled: boolean;
  unavailableReason?: string;
  params: Record<string, any>;
}

// 规则条件
interface RuleCondition {
  id: string;
  type: RuleConditionType;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';
  value: any;
  label: string;
}

// 规则动作
interface RuleAction {
  id: string;
  type: RuleActionType;
  value: any;
  label: string;
}

// 渠道规则（差异化配置）
interface ChannelRule {
  channelId: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  enabled: boolean;
}

// 活动规则
interface ActivityRule {
  id: string;
  name: string;
  description: string;
  channelRules: ChannelRule[];
}

// 活动数据指标
interface ActivityMetrics {
  pv: number;
  uv: number;
  participateCount: number;
  conversionRate: number;
  cost: number;
  roi: number;
  dailyTrend: { date: string; pv: number; uv: number; conversion: number }[];
  channelData: { channel: string; pv: number; uv: number; conversion: number }[];
}

// 活动主对象
interface Activity {
  id: string;
  name: string;
  description: string;
  status: ActivityStatus;
  startTime: string;
  endTime: string;
  coverImage: string;
  rules: ActivityRule[];
  channels: Channel[];
  metrics: ActivityMetrics;
  createdAt: string;
  updatedAt: string;
}

// 校验结果
interface ValidationResult {
  valid: boolean;
  errors: ValidationItem[];
  warnings: ValidationItem[];
}

interface ValidationItem {
  id: string;
  type: 'error' | 'warning';
  field: string;
  message: string;
  location: string;
}
```

### 4.2 ER 关系图

```mermaid
erDiagram
    ACTIVITY ||--o{ ACTIVITY_RULE : "包含"
    ACTIVITY ||--o{ CHANNEL : "投放"
    ACTIVITY ||--|| ACTIVITY_METRICS : "统计"
    ACTIVITY_RULE ||--o{ CHANNEL_RULE : "渠道差异化"
    CHANNEL_RULE ||--o{ RULE_CONDITION : "条件"
    CHANNEL_RULE ||--o{ RULE_ACTION : "动作"
    
    ACTIVITY {
        string id PK
        string name
        string description
        string status
        datetime startTime
        datetime endTime
        string coverImage
        datetime createdAt
        datetime updatedAt
    }
    
    ACTIVITY_RULE {
        string id PK
        string activityId FK
        string name
        string description
    }
    
    CHANNEL {
        string id PK
        string activityId FK
        string name
        string type
        string status
        boolean enabled
        json params
    }
    
    CHANNEL_RULE {
        string id PK
        string ruleId FK
        string channelId FK
        boolean enabled
    }
    
    RULE_CONDITION {
        string id PK
        string channelRuleId FK
        string type
        string operator
        json value
    }
    
    RULE_ACTION {
        string id PK
        string channelRuleId FK
        string type
        json value
    }
    
    ACTIVITY_METRICS {
        string id PK
        string activityId FK
        int pv
        int uv
        int participateCount
        float conversionRate
        float cost
        float roi
        json dailyTrend
        json channelData
    }
```

## 5. 模块划分

```mermaid
graph TD
    subgraph "src/"
        A["components/"]
        B["hooks/"]
        C["store/"]
        D["types/"]
        E["utils/"]
        F["mock/"]
        G["App.tsx"]
        H["main.tsx"]
    end
    
    subgraph "components/"
        A1["ActivityList/ 活动列表"]
        A2["RuleEditor/ 规则编辑器"]
        A3["ChannelPanel/ 渠道面板"]
        A4["LivePreview/ 实时预览"]
        A5["DataOverview/ 数据概览"]
        A6["ValidationBar/ 校验提示栏"]
        A7["common/ 通用组件"]
    end
    
    subgraph "hooks/"
        B1["useActivity.ts 活动操作"]
        B2["useValidation.ts 校验逻辑"]
        B3["useMockData.ts Mock数据"]
    end
    
    subgraph "store/"
        C1["ActivityContext.tsx 活动状态"]
        C2["activityReducer.ts 状态更新"]
    end
    
    subgraph "types/"
        D1["activity.ts 活动类型"]
        D2["validation.ts 校验类型"]
    end
    
    subgraph "utils/"
        E1["validator.ts 校验引擎"]
        E2["mockGenerator.ts 数据生成器"]
    end
    
    subgraph "mock/"
        F1["activities.ts 活动Mock"]
        F2["channels.ts 渠道Mock"]
    end
```

## 6. 核心校验规则

1. **活动基础信息校验**：
   - 活动名称不能为空，长度限制 2-50 字符
   - 开始时间必须早于结束时间
   - 活动描述不能为空
   - 必须上传封面图

2. **规则完整性校验**：
   - 至少配置一条规则
   - 每条规则至少包含一个条件和一个动作
   - 条件值不能为空且格式正确
   - 动作值不能为空且在合理范围内

3. **渠道校验**：
   - 至少选择一个可用渠道
   - 已启用渠道必须配置对应渠道规则
   - 渠道参数完整性校验
   - 渠道状态检查（不可用渠道需提示原因）

4. **边界情况处理**：
   - 空活动：显示引导创建流程
   - 规则缺字段：高亮缺失字段并列出清单
   - 渠道不可用：禁用并显示原因，不允许选择
   - 时间冲突：与同渠道其他活动时间重叠时警告
