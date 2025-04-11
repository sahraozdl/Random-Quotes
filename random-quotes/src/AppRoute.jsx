import { Routes, Route } from "react-router";
import { Home } from "./components/Home";
import UserPage from "./components/UserPage";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./ProtectedRouter";
import { QuotePage } from "./components/QuotePage";
import { QuotesPage } from "./components/QuotesPage";
import { Settings } from "./components/Settings";

export const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route path="user">
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="quotes">
          <Route path=":id" element={
            <QuotePage />
            } />
          <Route index element={
            <ProtectedRoute>
            <QuotesPage />
          </ProtectedRoute>} />
        </Route>
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};
