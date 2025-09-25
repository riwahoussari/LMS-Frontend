import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ThemeToggle } from "./components/layout/ThemeToggle";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { ROLES } from "./lib/constants";
import Navbar from "./components/layout/Navbar";

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
          // <ProtectedRoute roles={[ROLES.STUDENT, ROLES.TUTOR]}>
            <HomePage />
          // </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
