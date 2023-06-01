import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider, RequireAuth } from "./context/Auth";
import Layout from "./components/layout";
import HomeForm from "./pages/HomeForm";
import SignUpForm from "./pages/SignUpForm";
import LoginForm from "./pages/LoginForm";
import LogoutForm from "./pages/LogoutForm";
import PersonCreateForm, { PersonEditForm, PersonListForm } from "./pages/PersonForms";
import AppointmentCreateForm from "./pages/AppointmentsForm";
import UnauthorizedForm from "./pages/UnauthorizedForm";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/signin" element={<LoginForm />} />
            <Route path="/signout" element={<LogoutForm />} />
            <Route path="/unauthorized" element={<UnauthorizedForm />} />
            <Route element={<RequireAuth />}>
              <Route path="/CreatePerson" element={<PersonCreateForm />} />
              <Route path="/EditPerson" element={<PersonEditForm />} />
              <Route path="/ListPersons" element={<PersonListForm />} />
              <Route path="/CreateAppointment" element={<AppointmentCreateForm />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;