exports.getDate = () => {
  let today = new Date();
  let option = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  return today.toLocaleDateString('en-US', option);
};

exports.getDay = () => {
  let today = new Date();
  let option = {
    weekday: 'long',
  };
  return today.toLocaleDateString('en-US', option);
};
