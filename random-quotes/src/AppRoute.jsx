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
        <Route
          index
          element={
            <ProtectedRoute>
              <QuotesPage />
            </ProtectedRoute>
          }
        />

        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/quotes/:id" element={<QuotePage />} />
    </Routes>
  );
};
