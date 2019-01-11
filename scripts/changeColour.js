module.exports = colour => {
  switch(colour && colour.toLowerCase()) {
    case undefined:
      return 'red';
    case 'pink':
      return 'red';
    case 'peach':
      return 'orange';
    default:
      return colour.toLowerCase();
  }
};