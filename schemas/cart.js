const mongoose = require("mongoose");

//스키마란? 컬렉션에 들어가는 문서(Document)에 어떤 종류의 값이 들어가는지를 정의한다.
const cartSchema = new mongoose.Schema({
  goodsId: {
    type: Number,
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true, // 무조건 존재해야된다는 개념!
  },
});

module.exports = mongoose.model("Cart", cartSchema);
