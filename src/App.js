import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider, RequireAuth } from "./context/Auth";
import Layout from "./components/layout";
import HomeForm from "./pages/HomeForm";
import SignUpForm from "./pages/SignUpForm";
import LoginForm from "./pages/LoginForm";
import LogoutForm from "./pages/LogoutForm";
import PersonCreateForm, { PersonListForm } from "./pages/PersonForms";
import UnauthorizedForm from "./pages/UnauthorizedForm";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<LogoutForm />} />
            <Route path="/unauthorized" element={<UnauthorizedForm />} />
            <Route element={<RequireAuth />}>
              <Route path="/NewPatient" element={<PersonCreateForm />} />
              <Route path="/PersonsList" element={<PersonListForm />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;