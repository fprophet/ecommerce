let PRODUCTS_API_URL = "http://localhost:3000/products/";
let edit = false;

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

  const form_submit = $("#submit-form");
  form_submit.addEventListener("click", _handleSubmitForm);
}

function getFormValues(form) {
  let item = {};

  const inputs = $("input,textarea,select", true);

  inputs.forEach(function (elem) {
    item.elem = elem.value;
  });

  return item;
}

function populateForm() {
  const form = $("#product-form");
  const product_holder = $(`[data-id="${edit}"]`);
  const keys = ["name", "quantity", "category"];
  keys.forEach(function (key) {
    const data_span = $(".product-" + key);
    const input = $("#" + key);
    input.value = data_span.innerHTML;
  });
}

function startUpdate(id) {
  edit = id;
  populateForm();
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

function updateReuest(product, callback = false) {
  fetch(PRODUCTS_API_URL + "update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      if (callback) {
        callback();
      }
    });
}

function createReuest(product, callback = false) {
  fetch(PRODUCTS_API_URL + "create", {
    method: "create",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
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

function _handleSubmitForm(event) {
  event.preventDefault();
  const data = getFormValues(form);
  if (edit) {
    updateReuest(data);
  } else {
    createReuest(data);
  }
}

initEvents();
