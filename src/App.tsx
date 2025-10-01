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
import CategoriesPage from "./pages/admin/CategoriesPage";
import TagsPage from "./pages/admin/TagsPage";
import PlatformAnalyticsPage from "./pages/admin/AnalyticsPage";
import EditCoursePage from "./pages/courses/EditCoursePage";
import UsersPage from "./pages/users/UsersPage";
import UserPage from "./pages/users/UserPage";

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

      {/* users routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:userId"
        element={
          <ProtectedRoute>
            <UserPage />
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
      <Route
        path="/courses/:courseId/edit"
        element={
          <ProtectedRoute roles={[ROLES.TUTOR]}>
            <EditCoursePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <DiscoverNewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tags"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <TagsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/platfrom-analytics"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <PlatformAnalyticsPage />
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
