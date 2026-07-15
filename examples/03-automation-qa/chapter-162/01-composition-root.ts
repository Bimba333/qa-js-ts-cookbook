type Diagnostics = {
  record(message: string): void;
};

type OrderReader = {
  readStatus(orderId: string): Promise<string>;
};

function createOrderReader(diagnostics: Diagnostics): OrderReader {
  return {
    async readStatus(orderId) {
      diagnostics.record(`Чтение статуса ${orderId}`);
      return "created";
    },
  };
}

const diagnostics: Diagnostics = {
  record(message) {
    console.log(message);
  },
};

const orders = createOrderReader(diagnostics);
console.log(await orders.readStatus("order-42"));
