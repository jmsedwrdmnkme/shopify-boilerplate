/*
 * Add to cart
*/
document.querySelectorAll('form[action$="/cart/add"]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);

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
  });
});
