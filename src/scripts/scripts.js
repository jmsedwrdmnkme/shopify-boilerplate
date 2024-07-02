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

const addToCartBtn = document.querySelector('form.shopify-product-form input[type="submit"]');

addToCartBtn.addEventListener('click', (event) => {
  event.preventDefault();
  addToCartAjax();
  console.log('Item(s) added');
});


/*
  Dialog boxes
 */

const dialogBoxes = document.querySelectorAll('dialog');
forEach.dialogBoxes((box) => {
  const button = box.querySelector('button');
  button.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.close()
  });
});
