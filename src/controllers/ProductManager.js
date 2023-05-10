import { promises as fs } from "fs";
import { nanoid } from "nanoid";
class ProductManager {
    constructor() {
        this.path = "./src/models/products.json";
    }

    readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8");
        return JSON.parse(products);
    };

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product));
    };

    exists = async (id) => {
        let products = await this.readProducts();
        return products.find(product => product.id === id)
    }

    addProducts = async (product) => {
        let productsOld = await this.readProducts();
        product.id = nanoid();
        let productAll = [...productsOld, product];
        await this.writeProducts(productAll);
        return "Producto Añadido";
    };

    getProducts = async () => {
        return await this.readProducts();
    };

    getProductsById = async (id) => {
        let productsById = await this.exists(id)
        if (!productsById) return "El producto no se encuentra";
        return productsById;
    };

    upDateProducts = async (id, product) => {
        let productsById = await this.exists(id);
        console.log(product);
        if(!productsById) return "El producto no se encuentra"
        await this.deleteProducts(id)
        let productOld = await this.readProducts()
        let products = [{...product, id : id}, ...productOld]
        await this.writeProducts(products)
        return "producto modificado"
    };

    deleteProducts = async (id) => {
        let products = await this.readProducts();
        let productExists = products.some((prod) => prod.id === id);
        if (productExists) {
            let filterProducts = products.filter((prod) => prod.id !== id);
            await this.writeProducts(filterProducts);
            return "Producto Eliminado";
        }
        return "El producto que quiere eliminar no se encuentra";
    };
}

export default ProductManager;
