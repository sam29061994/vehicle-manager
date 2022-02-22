import Layout from "./components/Layout.component";
import Register from "./components/Register.component";
import Home from "./components/Home.component";
import Login from "./components/Login.component";
import NotFound from "./components/NotFound.component";
import RequireAuth from "./components/RequireAuth.component";
import { Routes, Route } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
