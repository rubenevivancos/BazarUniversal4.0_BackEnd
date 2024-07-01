const { productSearchResult, getProductDetail, getProductImages } = require('../Controllers/products.js');



async function productSearch(req, res){
    console.log("[ Handlers_products.js_productSearch ] INICIO");
    let { search } = req.query;
    console.log("[ Handlers_products.js_productSearch ] search --> " + search);

    if (search) {
        console.log("[ Handlers_products.js_productSearch ] El producto a buscar es: " + search);

        try{
            //Obteniendo el listado de la busqueda
            const result = await productSearchResult(search);

            if(result.length){
                console.log("[ Handlers_products.js_productSearch ] Se encontraron " + result.length + " resultados");

                //Obteniendo la cantidad de productos por categoria del listado de la busqueda: INICIO
                const categories = result.map((object) => object.category);
                const uniqueCategories = new Set(categories);

                uniqueCategories.forEach((category) => {
                    console.log("category --> " + category);
                });

                const categoriesWithCount = [];

                uniqueCategories.forEach((category) => {
                    const objectsByCategory = result.filter((object) => object.category === category);
                    categoriesWithCount.push({ category: category, count: objectsByCategory.length });
                });
                //Obteniendo la cantidad de productos por categoria del listado de la busqueda:FIN

                let resul = {listProducts: result, categoriesWithCount: categoriesWithCount};


                return res.status(200).json(resul);
            }
            console.log("[ Handlers_products.js_productSearch ] No hay resultados");
            return res.status(422).json({message: "No hay resultados"}); 

        } catch (error) {
            console.log("[ Handlers_products.js_productSearch ] Ocurrio una excepcion: " + error.message);
            return res.status(404).send(error.message);
        }
    }
    
    return res.status(200).json({message: "Ingrese una palabra para buscar"});
}


async function getDetail(req, res){
    console.log("[ Handlers_products.js_getDetail ] INICIO");
    const { productId } = req.params;

    if (productId) {
        console.log("[ Handlers_products.js_getDetail ] El ID del producto a buscar es: " + productId);

        try {
            let productDetail = await getProductDetail(productId);
            
            if(productDetail){
                console.log("[ Handlers_products.js_getDetail ] Se encontro el detalle del producto");
                console.log("[ Handlers_products.js_getDetail ] El producto es: " + productDetail.title);

                //Obtener su listado de imagenes
                const productImages = await getProductImages(productDetail._id);

                if(productImages.length > 0){
                    console.log("[ Handlers_products.js_getDetail ] El producto tiene " + productImages.length + " imagenes");
                    const listUrl = productImages.map((images) => images.url);
                    console.log("listUrl --> " + listUrl.length);
                    productDetail.images = listUrl;
                    console.log("productDetail.images --> " + productDetail.images.length);
                    console.log("productDetail.images[0] --> " + productDetail.images[0]);
                    console.log("productDetail.images[1] --> " + productDetail.images[1]);
                    console.log("productDetail.images[2] --> " + productDetail.images[2]);
                }else{
                    console.log("[ Handlers_products.js_getDetail ] El producto NO tiene imagenes");
                    productDetail.images = [];
                }

                console.log("[ Handlers_products.js_getDetail ] FIN");
                res.setHeader('Cache-Control', 'no-store');
                let resul = {productDetail: productDetail, listUrl: productDetail.images};
                return res.status(200).json(resul);
            }

            console.log("[ Handlers_products.js_getDetail ] No hay resultados");
            console.log("[ Handlers_products.js_getDetail ] FIN");
            return res.status(422).json({message: "No hay resultados"}); 

        } catch (error) {
            console.error("[ Handlers_products.js_getDetail ] Error:", error);
            throw error;
        }
    }

    return res.status(400).json({message: "Falta enviar datos obligatorios"});
}


module.exports = {
    productSearch,
    getDetail
};