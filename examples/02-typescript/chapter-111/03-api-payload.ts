type LoginPayload = {
  email: string;
  password: string;
};

function printLoginPayload(payload: LoginPayload): void {
  console.log(payload.email);
}

printLoginPayload({
  email: 'qa@example.test',
  password: 'secret',
});
