/*
 * Add to cart
*/
document.querySelectorAll('form[action$="/cart/add"]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    await fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      body: new FormData(form)
    })
    .then(response => {
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
});
