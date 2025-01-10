import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Home from "./Home/Home";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";
import NotFound from "./common/404";
import LoadingIndicator from "./common/LoadingIndicator";
import AlertMessage from "./common/AlertMessage";
export {
  Header,
  Footer,
  SignUp,
  Login,
  Home,
  NotFound,
  LoadingIndicator,
  AlertMessage,
};
// src/components/index.js

// This index file centralizes all exports from files within the "components" folder.
// By importing all functions from individual components files (like SignUp, Login) here,
// we can then export them from a single file. This makes it easier to import
// multiple component functions into components or other parts of the app in a
// more organized and concise way.
