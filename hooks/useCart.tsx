import {useEffect, useState} from "react";
import {getData, storeData} from "../utils/AsyncStorage";
import {DataKey} from "../models/Static";
import {ProductModel} from "../models/ProductModel";
import {CartModel} from "../models/CartModel";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/ReduxStore";
import {updateCart} from "../store/features/CartSlice";

export const useCart = () => {
    const cartState = useSelector((state: RootState) => state.cart)
    const dispatch = useDispatch()

    const [cartCount, setCartCount] = useState(0);
    const [fee, setFee] = useState(0);
    const [total, setTotal] = useState(0);
    const [subTotal, setSubTotal] = useState(0);

    useEffect(() => {
        (async () => await calcTotal())()
    }, [cartState.cart]);

    const initCart = async () => {
        const localCart = await getCart();
        await storeAndDispatch(localCart)
    }

    const addToCart = async (product: ProductModel, quantity?: number) => {
        const localCart = await getCart();
        const index = await getProductIndex(product);
        index === -1 ? localCart.push({product, quantity: quantity ? quantity : 1}) :
            localCart[index].quantity = quantity ? quantity : localCart[index].quantity + 1;
        await storeAndDispatch(localCart)
    }

    const removeFromCart = async (product: ProductModel) => {
        const localCart = await getCart();
        const index = await getProductIndex(product);
        if (index !== -1) {
            localCart.splice(index, 1);
            await storeAndDispatch(localCart);
        }
    }

    const storeAndDispatch = async (cart: CartModel[]) => {
        await storeData(DataKey.cart, JSON.stringify(cart))
        dispatch(updateCart(cart))
    }

    const clearCart = async () => {
        await storeAndDispatch([])
    }

    const getProductFromCart = async (product: ProductModel): Promise<CartModel | null> => {
        const localCart = await getCart();
        const index = await getProductIndex(product)
        return index !== -1 ? localCart[index] : null;
    }

    const getProductIndex = async (product: ProductModel): Promise<number> => {
        const localCart = await getCart();
        return localCart.findIndex(value => value.product.id === product.id)
    }

    const getCart = async (): Promise<CartModel[]> => {
        const storedCart = await getData(DataKey.cart);

        if (!storedCart) return [];

        return JSON.parse(storedCart)
    }

    const calcTotal = async () => {
        let tot = 0;
        let totCount = 0;

        cartState.cart.forEach(value => {
            totCount += value.quantity;
            tot += value.quantity * value.product.price;
        })
        setCartCount(totCount);
        setTotal(tot + fee);
        setSubTotal(tot);
    }

    return {
        initCart,
        addToCart,
        removeFromCart,
        clearCart,
        getProductFromCart,
        cart: cartState.cart,
        cartCount,
        fee,
        total,
        subTotal
    }
}
