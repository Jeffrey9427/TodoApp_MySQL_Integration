import "./App.css";
import Todo from "./pages/Todo";
import Landing from "./pages/Landing";
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import UpdateProfile from "./pages/UpdateProfile"
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route 
              path="/"
              element={<ProtectedRoute>
                <main>
                  <Landing />
                </main>
              </ProtectedRoute>}
            />
            <Route 
              path="/todo"
              element={<ProtectedRoute>
                  <Todo />
              </ProtectedRoute>}
            />
            <Route 
              path="/update-profile"
              element={<ProtectedRoute>
                  <UpdateProfile />
              </ProtectedRoute>}
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;