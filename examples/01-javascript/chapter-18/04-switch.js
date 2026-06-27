const environment = 'staging';

switch (environment) {
  case 'local':
    console.log('Use local config');
    break;
  case 'staging':
    console.log('Use staging config');
    break;
  default:
    console.log('Use production config');
}
