import { useCallback } from 'react'
import type { Hackathon, Internship, Deadline, FocusSprint, Win, Season, Settings, ProfileLink, Activity } from '../types'

const STORAGE_KEYS = {
  hackathons: 'studentos_hackathons',
  internships: 'studentos_internships',
  deadlines: 'studentos_deadlines',
  sprints: 'studentos_sprints',
  wins: 'studentos_wins',
  seasons: 'studentos_seasons',
  settings: 'studentos_settings',
  profileLinks: 'studentos_profileLinks',
  activities: 'studentos_activities',
}

const DEFAULT_SETTINGS: Settings = {
  currentMode: 'grind',
  streak: 0,
}

export const useStorage = () => {
  // Hackathons
  const getHackathons = useCallback((): Hackathon[] => {
    const data = localStorage.getItem(STORAGE_KEYS.hackathons)
    return data ? JSON.parse(data) : []
  }, [])

  const addHackathon = useCallback((hackathon: Hackathon) => {
    const hacks = getHackathons()
    hacks.push(hackathon)
    localStorage.setItem(STORAGE_KEYS.hackathons, JSON.stringify(hacks))
  }, [getHackathons])

  const updateHackathon = useCallback((id: string, updates: Partial<Hackathon>) => {
    const hacks = getHackathons()
    const hackIndex = hacks.findIndex((h: Hackathon) => h.id === id)
    if (hackIndex !== -1) {
      hacks[hackIndex] = { ...hacks[hackIndex], ...updates }
      localStorage.setItem(STORAGE_KEYS.hackathons, JSON.stringify(hacks))
    }
  }, [getHackathons])

  const deleteHackathon = useCallback((id: string) => {
    const hacks = getHackathons()
    const filtered = hacks.filter((h: Hackathon) => h.id !== id)
    localStorage.setItem(STORAGE_KEYS.hackathons, JSON.stringify(filtered))
  }, [getHackathons])

  // Internships
  const getInternships = useCallback((): Internship[] => {
    const data = localStorage.getItem(STORAGE_KEYS.internships)
    return data ? JSON.parse(data) : []
  }, [])

  const addInternship = useCallback((internship: Internship) => {
    const internships = getInternships()
    internships.push(internship)
    localStorage.setItem(STORAGE_KEYS.internships, JSON.stringify(internships))
  }, [getInternships])

  const updateInternship = useCallback((id: string, updates: Partial<Internship>) => {
    const internships = getInternships()
    const index = internships.findIndex((i: Internship) => i.id === id)
    if (index !== -1) {
      internships[index] = { ...internships[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.internships, JSON.stringify(internships))
    }
  }, [getInternships])

  const deleteInternship = useCallback((id: string) => {
    const internships = getInternships()
    const filtered = internships.filter((i: Internship) => i.id !== id)
    localStorage.setItem(STORAGE_KEYS.internships, JSON.stringify(filtered))
  }, [getInternships])

  // Deadlines
  const getDeadlines = useCallback((): Deadline[] => {
    const data = localStorage.getItem(STORAGE_KEYS.deadlines)
    return data ? JSON.parse(data) : []
  }, [])

  const addDeadline = useCallback((deadline: Deadline) => {
    const deadlines = getDeadlines()
    deadlines.push(deadline)
    localStorage.setItem(STORAGE_KEYS.deadlines, JSON.stringify(deadlines))
  }, [getDeadlines])

  const updateDeadline = useCallback((id: string, updates: Partial<Deadline>) => {
    const deadlines = getDeadlines()
    const index = deadlines.findIndex((d: Deadline) => d.id === id)
    if (index !== -1) {
      deadlines[index] = { ...deadlines[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.deadlines, JSON.stringify(deadlines))
    }
  }, [getDeadlines])

  const deleteDeadline = useCallback((id: string) => {
    const deadlines = getDeadlines()
    const filtered = deadlines.filter((d: Deadline) => d.id !== id)
    localStorage.setItem(STORAGE_KEYS.deadlines, JSON.stringify(filtered))
  }, [getDeadlines])

  // Sprints
  const getSprints = useCallback((): FocusSprint[] => {
    const data = localStorage.getItem(STORAGE_KEYS.sprints)
    return data ? JSON.parse(data) : []
  }, [])

  const addSprint = useCallback((sprint: FocusSprint) => {
    const sprints = getSprints()
    sprints.push(sprint)
    localStorage.setItem(STORAGE_KEYS.sprints, JSON.stringify(sprints))
  }, [getSprints])

  const updateSprint = useCallback((id: string, updates: Partial<FocusSprint>) => {
    const sprints = getSprints()
    const index = sprints.findIndex((s: FocusSprint) => s.id === id)
    if (index !== -1) {
      sprints[index] = { ...sprints[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.sprints, JSON.stringify(sprints))
    }
  }, [getSprints])

  // Wins
  const getWins = useCallback((): Win[] => {
    const data = localStorage.getItem(STORAGE_KEYS.wins)
    return data ? JSON.parse(data) : []
  }, [])

  const addWin = useCallback((win: Win) => {
    const wins = getWins()
    wins.push(win)
    localStorage.setItem(STORAGE_KEYS.wins, JSON.stringify(wins))
  }, [getWins])

  const deleteWin = useCallback((id: string) => {
    const wins = getWins()
    const filtered = wins.filter((w: Win) => w.id !== id)
    localStorage.setItem(STORAGE_KEYS.wins, JSON.stringify(filtered))
  }, [getWins])

  // Settings
  const getSettings = useCallback((): Settings => {
    const data = localStorage.getItem(STORAGE_KEYS.settings)
    return data ? JSON.parse(data) : DEFAULT_SETTINGS
  }, [])

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    const settings = getSettings()
    const updated = { ...settings, ...updates }
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(updated))
  }, [getSettings])

  // Profile Links
  const getProfileLinks = useCallback((): ProfileLink[] => {
    const data = localStorage.getItem(STORAGE_KEYS.profileLinks)
    return data ? JSON.parse(data) : []
  }, [])

  const addProfileLink = useCallback((profile: ProfileLink) => {
    const profiles = getProfileLinks()
    profiles.push(profile)
    localStorage.setItem(STORAGE_KEYS.profileLinks, JSON.stringify(profiles))
  }, [getProfileLinks])

  const updateProfileLink = useCallback((id: string, updates: Partial<ProfileLink>) => {
    const profiles = getProfileLinks()
    const index = profiles.findIndex((p: ProfileLink) => p.id === id)
    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.profileLinks, JSON.stringify(profiles))
    }
  }, [getProfileLinks])

  const deleteProfileLink = useCallback((id: string) => {
    const profiles = getProfileLinks()
    const filtered = profiles.filter((p: ProfileLink) => p.id !== id)
    localStorage.setItem(STORAGE_KEYS.profileLinks, JSON.stringify(filtered))
  }, [getProfileLinks])

  // Activities
  const getActivities = useCallback((): Activity[] => {
    const data = localStorage.getItem(STORAGE_KEYS.activities)
    return data ? JSON.parse(data) : []
  }, [])

  const addActivity = useCallback((activity: Activity) => {
    const activities = getActivities()
    activities.push(activity)
    localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities))
  }, [getActivities])

  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    const activities = getActivities()
    const index = activities.findIndex((a: Activity) => a.id === id)
    if (index !== -1) {
      activities[index] = { ...activities[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities))
    }
  }, [getActivities])

  const deleteActivity = useCallback((id: string) => {
    const activities = getActivities()
    const filtered = activities.filter((a: Activity) => a.id !== id)
    localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(filtered))
  }, [getActivities])

  return {
    // Hackathons
    getHackathons,
    addHackathon,
    updateHackathon,
    deleteHackathon,
    // Internships
    getInternships,
    addInternship,
    updateInternship,
    deleteInternship,
    // Deadlines
    getDeadlines,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    // Sprints
    getSprints,
    addSprint,
    updateSprint,
    // Wins
    getWins,
    addWin,
    deleteWin,
    // Settings
    getSettings,
    updateSettings,
    // Profile Links
    getProfileLinks,
    addProfileLink,
    updateProfileLink,
    deleteProfileLink,
    // Activities
    getActivities,
    addActivity,
    updateActivity,
    deleteActivity,
  }
}
