import React from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import Issues from './pages/Issues';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const token = localStorage.getItem('token');

  return (
  
      <Routes>
        {/* Public */}
         <Route path="/" element={<Navigate to="/login" replace />} />
       
        <Route path="/login"  element={<Login />}  />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route element={<PrivateRoute isAuth={!!token} />}>
          <Route path="/projects"                    element={<Projects />} />
          <Route path="/projects/:projectId/issues"  element={<Issues />} />
        </Route>

        {/* Redirects */}
        <Route
          path="/"
          element={
            token
              ? <Navigate to="/projects" replace />
              : <Navigate to="/login"    replace />
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/projects" : "/login"} replace />}
        />
      </Routes>
  
  );
}

export default App;
