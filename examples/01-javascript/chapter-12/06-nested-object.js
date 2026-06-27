const user = {
  profile: {
    firstName: 'Anna',
    lastName: 'Smith',
  },
  status: {
    isActive: true,
    role: 'admin',
  },
  settings: {
    theme: 'dark',
    emailNotifications: true,
  },
};

console.log(user.profile.firstName);
console.log(user.status.role);
console.log(user.settings.emailNotifications);
