
import { Offer } from './types';

export const BUYER_DATA = {
  name: "TECHSTORE SRL",
  address: "Rue du Commerce 15, 7000 MONS",
  tva: "BE0456.789.012",
  bce: "0456.789.012",
  iban: "BE68 0017 1234 5678"
};

export const OFFERS: Offer[] = [
  {
    id: "off-001",
    supplierName: "MediaMarkt",
    supplierAddress: "Drève Richelle 161, 1410 Waterloo",
    isBestOffer: true,
    items: [
      { id: "it-1", reference: "IPAD10-64", designation: "iPad 10e gén. 64GB", unit: 1, pu: 449.00, quantityRecommended: 3 },
      { id: "it-2", reference: "COQ-IPAD", designation: "Coque protection iPad", unit: 1, pu: 29.99, quantityRecommended: 5 },
      { id: "it-3", reference: "STY-LOT3", designation: "Lot 3 stylets compatibles", unit: 3, pu: 15.00, quantityRecommended: 2 }
    ],
    conditions: {
      deliveryDelay: "7 jours",
      deliveryMode: "Franco de port",
      paymentDelay: "30 jours fin de mois",
      paymentMode: "Virement bancaire"
    }
  },
  {
    id: "off-002",
    supplierName: "Fnac Pro",
    supplierAddress: "Place de la Monnaie, 1000 Bruxelles",
    isBestOffer: false,
    items: [
      { id: "it-4", reference: "IPAD10-64-F", designation: "iPad 10e gén. 64GB", unit: 1, pu: 455.00, quantityRecommended: 3 },
      { id: "it-5", reference: "COQ-IPAD-F", designation: "Coque protection iPad", unit: 1, pu: 25.00, quantityRecommended: 5 },
      { id: "it-6", reference: "STY-LOT3-F", designation: "Lot 3 stylets compatibles", unit: 1, pu: 18.00, quantityRecommended: 6 }
    ],
    conditions: {
      deliveryDelay: "15 jours",
      deliveryMode: "Livraison payante (15€)",
      paymentDelay: "Au comptant",
      paymentMode: "Carte de crédit"
    }
  }
];

export const DELIVERY_MODES = ["Franco de port", "Livraison payante (15€)", "Retrait en magasin", "Bpost Express"];
export const DELIVERY_DELAYS = ["3 jours", "5 jours", "7 jours", "15 jours", "30 jours"];
export const PAYMENT_MODES = ["Virement bancaire", "Carte de crédit", "Espèces", "Domiciliation"];
export const PAYMENT_DELAYS = ["Au comptant", "15 jours", "30 jours fin de mois", "60 jours"];
