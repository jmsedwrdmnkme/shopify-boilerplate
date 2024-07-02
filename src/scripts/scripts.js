/*
  Ajax add to cart
 */

addToCartAjax = () => {
  let addToCartForm = document.querySelector('form[action$="/cart/add"]');
  let formData = new FormData(addToCartForm);

  fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    return response.json();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

addToCartAjax();
