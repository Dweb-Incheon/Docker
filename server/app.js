require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// MongoDB 연결 URL
const mongoURI = process.env.MONGODB_URL; // 사용자명, 비밀번호, DB명으로 바꾸기

// MongoDB 연결
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Mongoose Schema 및 모델 정의
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

// Express에서 JSON 데이터를 사용할 수 있도록 설정
app.use(express.json());

// 1. Create (사용자 추가)
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});

// 2. Read (모든 사용자 조회)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // 모든 사용자 조회
    res.json(users); // JSON 형식으로 응답
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

// 3. Read (ID로 특정 사용자 조회)
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // 특정 사용자 조회
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
});

// 4. Update (사용자 정보 수정)
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
});

// 5. Delete (사용자 삭제)
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id); // 사용자 삭제
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted", deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
