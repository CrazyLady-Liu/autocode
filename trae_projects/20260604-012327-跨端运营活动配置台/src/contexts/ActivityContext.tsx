import React, { createContext, useContext, useState, useCallback } from 'react'
import { Activity, Rule, Channel, ActivityStats } from '../types'
import { mockActivities, mockRules, mockChannels, mockStats } from '../data/mockData'

interface ActivityContextType {
  activities: Activity[]
  rules: Rule[]
  channels: Channel[]
  stats: ActivityStats[]
  currentActivityId: string | null
  setCurrentActivityId: (id: string | null) => void
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateActivity: (id: string, activity: Partial<Activity>) => void
  deleteActivity: (id: string) => void
  addRule: (rule: Omit<Rule, 'id'>) => void
  updateRule: (id: string, rule: Partial<Rule>) => void
  deleteRule: (id: string) => void
  getActivityRules: (activityId: string) => Rule[]
  getActivityStats: (activityId: string) => ActivityStats | undefined
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [rules, setRules] = useState<Rule[]>(mockRules)
  const [channels] = useState<Channel[]>(mockChannels)
  const [stats] = useState<ActivityStats[]>(mockStats)
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(null)

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setActivities(prev => [newActivity, ...prev])
  }, [])

  const updateActivity = useCallback((id: string, activity: Partial<Activity>) => {
    setActivities(prev => prev.map(a => 
      a.id === id ? { ...a, ...activity, updatedAt: new Date().toISOString() } : a
    ))
  }, [])

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id))
    setRules(prev => prev.filter(r => r.activityId !== id))
  }, [])

  const addRule = useCallback((rule: Omit<Rule, 'id'>) => {
    const newRule: Rule = {
      ...rule,
      id: Date.now().toString()
    }
    setRules(prev => [...prev, newRule])
  }, [])

  const updateRule = useCallback((id: string, rule: Partial<Rule>) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, ...rule } : r))
  }, [])

  const deleteRule = useCallback((id: string) => {
    setRules(prev => prev.filter(r => r.id !== id))
  }, [])

  const getActivityRules = useCallback((activityId: string) => {
    return rules.filter(r => r.activityId === activityId)
  }, [rules])

  const getActivityStats = useCallback((activityId: string) => {
    return stats.find(s => s.activityId === activityId)
  }, [stats])

  return (
    <ActivityContext.Provider value={{
      activities,
      rules,
      channels,
      stats,
      currentActivityId,
      setCurrentActivityId,
      addActivity,
      updateActivity,
      deleteActivity,
      addRule,
      updateRule,
      deleteRule,
      getActivityRules,
      getActivityStats
    }}>
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivity = () => {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used within ActivityProvider')
  }
  return context
}
