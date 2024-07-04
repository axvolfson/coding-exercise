import Link from "next/link";
interface PurchaseOrder {
  id: number;
  vendor_name: string;
  order_date: string;
  expected_delivery_date: string;
}
async function getData(): Promise<[PurchaseOrder]> {
  const res = await fetch('http://localhost:3100/api/purchase-orders', {cache: 'no-cache'});
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
export default async function Index() {
  const data = await getData()
  return (
    <>
      <h1 className="text-2xl">Purchase Orders</h1>

      <table className="w-full mt-4">
        <thead>
          <tr className="text-left">
            <th>ID</th>
            <th>Vendor</th>
            <th>Ordered</th>
            <th>Expected Delivery</th>
          </tr>
        </thead>
      <tbody>
      {data.map((po) => {
        const orderDate = new Date(po.order_date);
        const orderDateFormat = new Intl.DateTimeFormat('en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(orderDate);

        const deliveryDate = new Date(po.expected_delivery_date);
        const deliveryDateFormat = new Intl.DateTimeFormat('en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(deliveryDate);

         
        
        return (
        <tr>
            <td>{po.id}</td>
            <td>{po.vendor_name}</td>
            <td>{orderDateFormat}</td>
            <td>{deliveryDateFormat}</td>
            
        </tr>
      )})}  
      </tbody>
      </table>
      <Link href="/new-po" className="btn mt-4  normal-case">New Purchase Order</Link>
        
    </>
  );
}
