const { conn } = require('../db.js'); // Importa tu instancia de Sequelize


async function productSearch(req, res){
    console.log("[ productSearch ] INICIO");
    let { search } = req.query;
    console.log("[ productSearch ] search --> " + search);

    if (search) {
        search = search.toLowerCase();
        console.log("[ productSearch ] El producto a buscar es: " + search);

        try{
            //Obteniendo el listado de la busqueda usando la FUNCTION: "BazarUniversal"."getProductCategoryNames"
            const result = await getListProducts(search);

            
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

            for(let i=0; i<categoriesWithCount.length; i++){
                console.log("category -->" + categoriesWithCount[i].category);
                console.log("count -->" + categoriesWithCount[i].count);
            }
            
            //const categoriesWithCount = [];
            let resul = {listProducts: result, categoriesWithCount: categoriesWithCount};

            if(result.length){
                console.log("[ productSearch ] Se encontraron " + result.length + " resultados");
                console.log("[ productSearch ] product title: " + result[0].title);
                console.log("[ productSearch ] category name: " + result[0].category);
                return res.status(200).json(resul);
            }
            console.log("[ productSearch ] No hay resultados");
            return res.status(422).json({message: "No hay resultados"}); 

        } catch (error) {
            console.log("[ productSearch ] Ocurrio una excepcion: " + error.message);
            return res.status(404).send(error.message);
        }

    }
    
    return res.status(200).json([]);
}

async function getDetail(req, res){
    console.log("[ products.js/getDetail ] INICIO");
    const { idProduct } = req.params;

    if (idProduct) {
        console.log("[ products.js/getDetail ] El ID del producto a buscar es: " + idProduct);

        try {
            let functionName = "BazarUniversal.productDetail";
            console.log("[ products.js/getDetail ] Se procede a llamar a la funcion: " + functionName);

            //OBS: Pese a que la funcion productDetail en postgresql devuelve un objeto, sequelize lo interpreta como un arreglo,
            //     por eso, productDetail es un arreglo con un solo elemento
            const productDetail = await conn.query('SELECT * FROM "BazarUniversal"."productDetail"(:id)', {
                replacements: { id: idProduct },
                type: conn.QueryTypes.SELECT
            });
            
            if(productDetail.length > 0){
                const product = productDetail[0];
                console.log("[ products.js/getDetail ] Se encontro el detalle del producto");
                console.log("[ products.js/getDetail ] El producto es: " + product.title);

                //Llamar a la funcion para obtener su listado de imagenes
                const listID = [product.p_id];
                functionName = "BazarUniversal.getImagesByProduct";
                console.log("[ products.js/getDetail ] Se procede a llamar a la funcion: " + functionName);
                const productImages = await conn.query('SELECT * FROM "BazarUniversal"."getImagesByProduct"(ARRAY[:productIds])', {
                    replacements: { productIds: listID },
                    type: conn.QueryTypes.SELECT
                });

                if(productImages.length > 0){
                    console.log("[ products.js/getDetail ] El producto tiene " + productImages.length + " imagenes");
                    const listUrl = productImages.map((images) => images.url);
                    product.images = listUrl;
                }else{
                    product.images = [];
                }

                console.log("[ products.js/getDetail ] FIN");
                return res.status(200).json(product);
            }

            console.log("[ products.js/getDetail ] No hay resultados");
            console.log("[ products.js/getDetail ] FIN");
            return res.status(422).json({message: "No hay resultados"}); 

        } catch (error) {
            console.error("[ products.js/getDetail ] Error al llamar a la funcion: " + functionName, error);
            throw error;
        }
    }

    /*
    const listProducts = getListProducts();

    if (idProduct) {
        console.log("[ src/routes/products.js/:idProduct ] El id a buscar es: " + idProduct);
        const product = listProducts.filter(p => p.id == idProduct);
        if(product.length){
            console.log("[ src/routes/products.js/:idProduct ] Se encontro el detalle del producto");
            console.log("[ src/routes/products.js/:idProduct ] El producto es: " + product[0].title);
            return res.status(200).json(product[0]);
        }
        console.log("[ src/routes/products.js/:idProduct ] No hay resultados");
        return res.status(422).json({message: "No hay resultados"}); 
    }
    */

    return res.status(400).json({message: "Falta enviar datos obligatorios"});
}



async function getListProducts(search) {
    console.log("[ products.js/getListProducts ] INICIO");
    try {
        let functionName = "BazarUniversal.getProductCategoryNames";
        console.log("[ products.js/getListProducts ] Se procede a llamar a la funcion: " + functionName);
        const listProducts = await conn.query('SELECT * FROM "BazarUniversal"."getProductCategoryNames"(:search)', {
            replacements: { search: search },
            type: conn.QueryTypes.SELECT
        });


        const listID = listProducts.map((product) => product.p_id);

        functionName = "BazarUniversal.getImagesByProduct";
        console.log("[ products.js/getListProducts ] Se procede a llamar a la funcion: " + functionName);
        const listImagesByProduct = await conn.query('SELECT * FROM "BazarUniversal"."getImagesByProduct"(ARRAY[:productIds])', {
            replacements: { productIds: listID },
            type: conn.QueryTypes.SELECT
        });

        //Se setea a cada producto su correspondiente arreglo de imagenes
        for (let product of listProducts) {
            // Filtra las imágenes correspondientes al producto actual
            const productImages = listImagesByProduct.filter(image => image.product_id === product.p_id);

            const listUrl = productImages.map((images) => images.url);

            // Agrega el atributo "images" al objeto product con el arreglo de imágenes correspondientes
            product.images = listUrl;
        }
        
        console.log("[ products.js/getListProducts ] FIN");
        return listProducts;
    } catch (error) {
        console.error("[ products.js/getListProducts ] Error al llamar a la funcion: " + functionName, error);
        throw error;
    }
}

module.exports = {
    productSearch,
    getDetail
};