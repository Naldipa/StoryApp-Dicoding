import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import AddPage from "../pages/add/add-page";
import LoginPage from "../pages/auth/login-page";
import RegisterPage from "../pages/auth/register-page"; // Pastikan path benar

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/add": new AddPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(), // Gunakan new untuk instansiasi
};

export default routes;
