import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from '@/pages/RegisterPage'; // Using @ alias, ensure vite.config.js has this configured

const App = () => (
  <Router>
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      {/* other routes */}
    </Routes>
  </Router>
);

export default App;