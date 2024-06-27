const { Router } = require('express');
const { productSearch } = require("../Handlers/products");


const router = Router();



router.get('/productSearch', productSearch);
//router.get("/:idProduct", getDetail);


module.exports = router;