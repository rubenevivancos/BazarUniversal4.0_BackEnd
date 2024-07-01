const { Product, Image } = require('../db.js');


async function productSearchResult(search){
    console.log("[ Controllers_products.js_productSearchResult ] INICIO");

    try {
        //Obteniendo el listado de la busqueda
        const products = await getListProducts(search);

        if(products.length){
            console.log("[ Controllers_products.js_productSearchResult ] Se encontraron " + products.length + " resultados");

            //Se obtiene un arreglo solo con los ids de los productos
            const productIds = products.map((product) => product.p_id);

            //Se obtienen todas las imagenes de los productos
            const listImages = await Image.find({ product_id: { $in: productIds } });

            //Se setea a cada producto su correspondiente arreglo de imagenes
            for (let product of products) {
                // Filtra las imágenes correspondientes al producto actual
                const productImages = listImages.filter(image => image.product_id === product.p_id);

                const listUrl = productImages.map((images) => images.url);

                // Agrega el atributo "images" al objeto product con el arreglo de imágenes correspondientes
                product.images = listUrl;
            }
            
            return products;
        }
        console.log("[ Controllers_products.js_productSearchResult ] No hay resultados");
        return []; 

    } catch (error) {
        console.log("[ Controllers_products.js_productSearchResult ] Ocurrio una excepcion: " + error.message);
        return null;
    }

}


async function getProductDetail(productId){
    console.log("[ Controllers_products.js_getProductDetail ] INICIO");

    try {
        const product = await Product.findById(productId);
        console.log("[ Controllers_products.js_getProductDetail ] FIN");
        return product;
    } catch (error) {
        console.error("[ Handlers_products.js_getProductDetail ] Error:", error);
        return null;
    }
}


async function getProductImages(productId){
    console.log("[ Controllers_products.js_getProductImages ] INICIO");

    try {
        const images = await Image.find({ product_id: productId });
        return images;
    } catch (error) {
        console.error("[ Handlers_products.js_getProductImages ] Error:", error);
        return [];
    }    
}


async function getListProducts(search){
    console.log("[ Controllers_products.js_getListProducts ] INICIO");

    const searchRegex = new RegExp(search, 'i');

    try {
        //Obteniendo el listado de la busqueda
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
                    $or: [
                        { title: { $regex: searchRegex } },
                        { 'category_info.name': { $regex: searchRegex } }
                    ]
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

        return products;

    } catch (error) {
        console.log("[ Controllers_products.js_getListProducts ] Ocurrio una excepcion: " + error.message);
        return null;
    }

}


module.exports = {
    productSearchResult,
    getProductDetail,
    getProductImages
};