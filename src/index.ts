import express from "express";

const app = express();

app.get("/", (req, res) => {
  try {
    res.json({ msg: "Hello From Server!" });
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env?.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server is Running at:- ${PORT}`);
});
