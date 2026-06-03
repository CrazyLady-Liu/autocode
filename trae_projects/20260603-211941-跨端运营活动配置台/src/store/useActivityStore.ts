import { create } from 'zustand';
import type {
  Activity,
  ActivityRule,
  Channel,
  ChannelRule,
  RuleCondition,
  RuleAction,
  ValidationResult,
} from '../types/activity';
import { generateActivities, createEmptyActivity, generateId, generateCondition, generateAction } from '../utils/mockGenerator';
import { validateActivity } from '../utils/validator';

interface ActivityStore {
  activities: Activity[];
  selectedActivityId: string | null;
  selectedChannelId: string | null;
  previewChannelId: string | null;
  validationResult: ValidationResult | null;
  isLoading: boolean;

  get selectedActivity(): Activity | null;
  get selectedChannel(): Channel | null;
  get previewChannel(): Channel | null;

  initData: () => void;
  selectActivity: (id: string | null) => void;
  selectChannel: (id: string | null) => void;
  selectPreviewChannel: (id: string | null) => void;
  addActivity: () => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  updateActivityBasicInfo: (updates: Partial<Activity>) => void;
  addRule: () => void;
  updateRule: (ruleId: string, updates: Partial<ActivityRule>) => void;
  deleteRule: (ruleId: string) => void;
  addCondition: (ruleId: string, channelId: string) => void;
  updateCondition: (ruleId: string, channelId: string, conditionId: string, updates: Partial<RuleCondition>) => void;
  deleteCondition: (ruleId: string, channelId: string, conditionId: string) => void;
  addAction: (ruleId: string, channelId: string) => void;
  updateAction: (ruleId: string, channelId: string, actionId: string, updates: Partial<RuleAction>) => void;
  deleteAction: (ruleId: string, channelId: string, actionId: string) => void;
  toggleChannel: (channelId: string, enabled: boolean) => void;
  updateChannelParams: (channelId: string, params: Record<string, any>) => void;
  toggleChannelRule: (ruleId: string, channelId: string, enabled: boolean) => void;
  validateCurrentActivity: () => void;
  clearValidation: () => void;
  saveActivity: () => boolean;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: [],
  selectedActivityId: null,
  selectedChannelId: null,
  previewChannelId: null,
  validationResult: null,
  isLoading: false,

  get selectedActivity() {
    const { activities, selectedActivityId } = get();
    return activities.find(a => a.id === selectedActivityId) || null;
  },

  get selectedChannel() {
    const { selectedActivity, selectedChannelId } = get();
    return selectedActivity?.channels.find(c => c.id === selectedChannelId) || null;
  },

  get previewChannel() {
    const { selectedActivity, previewChannelId } = get();
    return selectedActivity?.channels.find(c => c.id === previewChannelId) || null;
  },

  initData: () => {
    const mockData = generateActivities(6);
    set({ activities: mockData, selectedActivityId: mockData[0]?.id || null });
  },

  selectActivity: (id: string | null) => {
    set({ selectedActivityId: id, selectedChannelId: null, previewChannelId: null, validationResult: null });
  },

  selectChannel: (id: string | null) => {
    set({ selectedChannelId: id });
  },

  selectPreviewChannel: (id: string | null) => {
    set({ previewChannelId: id });
  },

  addActivity: () => {
    const newActivity = createEmptyActivity();
    set(state => ({
      activities: [newActivity, ...state.activities],
      selectedActivityId: newActivity.id,
    }));
  },

  updateActivity: (activity: Activity) => {
    set(state => ({
      activities: state.activities.map(a => a.id === activity.id ? { ...activity, updatedAt: new Date().toISOString() } : a),
    }));
    get().validateCurrentActivity();
  },

  deleteActivity: (id: string) => {
    set(state => {
      const newActivities = state.activities.filter(a => a.id !== id);
      return {
        activities: newActivities,
        selectedActivityId: state.selectedActivityId === id ? (newActivities[0]?.id || null) : state.selectedActivityId,
      };
    });
  },

  updateActivityBasicInfo: (updates: Partial<Activity>) => {
    const { selectedActivityId, updateActivity, selectedActivity } = get();
    if (!selectedActivityId || !selectedActivity) return;
    updateActivity({ ...selectedActivity, ...updates });
  },

  addRule: () => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const enabledChannels = selectedActivity.channels.filter(c => c.enabled && c.status === 'available');
    const channelRules: ChannelRule[] = enabledChannels.map(c => ({
      channelId: c.id,
      conditions: [generateCondition()],
      actions: [generateAction()],
      enabled: true,
    }));

    const newRule: ActivityRule = {
      id: generateId(),
      name: '',
      description: '',
      channelRules,
    };

    updateActivity({
      ...selectedActivity,
      rules: [...selectedActivity.rules, newRule],
    });
  },

  updateRule: (ruleId: string, updates: Partial<ActivityRule>) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedRules = selectedActivity.rules.map(r =>
      r.id === ruleId ? { ...r, ...updates } : r
    );

    updateActivity({
      ...selectedActivity,
      rules: updatedRules,
    });
  },

  deleteRule: (ruleId: string) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    updateActivity({
      ...selectedActivity,
      rules: selectedActivity.rules.filter(r => r.id !== ruleId),
    });
  },

  addCondition: (ruleId: string, channelId: string) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedRules = selectedActivity.rules.map(r => {
      if (r.id !== ruleId) return r;
      const updatedChannelRules = r.channelRules.map(cr => {
        if (cr.channelId !== channelId) return cr;
        return {
          ...cr,
          conditions: [...cr.conditions, generateCondition()],
        };
      });
      return { ...r, channelRules: updatedChannelRules };
    });

    updateActivity({
      ...selectedActivity,
      rules: updatedRules,
    });
  },

  updateCondition: (ruleId: string, channelId: string, conditionId: string, updates: Partial<RuleCondition>) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedRules = selectedActivity.rules.map(r => {
      if (r.id !== ruleId) return r;
      const updatedChannelRules = r.channelRules.map(cr => {
        if (cr.channelId !== channelId) return cr;
        const updatedConditions = cr.conditions.map(c =>
          c.id === conditionId ? { ...c, ...updates } : c
        );
        return { ...cr, conditions: updatedConditions };
      });
      return { ...r, channelRules: updatedChannelRules };
    });

    updateActivity({
      ...selectedActivity,
      rules: updatedRules,
    });
  },

  deleteCondition: (ruleId: string, channelId: string, conditionId: string) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedRules = selectedActivity.rules.map(r => {
      if (r.id !== ruleId) return r;
      const updatedChannelRules = r.channelRules.map(cr => {
        if (cr.channelId !== channelId) return cr;
        return {
          ...cr,
          conditions: cr.conditions.filter(c => c.id !== conditionId),
        };
      });
      return { ...r, channelRules: updatedChannelRules };
    });

    updateActivity({
      ...selectedActivity,
      rules: updatedRules,
    });
  },

  addAction: (ruleId: string, channelId: string) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedRules = selectedActivity.rules.map(r => {
      if (r.id !== ruleId) return r;
      const updatedChannelRules = r.channelRules.map(cr => {
        if (cr.channelId !== channelId) return cr;
        return {
          ...cr,
          actions: [...cr.actions, generateAction()],
        };
      });
      return { ...r, channelRules: updatedChannelRules };
    });

    updateActivity({
      ...selectedActivity,
      rules: updatedRules,
    });
  },

  updateAction: (ruleId: string, channelId: string, actionId: string, updates: Partial<RuleAction>) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedRules = selectedActivity.rules.map(r => {
      if (r.id !== ruleId) return r;
      const updatedChannelRules = r.channelRules.map(cr => {
        if (cr.channelId !== channelId) return cr;
        const updatedActions = cr.actions.map(a =>
          a.id === actionId ? { ...a, ...updates } : a
        );
        return { ...cr, actions: updatedActions };
      });
      return { ...r, channelRules: updatedChannelRules };
    });

    updateActivity({
      ...selectedActivity,
      rules: updatedRules,
    });
  },

  deleteAction: (ruleId: string, channelId: string, actionId: string) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedRules = selectedActivity.rules.map(r => {
      if (r.id !== ruleId) return r;
      const updatedChannelRules = r.channelRules.map(cr => {
        if (cr.channelId !== channelId) return cr;
        return {
          ...cr,
          actions: cr.actions.filter(a => a.id !== actionId),
        };
      });
      return { ...r, channelRules: updatedChannelRules };
    });

    updateActivity({
      ...selectedActivity,
      rules: updatedRules,
    });
  },

  toggleChannel: (channelId: string, enabled: boolean) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedChannels = selectedActivity.channels.map(c =>
      c.id === channelId ? { ...c, enabled } : c
    );

    let updatedRules = selectedActivity.rules;
    if (enabled) {
      updatedRules = selectedActivity.rules.map(r => {
        const hasChannelRule = r.channelRules.some(cr => cr.channelId === channelId);
        if (hasChannelRule) return r;
        return {
          ...r,
          channelRules: [...r.channelRules, {
            channelId,
            conditions: [generateCondition()],
            actions: [generateAction()],
            enabled: true,
          }],
        };
      });
    }

    updateActivity({
      ...selectedActivity,
      channels: updatedChannels,
      rules: updatedRules,
    });
  },

  updateChannelParams: (channelId: string, params: Record<string, any>) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedChannels = selectedActivity.channels.map(c =>
      c.id === channelId ? { ...c, params: { ...c.params, ...params } } : c
    );

    updateActivity({
      ...selectedActivity,
      channels: updatedChannels,
    });
  },

  toggleChannelRule: (ruleId: string, channelId: string, enabled: boolean) => {
    const { selectedActivity, updateActivity } = get();
    if (!selectedActivity) return;

    const updatedRules = selectedActivity.rules.map(r => {
      if (r.id !== ruleId) return r;
      const updatedChannelRules = r.channelRules.map(cr =>
        cr.channelId === channelId ? { ...cr, enabled } : cr
      );
      return { ...r, channelRules: updatedChannelRules };
    });

    updateActivity({
      ...selectedActivity,
      rules: updatedRules,
    });
  },

  validateCurrentActivity: () => {
    const { selectedActivity, activities } = get();
    if (!selectedActivity) {
      set({ validationResult: null });
      return;
    }
    const result = validateActivity(selectedActivity, activities);
    set({ validationResult: result });
  },

  clearValidation: () => {
    set({ validationResult: null });
  },

  saveActivity: (): boolean => {
    const { validateCurrentActivity, validationResult } = get();
    validateCurrentActivity();
    const result = get().validationResult;
    return result?.valid ?? false;
  },
}));
