import React from 'react'
import Navbar from '../../components/NavBar';

const page = () => {
  return (
    <div>
        <Navbar/>
        <div className='mt-5'>
            <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
            <stripe-pricing-table pricing-table-id="prctbl_1P1G7oRquv3tbGOm6Nen1YuR"
            publishable-key="pk_live_51P0BqGRquv3tbGOmnTdSbqESC0AAHiyadppdTSff5FlUKcFQC8k4vq2pHrH8kpOoHlh2aYnLpWtBUhabUQaIdsjL00oaxJtOdX">
            </stripe-pricing-table>
        </div>
    </div>
   
    
  )
}

export default page