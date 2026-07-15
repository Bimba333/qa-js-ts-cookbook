export {};

interface TestDataBuilder<Data> {
  build(): Data;
}

const userBuilder: TestDataBuilder<{ id: string; role: string }> = {
  build() {
    return { id: "u-1", role: "admin" };
  },
};

console.log(userBuilder.build().role);
