const express = require("express");
const app = express();
const port = 3000;

const goodsRouter = require("./routes/goods.js");
const cartsRouter = require("./routes/carts.js");
const connect = require("./schemas/index.js");
connect();

app.use(express.json()); //req안에 body를 사용하기 위해선 반드시 작성해야함
app.use("/api", [goodsRouter, cartsRouter]); //api를 연결하는 단계

app.post("/", (req, res) => {
  console.log(req.body);

  res.send("기본 URL에 POST 메소드가 정상적으로 실행되었습니다. ");
});

app.get("/", (req, res) => {
  console.log(req.query);

  const obj = {
    KeyKey: "이름입니다.",
    "이름입니다.": "이름일까요?",
  };
  res.json(obj);
});

app.get("/:id", (req, res) => {
  console.log(req.params);

  res.send(":id URL에 정상적으로 반환되었습니다.");
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

//localhost:3000/api -> goodsRouter
// app.use("/api", goodsRouter);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
