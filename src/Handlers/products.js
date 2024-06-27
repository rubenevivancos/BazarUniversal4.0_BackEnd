const { productSearchResult } = require('../Controllers/products.js');



async function productSearch(req, res){
    console.log("[ Handlers_products.js_productSearch ] INICIO");
    let { search } = req.query;
    console.log("[ Handlers_products.js_productSearch ] search --> " + search);

    if (search) {
        search = search.toLowerCase();
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

module.exports = {
    productSearch
};