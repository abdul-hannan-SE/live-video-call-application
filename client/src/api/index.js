// src/api/index.js

// This index file centralizes all exports from files within the "api" folder.
// By importing all functions from individual API files (like authApi) here,
// we can then export them from a single file. This makes it easier to import
// multiple API functions into components or other parts of the app in a
// more organized and concise way.

import { signUp, login, logout } from "./authApi";
import { getAllUsers, getCurrentUser } from "./userApi";
export { signUp, login, logout, getCurrentUser, getAllUsers };
