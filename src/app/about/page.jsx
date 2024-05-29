"use client"
import React from 'react'
import PricingCatalog from '../../components/PricingCatalog';
import Navbar from '../../components/NavBar';

const page = () => {
  return (
    <div className="bg-white">
        <Navbar/>
        <div className='flex justify-center mt-4'>
            <PricingCatalog/>
        </div>
        
    </div>
  )
}

export default page