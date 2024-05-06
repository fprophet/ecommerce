let PRODUCTS_API_URL = "http://localhost:3000/products/";

function $(selector, all = false) {
  if (all) {
    return document.querySelectorAll(selector);
  } else {
    return document.querySelector(selector);
  }
}

function initEvents() {
  const product_buttons = $(".product-button", true);
  if (product_buttons) {
    product_buttons.forEach(function (button) {
      button.addEventListener("click", _handleProductButtonClick);
    });
  }
}

function startUpdate(id) {
  console.log("Update function: ", id);
}

function deleteRequest(id, callback = false) {
  fetch(PRODUCTS_API_URL + "delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      if (callback) {
        callback();
      }
    });
}

function removeProductItem(id) {
  $(`[data-id="${id}"]`).remove();
}

function _handleProductButtonClick(event) {
  const action = event.target.id;
  const product_id = event.target.parentElement.parentElement.dataset.id;
  switch (action) {
    case "delete":
      deleteRequest(product_id, removeProductItem(product_id));
      break;
    case "update":
      startUpdate(product_id);
  }
}

initEvents();
