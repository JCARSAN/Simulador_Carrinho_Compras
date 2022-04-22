import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  //console.log("Cart: ",cart);
  let cartAmountItems:CartItemsAmount={};

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
     cartAmountItems[product.id] = product.amount;
     return cartAmountItems;
  }, {} as CartItemsAmount)
  
  //console.log("Home cartItemsAmount: ",cartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      // TODO
      api.get('/products')
        .then(response => setProducts(response.data));
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    //console.log("handleAddProduct id: ",id);
    //console.log("O item de id: ",id," foi adicionado ao carrinho");
    //localStorage.setItem('@RocketShoes:cart',JSON.stringify([...cart,products[id]]));
    //localStorage.removeItem('@RocketShoes:cart');
    localStorage.removeItem('@RocketShoes:productAdded');
    let newProduct;
    for(let index in products){
       if(products[index].id === id){
         newProduct = products[index];
         break;
       }
    }
    localStorage.setItem('@RocketShoes:productAdded',JSON.stringify(newProduct));
    addProduct(id);
    //console.log("newProduct: ",newProduct);
    //addProduct(id);
    //console.log("handleProduct Cart: ", cart);
    //console.log("cartAmountItems: ",cartAmountItems);
  }

  return (
    <ProductList>
      { products.map(product => {
        return(
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <strong>{product.title}</strong>
              <span>R$ {product.price}</span>
              <button
                type="button"
                data-testid="add-product-button"
                onClick={() => handleAddProduct(product.id)}
              >
                <div data-testid="cart-product-quantity">
                  <MdAddShoppingCart size={16} color="#FFF" />
                  { cartItemsAmount[product.id] || 0 } 
                </div>

                <span>ADICIONAR AO CARRINHO</span>
              </button>
            </li>
          )
      } )}
    </ProductList>
  );
};

export default Home;
