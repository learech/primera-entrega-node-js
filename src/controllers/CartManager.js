import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const allProducts = new ProductManager();

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json";
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    };

    writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart));
    };

    exists = async (id) => {
        let carts = await this.readCarts();
        return carts.find((cart) => cart.id === id);
    };

    addCarts = async () => {
        let cartsOld = await this.readCarts();
        let id = nanoid();
        let cartsConcat = [{ id: id, products: [] }, ...cartsOld];
        await this.writeCarts(cartsConcat);
        return "Carrito agregado";
    };

    getCartsById = async (id) => {
        let cartsById = await this.exists(id);
        if (!cartsById) return "El carrito no se encuentra";
        return cartsById;
    };

    addProductToCart = async (cartId, productId) => {
        let cartsById = await this.exists(cartId);
        if (!cartsById) return "El carrito no se encuentra";
        let productsById = await allProducts.exists(productId);
        if (!cartsById) return "El producto no se encuentra";

        let allCarts = await this.readCarts();
        let cartFilter = allCarts.filter((cart) => cart.id != cartId);

        if (cartsById.products.some((prod) => prod.id === productId)) {
            let moreProductInCart =
                cartsById.products.find((prod) => prod.id === productId);
            moreProductInCart.cantidad++;
            let cartsConcat = [cartsById, ...cartFilter]
            await this.writeCarts(cartsConcat);
            return "Producto sumado a la cantidad del carrito";
        }

        cartsById.products.push({id: productsById.id, cantidad:1 })
        
        let cartsConcat = [cartsById, ...cartFilter];
        await this.writeCarts(cartsConcat);
        return "Producto agregado al carrito";
    };
}

export default CartManager;
