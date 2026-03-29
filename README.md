# 🚀 StudentOS

**Hack • Apply • Grind** — A comprehensive student productivity app for tracking hackathons, internships, deadlines, and achievements.

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.0-blue?logo=vite)
![Status](https://img.shields.io/badge/Status-Live%20✅-brightgreen)

---

## 🌐 Live Demo

**Visit:** [https://student-os-936.vercel.app/](https://student-os-936.vercel.app/)

---

## ✨ Features

### 📊 **Dashboard**
- Hero landing page with productivity metrics
- Daily streak tracking and motivation
- Activity pulse score visualization
- Mode selector (Hustle 🔥 / Grind 💪 / Chill 😎)

### 🎯 **Task Management**
- **Hackathons** - Track applications with deadlines and status
- **Internships** - Monitor applications across stages
- **Deadlines** - Manage project deadlines with time estimation
- **Archive** - Store completed items

### 📈 **Activity Feed**
- Real-time activity timeline with heatmap
- 24-hour activity visualization
- Working hours metrics
- Platform integration support (Unstop, Internshala)
- Recent sessions tracking

### 🤖 **AI Help**
- Chat interface with AI assistant
- Quick questions for hackathons, internships, productivity
- Simulated AI responses with helpful guidance

### 💬 **Contact Support**
- Support form with email, subject, message
- FAQ section with common questions
- Contact information (Email, Discord, Phone)

### 📖 **Setup Guide**
- Interactive 6-step onboarding checklist
- Progress tracking with percentage
- Estimated time for each step
- Pro tips for getting started

### ⚙️ **Workspace Settings**
- Workspace customization
- Productivity mode selection
- Notification preferences (Browser, Sound, Email)
- Data export/backup (JSON)
- Data clearing option

### 📊 **Reports & Analytics**
- Comprehensive statistics dashboard
- Completion rates and streak tracking
- Activity breakdowns by type
- Internship stage distribution
- Hackathon status overview
- Personalized insights and recommendations

---

## 🛠️ **Tech Stack**

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2+ | UI framework |
| **TypeScript** | 5.2+ | Type safety |
| **Vite** | 5.0+ | Build tool |
| **Tailwind CSS** | 3.3+ | Styling |
| **Lucide React** | 0.294+ | Icons |
| **localStorage** | Native | Data persistence |

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+
- npm or yarn

### **Installation**

```bash
# Clone the repository
git clone https://github.com/amritpaxt/Student-OS.git
cd Student-OS

# Install dependencies
npm install

# Start development server
npm run dev
```

**Local URL:** http://localhost:5175

### **Build for Production**

```bash
npm run build
npm run preview
```

---

## 📁 **Project Structure**

```
Student-OS/
├── src/
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── Hackathons.tsx
│   │   ├── Internships.tsx
│   │   ├── Deadlines.tsx
│   │   ├── Archive.tsx
│   │   ├── AIHelp.tsx
│   │   ├── ContactSupport.tsx
│   │   ├── SetupGuide.tsx
│   │   ├── WorkspaceSettings.tsx
│   │   └── ReportsAnalytics.tsx
│   ├── components/         # Reusable components
│   │   ├── Sidebar.tsx
│   │   ├── AddModal.tsx
│   │   ├── FloatingAddButton.tsx
│   │   ├── BottomTabBar.tsx
│   │   └── ToastNotification.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useStorage.ts   # localStorage management
│   │   └── useCountdown.ts # Countdown timer
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── vercel.json
└── README.md
```

---

## 💾 **Data Storage**

All data persists in **browser localStorage** with `studentos_` prefix:

```javascript
localStorage keys:
- studentos_hackathons
- studentos_internships
- studentos_deadlines
- studentos_activities
- studentos_sprints
- studentos_wins
- studentos_seasons
- studentos_settings
- studentos_profileLinks
```

---

## 🎨 **Design**

### **Color Palette**
- **Primary Gradient:** Pink → Purple → Blue
- **Accent Colors:** Red (urgent), Amber (warning), Blue (info)
- **Modes:** Hustle (Red), Grind (Orange), Chill (Cyan)

### **Responsive Design**
- ✅ Mobile-first approach
- ✅ Tailwind CSS breakpoints (sm, md, lg)
- ✅ Works on all devices

---

## 🔑 **Key Code Patterns**

### **Using useStorage Hook**
```typescript
const { getHackathons, addHackathon, deleteHackathon } = useStorage()

// Get all hackathons
const hackathons = getHackathons()

// Add new hackathon
addHackathon({
  id: 'hack123',
  name: 'DevHack 2026',
  status: 'Discover',
  deadline: '2026-04-15T00:00:00Z',
  // ... other fields
})

// Delete hackathon
deleteHackathon('hack123')
```

### **Toast Notifications**
```typescript
onAddToast('🎉 Hackathon added!', 'success')
onAddToast('⚠️ Please fill all fields', 'warning')
onAddToast('❌ Error occurred', 'error')
```

---

## 🚢 **Deployment**

### **Vercel (Recommended)**
1. Push to GitHub
2. Connect repository to Vercel
3. Auto-deploys on every push to `main`

**Live App:** https://student-os-936.vercel.app/

### **Manual Build**
```bash
npm run build
# Output: dist/ folder
# Deploy dist/ folder to any static host
```

---

## 📋 **Features Roadmap**

- [ ] Claude API integration for Smart Apply Radar
- [ ] Firebase sync for multi-device support
- [ ] Dark mode toggle
- [ ] Export to Google Calendar
- [ ] Interview reminder notifications
- [ ] Seasonal analytics dashboard
- [ ] Collaborative workspace sharing

---

## 🤝 **Contributing**

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 **License**

This project is open source and available under the MIT License.

---

## 📧 **Contact & Support**

- **GitHub:** https://github.com/amritpaxt/Student-OS
- **Issues:** Report bugs via GitHub Issues
- **Features:** Suggest features via GitHub Discussions

---

## 🙏 **Acknowledgments**

Built with ❤️ for students by students.

Inspired by productivity tools like Notion, Tracklog, and Marketteam.

---

## 📊 **Project Stats**

| Metric | Value |
|--------|-------|
| **Lines of Code** | 4,500+ |
| **TypeScript Files** | 20+ |
| **React Components** | 16 |
| **Build Size** | 253 KB (JS) + 40 KB (CSS) |
| **Performance** | 90+ Lighthouse score |
| **Deployment Status** | ✅ Live |

---

**Made with 🎯 for hackathon season 2026**

Last Updated: March 29, 2026
