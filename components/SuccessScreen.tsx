
import React, { useState } from 'react';
import { PurchaseOrder, Offer } from '../types';

interface Props {
  po: PurchaseOrder;
  offer: Offer;
  onRestart: () => void;
}

const SuccessScreen: React.FC<Props> = ({ po, offer, onRestart }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Validation dynamique : l'élève doit avoir recopié les conditions de l'offre qu'il a CHOISIE
  const isCorrectDeliveryMode = po.conditions.deliveryMode === offer.conditions.deliveryMode;
  const isCorrectDeliveryDelay = po.conditions.deliveryDelay === offer.conditions.deliveryDelay;
  const isCorrectPaymentMode = po.conditions.paymentMode === offer.conditions.paymentMode;
  const isCorrectPaymentDelay = po.conditions.paymentDelay === offer.conditions.paymentDelay;
  const allItemsPresent = po.items.length === offer.items.length;

  const totalHTVA = po.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20">
      {!showPreview ? (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-green-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
              <i className="fa-solid fa-check text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold mb-2">Félicitations !</h2>
            <p className="text-green-100">Ton exercice sur le bon de commande est terminé.</p>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-magnifying-glass text-blue-500"></i> Analyse de ta saisie
                </h3>
                <div className="space-y-3">
                  <CheckItem label="Identification des parties" checked={true} />
                  <CheckItem label="Transcription des articles" checked={allItemsPresent} tip="As-tu oublié des articles de l'offre ?" />
                  <CheckItem label="Calculs des totaux" checked={true} />
                  <CheckItem 
                    label="Mode de livraison" 
                    checked={isCorrectDeliveryMode} 
                    tip={`Tu devais choisir : ${offer.conditions.deliveryMode}`} 
                  />
                  <CheckItem 
                    label="Délai de livraison" 
                    checked={isCorrectDeliveryDelay} 
                    tip={`Tu devais choisir : ${offer.conditions.deliveryDelay}`} 
                  />
                  <CheckItem 
                    label="Conditions de paiement" 
                    checked={isCorrectPaymentMode && isCorrectPaymentDelay} 
                    tip={`L'offre prévoyait : ${offer.conditions.paymentDelay} / ${offer.conditions.paymentMode}`} 
                  />
                  <CheckItem label="Signature du document" checked={!!po.signature} />
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                  <h3 className="font-bold text-blue-800">Récapitulatif financier</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-600">Offre sélectionnée :</span>
                    <span className="font-bold">{offer.supplierName}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-blue-900 font-bold">Total HTVA :</span>
                    <span className="text-blue-900 font-black">{totalHTVA.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button 
                    onClick={() => setShowPreview(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <i className="fa-solid fa-eye"></i> Visualiser le document final
                  </button>
                  <button 
                    onClick={onRestart}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-rotate-right"></i> Recommencer l'exercice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setShowPreview(false)}
              className="bg-white text-gray-600 px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left"></i> Retour au bilan
            </button>
            <div className="flex gap-2">
               <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2">
                 <i className="fa-solid fa-print"></i> Imprimer
               </button>
            </div>
          </div>

          {/* Paper View */}
          <div className="bg-white shadow-2xl p-12 mx-auto border border-gray-200" style={{ maxWidth: '800px', minHeight: '1000px' }}>
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-xl font-bold text-blue-800">{po.buyer.name}</h2>
                <p className="text-sm text-gray-500">{po.buyer.address}</p>
                <p className="text-xs text-gray-400 mt-2">TVA: {po.buyer.tva} | IBAN: {po.buyer.iban}</p>
              </div>
              <div className="text-right border-2 border-blue-800 p-2">
                <h1 className="text-xl font-black uppercase tracking-tighter">Bon de Commande</h1>
                <p className="text-sm font-mono text-gray-500">N° {po.orderNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-12">
              <div className="text-sm">
                <p className="font-bold text-gray-400 uppercase text-xs mb-1">Date :</p>
                <p className="font-medium border-b w-full pb-1">{po.date}</p>
              </div>
              <div className="bg-gray-50 p-4 border rounded">
                <p className="font-bold text-blue-800 uppercase text-xs mb-2">Destinataire :</p>
                <p className="font-bold">{po.supplier.name}</p>
                <p className="text-sm">{po.supplier.address}</p>
              </div>
            </div>

            <table className="w-full text-sm mb-10">
              <thead className="bg-gray-100 border-y-2 border-gray-800 text-xs font-bold uppercase">
                <tr>
                  <th className="py-2 px-2 text-left w-20">Réf.</th>
                  <th className="py-2 px-2 text-left">Désignation</th>
                  <th className="py-2 px-2 text-center w-16">Qté</th>
                  <th className="py-2 px-2 text-right w-24">P.U. (€)</th>
                  <th className="py-2 px-2 text-right w-24">Total (€)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {po.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-3 px-2 font-mono text-xs">{item.reference}</td>
                    <td className="py-3 px-2 font-medium">{item.designation}</td>
                    <td className="py-3 px-2 text-center">{item.quantity}</td>
                    <td className="py-3 px-2 text-right">{item.pu.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right font-bold">{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-800">
                <tr>
                  <td colSpan={4} className="py-4 text-right font-bold uppercase">Total Hors TVA :</td>
                  <td className="py-4 text-right font-black text-lg">{totalHTVA.toFixed(2)} €</td>
                </tr>
              </tfoot>
            </table>

            <div className="bg-gray-50 p-5 rounded border border-gray-200 text-sm space-y-2 mb-12">
               <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">Conditions de vente acceptées :</h4>
               <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <p><strong>Livraison :</strong> {po.conditions.deliveryMode} ({po.conditions.deliveryDelay})</p>
                  <p><strong>Paiement :</strong> {po.conditions.paymentMode}</p>
                  <p><strong>Délai de paiement :</strong> {po.conditions.paymentDelay}</p>
               </div>
            </div>

            <div className="flex justify-end mt-20">
              <div className="w-48 text-center border-t border-gray-300 pt-2">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-4">Signature autorisée</p>
                <p className="font-signature italic text-2xl text-blue-900" style={{ fontFamily: 'Dancing Script, cursive' }}>{po.signature}</p>
                <p className="text-[9px] text-gray-400 mt-4">Pour TechStore SRL</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckItem: React.FC<{label: string, checked: boolean, tip?: string}> = ({ label, checked, tip }) => (
  <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${checked ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
    <div className={`mt-0.5 ${checked ? 'text-green-500' : 'text-orange-500'}`}>
      <i className={`fa-solid ${checked ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
    </div>
    <div className="flex-grow">
      <p className={`text-sm font-semibold ${checked ? 'text-green-800' : 'text-orange-800'}`}>{label}</p>
      {!checked && tip && <p className="text-[10px] text-orange-600 mt-1 italic font-medium">{tip}</p>}
    </div>
  </div>
);

export default SuccessScreen;
