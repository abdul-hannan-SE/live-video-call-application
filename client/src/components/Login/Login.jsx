// src/components/Login.js
import React, { useContext, useEffect, useState } from "react";
import Input from "../common/Input";
import InputBtn from "../common/InputBtn";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LoadingIndicator from "../common/LoadingIndicator";
import { login } from "../../api";
import { clearAlert, showAlert, addUser } from "../../features/";
import { socketContext } from "../../context/socket";
const Login = () => {
  const ctx = useContext(socketContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const loginHandler = async () => {
    setLoading(true);
    const res = await login({
      email: email,
      password: password,
    });
    if (res.success) {
      const user = res.data;
      dispatch(addUser(user));
      console.log("socket ref is : ", ctx?.socketRef);

      ctx?.socketRef?.emit("addUser", user.user?._id);
      dispatch(
        showAlert({
          message: "Login success",
          severity: "success",
        })
      );
      navigateTo("/", { replace: true });
    } else {
      dispatch(showAlert({ message: res.message, severity: "error" }));
    }
    setTimeout(() => {
      dispatch(clearAlert());
    }, 2000);
    setLoading(false);
    return res;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginHandler();
  };
  useEffect(() => {
    if (!user) return;
    setEmail(user.email);
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg w-full"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <Input
          type="email"
          placeholder="Enter your email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <InputBtn text="Login" type="submit" onClick={loginHandler} />
        )}
      </form>
      <div className="flex justify-center w-full content-center mt-5">
        <span className="col-span-1">Don't have an account?</span>
        <Link className="mx-4 font-bold" to="/signUp">
          SignUp
        </Link>
      </div>
    </div>
  );
};

export default Login;
