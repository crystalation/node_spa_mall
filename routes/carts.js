const express = require("express");
const router = express.Router();

const Cart = require("../schemas/cart.js");
const Goods = require("../schemas/goods.js");
const cart = require("../schemas/cart.js");

//localhost:3000/api/carts 라는걸 GET 메서드로 호출할 때
router.get("/carts", async (req, res) => {
  const carts = await Cart.find({}); //1. cart안에 있는 모든 data를 가져와서 carts에 할당할거야
  //[
  //    {goodsId, quantity},
  //    {goodsId, quantity} goodsId라는걸 한번 더 가져와야돼
  //]
  const goodsId = carts.map((cart) => {
    //2. 장바구니 안에 있는 모든 상품의 'Id'를 찾고
    return cart.goodsId; //반복문을 돌면서 goodsId만 뺄거야
  });
  //결과적으로 요런 배열을 구할 것[2, 11, 1]

  const goods = await Goods.find({ goodsId: goodsId }); //3. 상품의 Id를 통해서 상세정보를 가져올꺼고, schema.find의 형태
  //Goods에 해당하는 모든 정보를 가지고 올껀데, 만약 goodsId 변수 안에 존재하는 값일 때에만 조회해라
  //결국 위에서 도출한 [2, 11, 1]에 해당하는 값이면~goods에 할당해라

  const results = carts.map(
    (
      cart //는 {goodsId, quantity}
    ) => {
      return {
        //return이 어떻게 반환되야하는지 생각하면서 구성한다
        quantity: cart.quantity,
        goods: goods.find((item) => item.goodsId === cart.goodsId), //array.find의 형태
      };
    }
  );

  res.json({
    carts: results,
  }); //결과값은 빈 '배열'로 출력이 될 것, 아직 상품정보를 입력하지 않았기에ㅇㅇ
});

module.exports = router;
