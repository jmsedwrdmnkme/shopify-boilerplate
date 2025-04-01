/*
 * Add to cart
*/
document.querySelectorAll('form[action$="/cart/add"]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    await fetch('/cart/add.js', {
      method: 'POST',
      body: new FormData(form)
    });
  });
});
