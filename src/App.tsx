import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ThemeToggle } from "./components/shared/ThemeToggle";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import { ROLES } from "./lib/constants";
import Navbar from "./components/shared/Navbar";
import DiscoverNewPage from "./pages/courses/DiscoverNewPage";
import NotFoundPage from "./pages/auth/NotFoundPage";
import CreateCoursePage from "./pages/courses/CreateCoursePage";
import CoursePage from "./pages/courses/CoursePage";
import CategoriesPage from "./pages/CategoriesPage";
import TagsPage from "./pages/TagsPage";

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

      {/* courses routes */}
      <Route
        path="/discover"
        element={
          <ProtectedRoute roles={[ROLES.STUDENT, ROLES.TUTOR]}>
            <DiscoverNewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-course"
        element={
          <ProtectedRoute roles={[ROLES.TUTOR]}>
            <CreateCoursePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute>
            <CoursePage />
          </ProtectedRoute>
        }
      />

      {/* Categories & Tags */}
      <Route path="/categories" element={<ProtectedRoute roles={[ROLES.ADMIN]}><CategoriesPage /></ProtectedRoute>} />
      <Route path="/tags" element={<ProtectedRoute roles={[ROLES.ADMIN]}><TagsPage /></ProtectedRoute>} />

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
