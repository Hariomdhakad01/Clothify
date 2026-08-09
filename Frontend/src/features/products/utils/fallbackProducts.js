import registerFashionModel from "../../../assets/register-fashion-model.png";

export const fallbackProducts = [
  {
    _id: "sample-1",
    title: "Slate Resort Shirt",
    description: "Soft lyocell blend shirt with a relaxed camp collar and clean drape.",
    price: { amount: 1499, currency: "INR" },
    images: [{ url: registerFashionModel }],
  },
  {
    _id: "sample-2",
    title: "Tapered Travel Chino",
    description: "Structured yet comfortable cotton trouser for day-to-night styling.",
    price: { amount: 2299, currency: "INR" },
    images: [{ url: registerFashionModel }],
  },
  {
    _id: "sample-3",
    title: "Ink Knit Polo",
    description: "Breathable knit polo with ribbed cuffs and a minimal placket.",
    price: { amount: 1799, currency: "INR" },
    images: [{ url: registerFashionModel }],
  },
];
