import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ThemeToggle } from "./components/shared/ThemeToggle";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { ROLES } from "./lib/constants";
import Navbar from "./components/shared/Navbar";
import DiscoverNewPage from "./pages/DiscoverNewPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <>
          <Navbar />
          <ThemeToggle />
        </>
      }
    >
      <Route
        index
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/discover"
        element={
          <ProtectedRoute roles={[ROLES.STUDENT, ROLES.TUTOR]}>
            <DiscoverNewPage />
          </ProtectedRoute>
        }
      />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* not found page */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
