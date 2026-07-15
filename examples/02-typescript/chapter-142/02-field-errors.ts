export {};

type FieldErrors<Form> = {
  [Field in keyof Form]: string[];
};

type CheckoutForm = {
  email: string;
  address: string;
  cardNumber: string;
};

const errors: FieldErrors<CheckoutForm> = {
  email: [],
  address: ["Address is required"],
  cardNumber: [],
};

console.log(errors.address.join(", "));

