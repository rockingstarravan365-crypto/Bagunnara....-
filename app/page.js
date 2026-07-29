"use client";
import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Normal Tea", price: 15, desc: "Garam garam irani tea", img: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400" },
  { id: 2, name: "Coffee", price: 20, desc: "Strong coffee", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400" },
  { id: 3, name: "Special Tea", price: 25, desc: "Ginger + Elaichi", img: "https://images.unsplash.com/photo-1564890369478-c1b650e3c228?w=400" },
  { id: 4, name: "Filter Coffee", price: 30, desc: "South Indian filter", img: "https://images.unsplash.com/photo-1495474472287-4ce0bda2f4c7?w=400" },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState("menu");
  const [address, setAddress] = useState({ name: "", phone: "", area: "", lat: "", lng: "" });

  const openProduct = (p) => { setSelectedProduct(p); setStep("product"); }
  const addToCart = () => { setCart([...cart, selectedProduct]); setStep("checkout"); }
  
  const getLiveLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setAddress({...address, lat: pos.coords.latitude, lng: pos.coords.longitude});
      alert("Location taken!");
    });
  }

  const payWithRazorpay = () => {
    const total = cart.reduce((s,i) => s+i.price, 0) + 10;
    const options = {
      key: "rzp_test_YourKeyHere",
      amount: total * 100,
      currency: "INR",
      name: "Mana Tea, Coffee",
      handler: function (response){
        sendSMSWhatsApp(address.phone, total);
        alert("Payment Success!");
        setCart([]); setStep("menu");
      },
      prefill: { name: address.name, contact: address.phone }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const sendSMSWhatsApp = (phone, total) => {
    const msg = `Hi ${address.name}, mee Mana Tea order confirm ayyindi. Total ₹${total}. 30 mins lo delivery. Thank you ☕`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  const total = cart.reduce((s,i) => s+i.price, 0) + 10;

  return (
    <div className="min-h-screen bg-orange-50">
      <h1 className="text-2xl font-bold text-center p-4 bg-orange-600 text-white">☕ Mana Tea, Coffee</h1>
      {step === "menu" && (
        <div className="grid grid-cols-2 gap-3 p-4">
          {PRODUCTS.map(p => (
            <div key={p.id} onClick={() => openProduct(p)} className="bg-white rounded shadow cursor-pointer">
              <img src={p.img} className="w-full h-32 object-cover rounded-t"/>
              <div className="p-2"><p className="font-bold">{p.name}</p><p>₹{p.price}</p></div>
            </div>
          ))}
        </div>
      )}
      {step === "product" && selectedProduct && (
        <div className="p-4">
          <img src={selectedProduct.img} className="w-full h-60 object-cover rounded"/>
          <h2 className="text-xl font-bold mt-2">{selectedProduct.name}</h2>
          <p>{selectedProduct.desc}</p>
          <p className="text-2xl font-bold mt-2">₹{selectedProduct.price}</p>
          <button onClick={addToCart} className="bg-orange-600 text-white w-full py-3 rounded mt-4">Add to Cart</button>
        </div>
      )}
      {step === "checkout" && (
        <div className="p-4">
          <h2 className="text-xl font-bold">Delivery Details</h2>
          <input placeholder="Name" className="border p-2 w-full mt-2" onChange={e => setAddress({...address, name: e.target.value})}/>
          <input placeholder="Phone" className="border p-2 w-full mt-2" onChange={e => setAddress({...address, phone: e.target.value})}/>
          <input placeholder="Area, House No" className="border p-2 w-full mt-2" onChange={e => setAddress({...address, area: e.target.value})}/>
          <button onClick={getLiveLocation} className="bg-blue-500 text-white w-full py-2 rounded mt-2">📍 Use Live Location</button>
          <p className="mt-3 font-bold">Total: ₹{total}</p>
          <button onClick={() => setStep("payment")} className="bg-green-600 text-white w-full py-3 rounded mt-2">Proceed to Pay</button>
        </div>
      )}
      {step === "payment" && (
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold">Pay ₹{total}</h2>
          <button onClick={payWithRazorpay} className="bg-green-600 text-white w-full py-3 rounded mt-4">Pay with UPI / Card</button>
        </div>
      )}
    </div>
  );
      }
