import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard } from 'lucide-react';
import { Header } from '../components/Header';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Your Shopping Bag</h2>
          <span className="text-xs font-black text-muted uppercase tracking-widest">{itemCount} Items Selected</span>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item: any) => (
                <div key={item.id} className="bg-surface/40 p-6 rounded-[2rem] border border-white/5 flex gap-6 items-center">
                  <div className="w-20 h-20 bg-black/20 rounded-2xl overflow-hidden shrink-0">
                    <img src={item.image_url} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black uppercase italic tracking-tighter">{item.name}</h4>
                    <p className="text-primary font-black italic">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/5">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-primary"><Minus size={16} /></button>
                    <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-primary"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                </div>
              ))}
              <button onClick={clearCart} className="text-xs text-muted font-black uppercase tracking-widest hover:text-red-500 transition-colors">Clear Bag</button>
            </div>

            <div className="space-y-6">
              <div className="bg-[#003399] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest border-b border-white/5 pb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-muted text-xs font-bold uppercase"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                  <div className="flex justify-between text-muted text-xs font-bold uppercase"><span>Delivery</span><span className="text-emerald-500 italic">FREE</span></div>
                  <div className="w-full h-px bg-white/5 my-4" />
                  <div className="flex justify-between text-white text-xl font-black italic uppercase"><span>Total</span><span>₹{cartTotal}</span></div>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase italic tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-[0.98] transition-all">
                  <CreditCard size={18} /> Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-surface/40 rounded-[3rem] border border-white/5">
            <ShoppingBag size={64} className="mx-auto text-muted/20 mb-6" />
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Your bag is empty</h3>
            <p className="text-muted text-sm font-medium mb-8">Add something to your bag to see it here.</p>
            <Link to="/" className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px]">Start Shopping</Link>
          </div>
        )}
      </main>
    </div>
  );
};