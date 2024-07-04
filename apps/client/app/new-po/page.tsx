
"use client"
import React, { useState, FormEvent } from 'react'


interface PurchaseOrder {
    id: number;
    vendor_name: string;
    order_date: string;
    expected_delivery_date: string;
  }
  
async function getAllItems(): Promise<[]> {
    const res = await fetch('http://localhost:3100/api/parent-items', {cache: 'no-cache'});
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}
  
export default async function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const allItems = await getAllItems()
  let chosenItems = []
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors when a new request starts
 
    try {
      const formData = new FormData(event.currentTarget)
      let formObject = Object.fromEntries(formData.entries());
      console.log(formObject)
      console.log(chosenItems)
      formObject["items"]=chosenItems
      const response = await fetch('http://localhost:3100/api/purchase-orders', {
        method: 'POST',
        body: JSON.stringify(formObject),
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        })
      })
 
      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to submit the data. Please try again.')
      } else {

      }
 
      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Capture the error message to display to the user
      console.log(error)
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }


    
  }

  function onchangeItem(val,item){
    item.quantity = +val
    chosenItems.push(item)
  
    
    chosenItems = chosenItems.filter((obj1, i, arr) => 
      arr.findIndex(obj2 => (obj2.id === obj1.id)) === i
    )
  }
 
  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form className="max-w-md mx-auto" onSubmit={onSubmit}>
        <div className="relative z-0 w-full mb-5 group">
            <input type="text" name="vendor_name"  className="block py-2.5 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Vendor Name</label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
            <input type="datetime-local" name="order_date"  className="block py-2.5 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Order Date</label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
            <input type="datetime-local" name="expected_delivery_date"  className="block py-2.5 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Delivery Date</label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
        {allItems.map((parentItem) => (
         <>
         <h3>{parentItem.name}</h3>
         
         {parentItem.items.map((item) => {
           
            return (
            <div className="relative z-0 w-full mb-5 group">
                <input onChange={(ev)=>{onchangeItem(ev.target.value, item)}} type="number" defaultValue="0" className="block py-2.5 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                <label className="ms-2 text-sm font-medium text-white-900">{item.name} ({item.sku}) - {item.price}</label>
            </div>
            )
})}
         </>     
        ))}
       
            
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}