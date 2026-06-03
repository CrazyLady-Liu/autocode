import { Routes, Route } from 'react-router-dom'
import { ActivityProvider } from './contexts/ActivityContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ActivityList from './pages/ActivityList'
import ActivityEdit from './pages/ActivityEdit'
import ChannelList from './pages/ChannelList'
import Analytics from './pages/Analytics'

function App() {
  return (
    <ActivityProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activities" element={<ActivityList />} />
          <Route path="/activities/:id" element={<ActivityEdit />} />
          <Route path="/channels" element={<ChannelList />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </ActivityProvider>
  )
}

export default App
