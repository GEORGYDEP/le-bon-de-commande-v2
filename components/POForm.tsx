
import React, { useState } from 'react';
import { Offer, PurchaseOrder, Item, PurchaseOrderItem } from '../types';

interface Props {
  offer: Offer;
  poData: PurchaseOrder;
  onUpdate: (po: PurchaseOrder) => void;
  onFinish: () => void;
  deliveryModes: string[];
  deliveryDelays: string[];
  paymentModes: string[];
  paymentDelays: string[];
}

const POForm: React.FC<Props> = ({ 
  offer, 
  poData, 
  onUpdate, 
  onFinish,
  deliveryModes,
  deliveryDelays,
  paymentModes,
  paymentDelays
}) => {
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);

  const addItem = (item: Item) => {
    // Check if already in list
    if (poData.items.find(i => i.id === item.id)) return;
    
    const newItem: PurchaseOrderItem = {
      ...item,
      quantity: item.quantityRecommended,
      total: item.pu * item.quantityRecommended
    };
    
    onUpdate({
      ...poData,
      items: [...poData.items, newItem]
    });
  };

  const removeItem = (id: string) => {
    onUpdate({
      ...poData,
      items: poData.items.filter(i => i.id !== id)
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    const updatedItems = poData.items.map(item => {
      if (item.id === id) {
        const nQty = Math.max(1, qty);
        return { ...item, quantity: nQty, total: item.pu * nQty };
      }
      return item;
    });
    onUpdate({ ...poData, items: updatedItems });
  };

  const totalHTVA = poData.items.reduce((sum, item) => sum + item.total, 0);

  const isFormValid = poData.items.length > 0 && 
                      poData.conditions.deliveryDelay && 
                      poData.conditions.deliveryMode && 
                      poData.conditions.paymentDelay && 
                      poData.conditions.paymentMode && 
                      poData.signature.trim().length > 2;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fadeIn">
      {/* Sidebar: Source Elements (The Offer) */}
      <div className="xl:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-orange-500">
          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-orange-500"></i> Articles de l'offre
          </h3>
          <p className="text-sm text-gray-500 mb-6 italic">Clique sur les articles ou les conditions pour les ajouter au bon de commande.</p>
          
          <div className="space-y-3">
            {offer.items.map(item => {
              const isInPO = poData.items.find(i => i.id === item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => !isInPO && addItem(item)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center group
                    ${isInPO ? 'bg-green-50 border-green-200 opacity-50 cursor-default' : 'bg-white border-gray-100 hover:border-orange-300 hover:shadow-md'}
                  `}
                >
                  <div>
                    <span className="block text-xs text-gray-400 font-mono">{item.reference}</span>
                    <span className="font-bold text-gray-800">{item.designation}</span>
                    <span className="block text-xs text-blue-600">P.U: {item.pu.toFixed(2)} €</span>
                  </div>
                  <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-solid fa-plus-circle text-xl"></i>
                  </div>
                  {isInPO && <i className="fa-solid fa-check-circle text-green-500"></i>}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
             <h4 className="font-bold text-sm text-gray-700 uppercase">Conditions suggérées</h4>
             <div className="text-xs space-y-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p><strong>Délai :</strong> {offer.conditions.deliveryDelay}</p>
                <p><strong>Mode :</strong> {offer.conditions.deliveryMode}</p>
                <p><strong>Paiement :</strong> {offer.conditions.paymentDelay} par {offer.conditions.paymentMode}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Area: The Purchase Order Draft */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-200 max-w-[800px] mx-auto p-12 min-h-[1000px] flex flex-col">
          {/* PO Header - Buyer Info */}
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-blue-800 uppercase leading-none">{poData.buyer.name}</h2>
              <p className="text-sm text-gray-600">{poData.buyer.address}</p>
              <div className="text-xs text-gray-400 pt-2 space-y-0.5">
                <p>TVA : {poData.buyer.tva} - BCE : {poData.buyer.bce}</p>
                <p>IBAN : {poData.buyer.iban}</p>
              </div>
            </div>
            <div className="text-right">
               <div className="bg-blue-50 px-4 py-2 border-2 border-blue-100 rounded">
                 <h3 className="text-xl font-bold text-blue-700 uppercase tracking-tighter">Bon de Commande</h3>
                 <p className="text-sm font-mono text-blue-500">N° {poData.orderNumber}</p>
               </div>
            </div>
          </div>

          {/* Supplier and Date */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Date du document</p>
              <input 
                type="text" 
                value={poData.date}
                readOnly
                className="bg-gray-50 border-b-2 border-gray-200 px-2 py-1 w-full font-medium"
              />
            </div>
            <div className="bg-gray-50 p-6 border-l-4 border-blue-800 rounded-r-lg">
              <p className="text-xs font-bold text-blue-800 uppercase mb-2 flex items-center gap-1">
                <i className="fa-solid fa-truck"></i> Fournisseur :
              </p>
              <p className="font-bold text-gray-800">{poData.supplier.name}</p>
              <p className="text-sm text-gray-600">{poData.supplier.address}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="flex-grow">
            <table className="w-full text-sm mb-8">
              <thead className="bg-gray-800 text-white uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Réf.</th>
                  <th className="py-3 px-4 text-left font-medium">Désignation</th>
                  <th className="py-3 px-4 text-center font-medium">Unité</th>
                  <th className="py-3 px-4 text-center font-medium">Qté</th>
                  <th className="py-3 px-4 text-right font-medium">P.U. (€)</th>
                  <th className="py-3 px-4 text-right font-medium">Total</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border-x border-b border-gray-200">
                {poData.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-gray-400 italic">
                      Glisse ou clique sur un article à gauche pour l'ajouter ici.
                    </td>
                  </tr>
                ) : (
                  poData.items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-mono text-xs">{item.reference}</td>
                      <td className="py-4 px-4 font-bold">{item.designation}</td>
                      <td className="py-4 px-4 text-center italic text-gray-500">{item.unit}</td>
                      <td className="py-4 px-4 text-center">
                        <input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-12 border rounded px-1 text-center py-0.5 bg-white"
                        />
                      </td>
                      <td className="py-4 px-4 text-right">{item.pu.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-bold">{item.total.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {poData.items.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-100">
                    <td colSpan={5} className="py-3 px-4 text-right font-black uppercase text-gray-600">Total HTVA :</td>
                    <td className="py-3 px-4 text-right font-black text-blue-800 text-lg">{totalHTVA.toFixed(2)} €</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>

            {/* Conditions Selection */}
            <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 space-y-6">
               <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b pb-2 mb-4">Conditions de Vente</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Délai de livraison</label>
                    <select 
                      value={poData.conditions.deliveryDelay}
                      onChange={(e) => onUpdate({...poData, conditions: {...poData.conditions, deliveryDelay: e.target.value}})}
                      className="w-full border-b bg-transparent py-1 text-sm focus:border-blue-500 outline-none"
                    >
                      <option value="">-- Choisir --</option>
                      {deliveryDelays.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Mode de livraison</label>
                    <select 
                      value={poData.conditions.deliveryMode}
                      onChange={(e) => onUpdate({...poData, conditions: {...poData.conditions, deliveryMode: e.target.value}})}
                      className="w-full border-b bg-transparent py-1 text-sm focus:border-blue-500 outline-none"
                    >
                      <option value="">-- Choisir --</option>
                      {deliveryModes.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Délai de paiement</label>
                    <select 
                      value={poData.conditions.paymentDelay}
                      onChange={(e) => onUpdate({...poData, conditions: {...poData.conditions, paymentDelay: e.target.value}})}
                      className="w-full border-b bg-transparent py-1 text-sm focus:border-blue-500 outline-none"
                    >
                      <option value="">-- Choisir --</option>
                      {paymentDelays.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Mode de paiement</label>
                    <select 
                      value={poData.conditions.paymentMode}
                      onChange={(e) => onUpdate({...poData, conditions: {...poData.conditions, paymentMode: e.target.value}})}
                      className="w-full border-b bg-transparent py-1 text-sm focus:border-blue-500 outline-none"
                    >
                      <option value="">-- Choisir --</option>
                      {paymentModes.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
               </div>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-12 flex justify-end">
            <div className="w-64 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase text-center">Signature de l'acheteur</p>
              <div className="border-b-2 border-gray-300 h-16 relative">
                 <input 
                  type="text"
                  placeholder="Tape ton nom complet ici..."
                  value={poData.signature}
                  onChange={(e) => onUpdate({...poData, signature: e.target.value})}
                  className="absolute bottom-1 w-full bg-transparent text-center font-signature italic text-2xl outline-none focus:placeholder-transparent"
                  style={{ fontFamily: 'Dancing Script, cursive' }}
                 />
              </div>
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-tight">Pour TECHSTORE SRL</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pb-12">
           <button 
             onClick={onFinish}
             disabled={!isFormValid}
             className={`px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all flex items-center gap-3
               ${isFormValid ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'}
             `}
           >
             Finaliser et Vérifier <i className="fa-solid fa-circle-check"></i>
           </button>
        </div>
      </div>
    </div>
  );
};

export default POForm;
