const { Router } = require('express');
const { productSearch, getDetail } = require("../Handlers/products");


const router = Router();



router.get('/productSearch', productSearch);
router.get("/:productId", getDetail);


module.exports = router;