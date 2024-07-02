/*
  Ajax add to cart
 */

addToCartAjax = () => {
  let addToCartForm = document.querySelector('form[action$="/cart/add"]');
  let formData = new FormData(addToCartForm);
  const dialog = addToCartForm.querySelector('dialog');

  fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    dialog.open();
    setTimeout(dialog.close(), 3000);
    return response.json();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

const addToCartBtn = document.querySelector('form.shopify-product-form input[type="submit"]');

addToCartBtn.addEventListener('click', (event) => {
  event.preventDefault();
  addToCartAjax();
  console.log('Item(s) added');
});
