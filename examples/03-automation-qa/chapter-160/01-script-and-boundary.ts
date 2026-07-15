type TestContext = {
  environmentUrl: string;
  orderId: string;
};

async function verifyOrder(context: TestContext): Promise<void> {
  console.log(`Проверка ${context.orderId} в ${context.environmentUrl}`);
}

const context: TestContext = {
  environmentUrl: "https://staging.example.test",
  orderId: "order-42",
};

await verifyOrder(context);
