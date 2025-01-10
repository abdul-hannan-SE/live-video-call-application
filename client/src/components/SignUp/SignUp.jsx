import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import Input from "../common/Input";
import InputBtn from "../common/InputBtn";
import LoadingIndicator from "../common/LoadingIndicator";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signUp } from "../../api";
import { clearAlert, showAlert, addUser } from "../../features/";

const SignUp = () => {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const signUpHandler = async (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    if (
      username.length <= 0 ||
      email.length <= 0 ||
      password.length > 6 ||
      password.length <= 0 ||
      avatar == null
    ) {
      dispatch(
        showAlert({ message: "All feilds required", severity: "warning" })
      );
      setTimeout(() => {
        dispatch(clearAlert());
      }, 2000);
      setLoading(false);
      return;
    }

    const response = await signUp(formData);
    if (response.success) {
      dispatch(
        showAlert({
          message: "Sign-Up successful please login",
          severity: "success",
        })
      );
      setEmail("");
      setPassword("");
      setUsername("");
      setAvatar(null);
      const user = response.data;
      dispatch(addUser(user));
      navigateTo("/login", { replace: true });
    } else {
      dispatch(showAlert({ message: response.message, severity: "error" }));
    }
    setTimeout(() => {
      dispatch(clearAlert());
    }, 3000);
    setLoading(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    signUpHandler();
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg w-full"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        {/* Avatar Upload Section */}
        <div className="flex justify-center mb-6 relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
            {avatar ? (
              <img
                src={URL.createObjectURL(avatar)}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <span className="text-4xl">😀</span> {/* Default avatar */}
              </div>
            )}
          </div>

          {/* Camera Icon and File Input */}
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow cursor-pointer"
          >
            <FaCamera className="text-gray-500" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        {/* Signup Form Fields */}
        <Input
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <InputBtn text="Sign Up" type="submit" />
        )}
      </form>
    </div>
  );
};

export default SignUp;
