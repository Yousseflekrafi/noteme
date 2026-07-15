import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Components/Login'
import Account from './Components/account'
import Tasks from './Components/tasks'
import NotFound from './Protected/NotFound'
import Layout from './ReusedComponents/Layout'
import ProtectedRoute from './Protected/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/account" element={<Account />} />
          <Route path="/tasks" element={<Tasks view="all" />} />
          <Route path="/tasks/open" element={<Tasks view="open" />} />
          <Route path="/tasks/done" element={<Tasks view="done" />} />
          <Route path="/tasks/deleted" element={<Tasks view="deleted" />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}