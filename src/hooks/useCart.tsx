import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  //const [stock,setStock] = useState<Stock[]>([]);  
  const [cart, setCart] = useState<Product[]>(() => {
  const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
       return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO
      const stockItemIdAmount = (await api.get(`/stock/${productId}`)).data.amount;
      for(let index in cart){
        if(cart[index].id === productId){
          if( (cart[index].amount + 1) > stockItemIdAmount ){
             toast.error('Quantidade solicitada fora de estoque'); 
             return;
          }
          cart[index].amount = cart[index].amount + 1;
          setCart([...cart]);
          return;
        }
      }
      let newProduct:Product;
      let item = localStorage.getItem('@RocketShoes:productAdded') || '';
      if(item){
        newProduct = JSON.parse(item);
        newProduct.amount = 1;
        setCart([...cart,newProduct]);
      }
      localStorage.setItem('@RocketShoes:cart',JSON.stringify(cart));
    } catch {
      // TODO
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      for(let index in cart){
        if(cart[index].id === productId){
           cart.splice(Number(index),1);
           break;  
        }
      }
      //localStorage.setItem('@RocketShoes:cart',JSON.stringify(cart));
      setCart([...cart]);
    } catch {
      // TODO
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      const stockItemIdAmount = (await api.get(`/stock/${productId}`)).data.amount;
      if(amount <= 0){
        return;
      }
      if(amount > stockItemIdAmount){
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }
      //console.log("UpdateProductAmout - productId: ",productId," - amount: ",amount);
      //console.log("updateProductAmount - cart: ",cart);
      for(let index in cart){
        if(cart[index].id === productId){
          cart[index].amount = amount;
          setCart([...cart]);
          break;
        }
      }
      return {productId:amount};
    } catch {
      // TODO
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
