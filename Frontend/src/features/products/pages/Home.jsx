import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'

const Home = () => {

    const products = useSelector(state => state.product.products)
    const {handleGetAllProducts} = useProduct()
    console.log(products)

    useEffect(()=>{
        handleGetAllProducts()
    },[])
  return (
    <div>
      this is Home page
    </div>
  )
}

export default Home
