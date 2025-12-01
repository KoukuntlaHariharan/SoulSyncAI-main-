# 🌿 **UnmuteMind — AI Companion for Emotional Well-Being**

*A mindful AI chat experience built with Gemini + Node.js + MongoDB + Vanilla JavaScript.*

---

## 🚀 **Overview**

**UnmuteMind** is an AI-powered emotional support chat app designed to let users express themselves freely.
It combines a calming UI, minimal design, and an empathetic Gemini AI chatbot to help users reflect, unload stress, and talk openly — anytime.

✔ **Logged-in users:** Unlimited chats saved
✔ **Guest mode:** 5-message preview using Gemini API
✔ **Light / Dark theme** (syncs across all pages)
✔ **Chat history, create chat, delete chat**
✔ **Fully responsive frontend & clean UX**

---

## 🧩 **Tech Stack**

### **Frontend**

* HTML5
* CSS3 (Custom dual-theme system)
* Vanilla JavaScript (Modular ES Modules)

### **Backend**

* Node.js + Express.js
* MongoDB + Mongoose
* Google Gemini Flash 2.0 API
* JWT Authentication

### **Other Tools**

* nodemon
* dotenv
* Fetch API

---

## 📁 **Project Structure**

```
SoulSyncAI/
│
├── frontend/
│   ├── pages/
│   │   ├── landing.html      
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── chat.html
│   │   ├── chat-guest.html
│   │   └── profile.html
│   │
│   ├── components/
│   │   ├── navbar.html
│   │   ├── sidebar.html
│   │   ├── footer.html
│   │   └── chat-bubble.html
│   │
│   ├── styles/
│   │   ├── main.css
│   │   └── landing.css
│   │
│   ├── scripts/
│   │   ├── app.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── guest_chat.js
│   │   ├── profile.js
│   │   └── utils.js
│   │
│   └── assets/
│       ├── images/
│       └── icons/
│
├── backend/
│   ├── server.js
│   │
│   ├── config/
│   │   ├── env.js
│   │   └── database.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Chat.js
│   │
│   ├── controllers/
│   │   ├── auth_controller.js
│   │   ├── guest_controller.js
│   │   └── chat_controller.js
│   │
│   ├── routes/
│   │   ├── auth_routes.js
│   │   ├── guest_routes.js
│   │   └── chat_routes.js
│   │
│   ├── middleware/
│   │   ├── auth_middleware.js
│   │   └── error_middleware.js
│   │
│   ├── utils/
│   │   └── gemini_client.js
│   │
│   └── package.json
```

---

## 🔧 **Setup Instructions**

### **1️⃣ Clone the repository**

```bash
git clone https://github.com/your-username/UnmuteMind.git
cd UnmuteMind/backend
```

---

### **2️⃣ Install backend dependencies**

```bash
npm install
```

---

### **3️⃣ Create `.env` file**

Inside `/backend`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/unmutemind
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### **4️⃣ Start MongoDB**

(Windows)

```
mongod
```

(Mac/Linux)

```
brew services start mongodb-community
```

---

### **5️⃣ Run backend**

```bash
npm start
```

Should display:

```
✅ MongoDB Connected  
🚀 Server running at http://localhost:5000
```

---

### **6️⃣ Run frontend**

Frontend is pure HTML — just open:

```
frontend/pages/landing.html
```

Or use Live Server in VS Code.

---

## ✨ **Features**

### ⭐ Guest Chat Mode

* Allows **5 AI replies**
* Encourages signup after limit
* Uses Gemini Flash 2.0

### ⭐ Authenticated Chat

* Create named chats
* View saved chats
* Load chat history
* Delete conversations
* Persistent via MongoDB

### ⭐ Gemini Flash 2.0 Integration

* Custom prompt tuning
* Shortened/controlled response length
* Fast & optimized

### ⭐ UI/UX

* ChatGPT-style layout
* Modern sidebar
* Popups for new/delete chat
* Emoji background for login/signup
* Light/Dark mode toggle persists

---

## 🧠 **AI Prompting (Gemini Flash 2.0)**

Your backend uses:

```js
models/gemini-2.0-flash
```

You can extend prompt control inside:

```
backend/utils/gemini_client.js
```

---

## 🗑️ **Delete All Chats / Reset DB**

In Mongo Shell:

```bash
use unmutemind
db.chats.deleteMany({})
```

---

## 🛡️ **Security Notes**

* JWT stored in localStorage
* Backend checks token for every chat request
* Guest mode bypasses token
* No user data stored for guest chats

---

## 🤝 **Contributing**

Pull requests are welcome!
Feel free to open an issue for bug reports or new ideas.
