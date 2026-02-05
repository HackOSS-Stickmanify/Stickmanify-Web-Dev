import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main page */}
        <Route path="/" element={<Login />} />

        {/* After login */}
        <Route
          path="/home"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
