import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../api";
import { showAlert, clearAlert, removeUser } from "../../features/";
import { useNavigate } from "react-router-dom";

const navigationLink = ({ lable, navigatesTo }) => {
  return (
    <li>
      <NavLink
        to={navigatesTo}
        className={({ isActive }) =>
          `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 ${
            isActive ? "text-orange-600" : "text-black"
          } lg:p-0`
        }
      >
        {lable}
      </NavLink>
    </li>
  );
};

function Header() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const logutUser = async () => {
    const res = await logout(user?._id);
    if (res.success) {
      dispatch(removeUser());
      dispatch(showAlert({ message: "logOut success", severity: "info" }));
      navigateTo("/login");
    } else {
      dispatch(showAlert({ message: res.message, severity: "error" }));
    }
    setTimeout(() => {
      dispatch(clearAlert());
    }, 3000);
  };

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img
              src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
              className="mr-3 h-12"
              alt="Logo"
            />
          </Link>
          <div className="flex items-center lg:order-2">
            {user === null ? (
              <Link
                to="/login"
                className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Log in
              </Link>
            ) : (
              <Link
                onClick={logutUser}
                className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                LogOut
              </Link>
            )}

            <Link
              to="#"
              className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
            >
              Get started
            </Link>
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {navigationLink({ lable: "Home", navigatesTo: "/" })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
