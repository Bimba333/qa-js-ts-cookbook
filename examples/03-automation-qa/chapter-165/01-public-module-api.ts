export type OrderSummary = {
  id: string;
  status: string;
};

export type Orders = {
  read(orderId: string): Promise<OrderSummary>;
};

export function createOrders(): Orders {
  return {
    async read(orderId) {
      return { id: orderId, status: "created" };
    },
  };
}

const orders = createOrders();
console.log(await orders.read("order-42"));
