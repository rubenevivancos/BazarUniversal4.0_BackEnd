const { Product } = require('../db.js');


async function productSearchResult(search){
    console.log("[ Controllers_products.js_productSearchResult ] INICIO");

    try{
        //Obteniendo el listado de la busqueda
        const searchRegex = new RegExp(search, 'i');

        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'Category',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category_info'
                }
            },
            {
                $unwind: '$category_info'
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            { $regexMatch: { input: { $toLower: '$title' }, regex: search.toLowerCase() } },
                            { $regexMatch: { input: { $toLower: '$category_info.name' }, regex: search.toLowerCase() } }
                        ]
                    }
                }
            },
            {
                $project: {
                    p_id: '$_id',
                    title: 1,
                    description: 1,
                    price: 1,
                    discountpercentage: 1,
                    rating: 1,
                    stock: 1,
                    brand: 1,
                    thumbnail: 1,
                    category_id: 1,
                    c_id: '$category_info._id',
                    category: '$category_info.name'
                }
            }
        ]);


        if(products.length){
            console.log("[ Controllers_products.js_productSearchResult ] Se encontraron " + products.length + " resultados");
            return products;
        }
        console.log("[ Controllers_products.js_productSearchResult ] No hay resultados");
        return []; 

    } catch (error) {
        console.log("[ Controllers_products.js_productSearchResult ] Ocurrio una excepcion: " + error.message);
        return null;
    }

}


module.exports = {
    productSearchResult
};