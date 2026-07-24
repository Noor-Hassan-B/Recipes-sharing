import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddRecipe from "./pages/member2/AddRecipe.jsx";
import AboutUs from "./pages/member2/AboutUs.jsx";
import Home from "./pages/member2/Home.jsx";
import Login from "./pages/member2/Login.jsx";
import Recipes from "./pages/member2/Recipes.jsx";
import Signup from "./pages/member2/Signup.jsx";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
