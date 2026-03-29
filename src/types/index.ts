export type AppMode = 'hustle' | 'grind' | 'chill'

export interface Hackathon {
  id: string
  name: string
  status: 'Discover' | 'Applied' | 'Registered' | 'Live' | 'Result'
  deadline: string
  team: TeamMember[]
  stack: string[]
  result?: string
  hoursLogged: number
  reflection?: string
  createdAt: string
}

export interface TeamMember {
  name: string
  role: string
}

export interface Internship {
  id: string
  company: string
  role: string
  stipend: string
  stage: 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected'
  rounds: InterviewRound[]
  confidenceScores: ConfidenceScores
  followUp?: string
  hoursLogged: number
  createdAt: string
}

export interface InterviewRound {
  id: string
  type: 'phone' | 'tech1' | 'tech2' | 'hr'
  questionsAsked?: string
  notes?: string
  outcome?: 'pass' | 'fail' | 'pending'
  scheduledAt?: string
}

export interface ConfidenceScores {
  dsa: number
  systemDesign: number
  behavioural: number
}

export interface Deadline {
  id: string
  title: string
  type: 'Exam' | 'Submission' | 'Interview' | 'Meeting'
  dueAt: string
  estimatedHours: number
  completed: boolean
  hoursLogged: number
  createdAt: string
}

export interface FocusSprint {
  id: string
  taggedTo: string
  tagType: 'hackathon' | 'internship' | 'deadline'
  duration: number
  completedAt?: string
  startedAt: string
}

export interface Win {
  id: string
  title: string
  date: string
  note: string
}

export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
}

export interface Settings {
  currentMode: AppMode
  streak: number
  lastLogin?: string
  currentSeason?: string
}

export interface ProfileLink {
  id: string
  platform: 'unstop' | 'internshala'
  profileUrl: string
  profileName: string
  linkedAt: string
  isActive: boolean
}

export interface Activity {
  id: string
  profileId: string
  platform: 'unstop' | 'internshala' | 'studentos'
  type: 'application' | 'match' | 'update' | 'interview' | 'view' | 'hackathon_added' | 'internship_added' | 'deadline_added'
  title: string
  description: string
  timestamp: string
  metadata?: {
    company?: string
    position?: string
    status?: string
    link?: string
    itemId?: string
  }
  hoursLogged?: number
}
