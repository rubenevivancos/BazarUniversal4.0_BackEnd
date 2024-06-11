const { Router } = require('express');
const { productSearch, getDetail } = require("../Controllers/products");


const router = Router();



router.get('/productSearch', productSearch);
router.get("/:idProduct", getDetail);


module.exports = router;