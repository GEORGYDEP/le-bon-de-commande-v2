
import React from 'react';
import { Offer } from '../types';

interface Props {
  offers: Offer[];
  onSelect: (offer: Offer) => void;
}

const OfferComparison: React.FC<Props> = ({ offers, onSelect }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Étape 1 : Choisir la meilleure offre</h2>
        <p className="text-gray-600">Analyse les prix et les conditions avant de faire ton choix.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {offers.map((offer) => (
          <div 
            key={offer.id} 
            className="bg-white border-2 border-transparent hover:border-blue-400 rounded-2xl shadow-lg overflow-hidden transition-all flex flex-col"
          >
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{offer.supplierName}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest">{offer.supplierAddress}</p>
              </div>
              <div className="bg-blue-600 p-2 rounded-full">
                <i className="fa-solid fa-store text-white"></i>
              </div>
            </div>

            <div className="p-6 flex-grow space-y-6">
              <table className="w-full text-sm">
                <thead className="text-gray-500 uppercase text-xs border-b">
                  <tr>
                    <th className="text-left py-2">Désignation</th>
                    <th className="text-center py-2">Unité</th>
                    <th className="text-right py-2">P.U. (€)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {offer.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-gray-700">{item.designation}</td>
                      <td className="py-3 text-center text-gray-500 italic">
                        {typeof item.unit === 'number' && item.unit > 1 ? `Lot de ${item.unit}` : 'Unité'}
                      </td>
                      <td className="py-3 text-right font-bold text-gray-900">{item.pu.toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-gray-700 text-sm border-b pb-2 mb-2">Conditions de vente</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-gray-500 uppercase mb-1">Livraison</span>
                    <p className="font-semibold text-gray-800">{offer.conditions.deliveryDelay} ({offer.conditions.deliveryMode})</p>
                  </div>
                  <div>
                    <span className="block text-gray-500 uppercase mb-1">Paiement</span>
                    <p className="font-semibold text-gray-800">{offer.conditions.paymentDelay} - {offer.conditions.paymentMode}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button 
                onClick={() => onSelect(offer)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Choisir cette offre <i className="fa-solid fa-cart-plus"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg max-w-2xl mx-auto">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fa-solid fa-info-circle text-blue-500"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Conseil :</strong> Vérifie si la livraison est "Franco de port". Cela signifie que les frais de port sont gratuits pour toi !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferComparison;
