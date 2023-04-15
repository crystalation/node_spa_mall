const express = require("express");
const router = express.Router();

// /routes/goods.js
const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

router.get("/goods", (req, res) => {
  res.json({ goods }); //goods라는 키로 goods라는 변수 안에 들어있는걸 ~
});

router.get("/goods/:goodsId", (req, res) => {
  const { goodsId } = req.params;

  //   let result = null;
  //   for (const good of goods) {
  //     //여기서 good이라는 변수를 선언해주는것?
  //     if (Number(goodsId) === good.goodsId) {
  //       result = good;
  //     }
  //   }

  //위의 for문을 아래 filter 함수로 바꾼 것
  const [detail] = goods.filter((good) => Number(goodsId) === good.goodsId);
  res.json({ detail });
});

const Cart = require("../schemas/cart.js");
router.post("/goods/:goodsId/cart", async (req, res) => {
  const goodsId = req.params.goodsId;
  const quantity = req.body.quantity;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    //장바구니에 상품을 등록할때 이미 존재한다면, 에러를 일으켜라
    return res.status(400).json({
      success: false,
      errorMessage: "이미 장바구니에 해당하는 상품이 존재합니다.",
    });
  }

  await Cart.create({ goodsId, quantity }); //goodsId와 quantity에 해당하는 값을 Cart라는 스키마를 통해 만들꺼야

  //성공적으로 만들었다면
  res.json({ result: "success" });
});

router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.updateOne(
      { goodsId: goodsId }, //goodsId에 해당하는 값이 있을때, 수정할겁니다.
      { $set: { quantity: quantity } } //quantity를 quantity로
    );
  }
  res.status(200).json({ success: true });
  //장바구니에 값이 존재하던 말던 success가 true, 즉 에러가 발생하지 않는다!
});

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId });
  }

  res.json({ result: "success" });
});

const Goods = require("../schemas/goods.js");
router.post("/goods/", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body; //객체구조분해할당

  const goods = await Goods.find({ goodsId });
  //첫번째로 goodsId가 있는지 아닌지 확인, 실제로 db에 존재하는지 //await로 동기적인 처리를 할거임. 데이터가 확인되기 전에는 다른걸 하지 말라는 뜻
  if (goods.length) {
    //data가 있으면 goods.length가 0이 아니며, 0이 아닐 경우에는 데이터가 존재한다는 뜻
    return res.status(400).json({
      success: false,
      errorMessage: "이미 존재하는 GoodsId 입니다.",
    });
  }

  const createdGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });
  res.json({ goods: createdGoods });
});
module.exports = router;
