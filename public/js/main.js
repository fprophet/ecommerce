function $(selector, all = false) {
  if (all) {
    return document.querySelectorAll(selector);
  } else {
    return document.querySelector(selector);
  }
}

function request(url, options, callback = false) {
  fetch(url, options)
    .then((res) => res.json())
    .then((response) => {
      if (callback) {
        callback(data);
      } else {
        console.log(response);
        return data;
      }
    });
}

function addEvents() {
  const add_to_cart = $(".add-to-cart", true);
  add_to_cart.forEach(function (btn) {
    btn.addEventListener("click", _handleAddToCart);
  });
}

async function _handleAddToCart(event) {
  const parent = event.target.closest(".product");
  const id = parent.querySelector(".product-id").value;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product: id }),
  };
  await request("/cart/add", options);
  console.log(id);
}

addEvents();
