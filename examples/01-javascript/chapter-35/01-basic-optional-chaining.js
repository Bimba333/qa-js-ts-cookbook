const user = {
  profile: {
    name: 'Anna'
  }
};

const userWithoutProfile = {};

console.log(user.profile?.name);
console.log(userWithoutProfile.profile?.name);
