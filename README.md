# 📹 Live Video Call App

A full-featured **Live Video Call Web Application** with user authentication, real-time communication, and state management. Built using **React, Redux Toolkit, Tailwind CSS**, and Node.js for the backend.

---

## 🚀 Demo
<img width="1867" height="869" alt="Image" src="https://github.com/user-attachments/assets/35245c26-7acb-4d42-9ac8-643289dda3a3" />
<img width="1853" height="781" alt="Image" src="https://github.com/user-attachments/assets/435e3af0-0229-49bd-9c99-d243b8c7e78c" />

<img width="1534" height="877" alt="Image" src="https://github.com/user-attachments/assets/859030fa-d075-4792-90d7-9f6a35f692b9" />

<img width="1806" height="946" alt="Image" src="https://github.com/user-attachments/assets/c82dd02e-eadb-4a14-9747-07adc7d85f29" />

---

## ✨ Features

* User authentication with **signup and login**.
* Real-time **video calls** on web browsers.
* **State management** with Redux Toolkit for global app state.
* Responsive UI built with Tailwind CSS.
* Clean and modular code structure.

---

## 🛠 Tech Stack

* **Frontend:** React, Redux Toolkit, Tailwind CSS
* **Backend:** Node.js, Express
* **Real-time Communication:** WebRTC / Socket.io
* **Database:** MongoDB (or as per your server setup)
* **Others:** JWT for authentication, REST API endpoints

---

## 📁 Project Structure

```
/new-app
├── client/       # React frontend
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── features/     # Redux slices and state management
│   │   ├── pages/        # Login, Signup, Video Call pages
│   │   └── App.jsx       # Main app
│   └── ...
├── server/       # Node.js backend
│   ├── controllers/      # API logic
│   ├── models/           # Database models
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth middleware
│   └── server.js         # Server entry point
└── package.json
```

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abdul-hannan-SE/new-app.git
cd new-app
```

### 2. Backend Setup

```bash
cd server
npm install
# Setup environment variables (e.g., DB connection, JWT secret)
npm start
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

---

## 🚀 Usage

1. Sign up or log in.
2. Enter a room or create a new video call session.
3. Start video calling with other participants in real-time.
4. State is managed globally via Redux Toolkit.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 👤 Author

**Abdul Hannan**

* GitHub: [@abdul-hannan-SE](https://github.com/abdul-hannan-SE)
* Email: [contact.hannan1000@gmail.com](mailto:contact.hannan1000@gmail.com)
