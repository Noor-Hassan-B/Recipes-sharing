import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddRecipe from "./pages/AddRecipe.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Recipes from "./pages/Recipes.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/add-recipes" element={<AddRecipe />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
