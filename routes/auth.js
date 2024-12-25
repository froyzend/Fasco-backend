const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

/* Хранилище пользователей (в памяти)*/
const users = [];

router.get("/", (req, res) => {
  res.send("Users route");
});
/* Регистрация*/
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  /* Проверка, существует ли пользователь*/
  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  /* Хэширование пароля*/
  const hashedPassword = await bcrypt.hash(password, 10);

  /*Добавление пользователя в массив*/
  users.push({ name, email, password: hashedPassword });
  res.status(201).json({ message: "User created" });
});

/* Логин*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  /* Поиск пользователя по email*/
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  /* Проверка пароля*/
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Logged in successfully" });
});

/* Получение текущего пользователя*/
router.get("/current", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* Поиск пользователя по email (id в данном случае — это email)*/
    const user = users.find((user) => user.email === decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
