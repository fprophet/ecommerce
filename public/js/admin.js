let index = getCurrentIndex();
let API_URL = getCurrentAPI();
let edit = false;
let alert_timeout;
function getCurrentAPI() {
  return "http://localhost:3000/admin/" + index + "/";
}

function getCurrentIndex() {
  return window.location.pathname.split("/")[2];
}

function $(selector, all = false) {
  if (all) {
    return document.querySelectorAll(selector);
  } else {
    return document.querySelector(selector);
  }
}

function $create(tag, id = false, cls = false, text = false) {
  const element = document.createElement(tag);
  if (id) {
    element.setAttribute("id", id);
  }
  if (cls) {
    cls.forEach(function (elem) {
      element.classList.add(elem);
    });
  }
  if (text) {
    element.innerHTML = text;
  }
  return element;
}

function initEvents() {
  const obj_buttons = $(`.${index}-button`, true);
  if (obj_buttons) {
    obj_buttons.forEach(function (button) {
      button.addEventListener("click", _handleObjButtonClick);
    });
  }

  const form_submit = $("#submit-form");
  if (form_submit) {
    form_submit.addEventListener("click", _handleSubmitForm);
  }

  const cancel_edit = $("#cancel-edit");
  if (cancel_edit) {
    cancel_edit.addEventListener("click", _handleCancelEdit);
  }

  const img_input = $("#add-prod-images");
  if (img_input) {
    const reader = new FileReader();
    img_input.addEventListener("change", _handleDisplayProdImages);
  }

  const arrows = $(".arr-holder", true);
  if (arrows) {
    arrows.forEach(function (arr) {
      arr.addEventListener("click", _handleClickDisplayImage);
    });
  }

  const close_alert = $(".alert-box-close");
  if (close_alert) {
    close_alert.addEventListener("click", _handleCloseAlert);
  }

  const img_btns = $(".img-btn", true);
  if (img_btns) {
    img_btns.forEach(function (btn) {
      btn.addEventListener("click", _handleImageBtn);
    });
  }

  const close_prod_modal = $(".close-prod-modal");
  if (close_prod_modal) {
    close_prod_modal.addEventListener("click", _handleCloseProdModal);
  }

  const remove_prod = $("#remove-product");
  if (remove_prod) {
    remove_prod.addEventListener("click", _handleRemoveProd);
  }
}

function getFormValues(form) {
  let item = {};

  const inputs = $("input[type=text],input[type=number],textarea,select", true);
  inputs.forEach(function (elem) {
    if (!elem.value) {
      console.log(elem);
      throw new Error("Please fill all inputs!");
    }
    item[elem.id] = elem.value;
  });

  if (index == "products") {
    const imgs = $(".product-img-holder img", true);
    item["images"] = [];
    imgs.forEach(function (img) {
      if (img.parentElement.classList.contains("to-remove")) {
        return;
      }
      let parts = img.src.split("/");
      const name = parts[parts.length - 1];
      item["images"].push(name);
    });

    const inpt = $("#add-prod-images");
    for (i = 0; i < inpt.files.length; i++) {
      item["images"].push(inpt.files[i].name);
    }
  }

  return item;
}

function populateForm() {
  const form = $(`#${index}-form`);
  const obj_holder = $(`[data-id="${edit}"]`);
  const key_spans = obj_holder.querySelectorAll("span[data-target]");
  key_spans.forEach(function (key_span) {
    const input = $("#" + key_span.dataset.target);
    input.value = key_span.innerHTML;
  });
}

function addCancelButton() {
  const form = $(".categories-form-buttons");
  const btn = $create("button", "cancel-edit", ["base-btn"]);
  btn.innerHTML = "Cancel Edit";
  btn.addEventListener("click", _handleCancelEdit);
  form.appendChild(btn);
}

function startUpdate(id) {
  edit = id;
  populateForm();
  addCancelButton();
  // replace;
}

function deleteRequest(id, callback = false) {
  fetch(API_URL + "delete", {
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

function updateReuest(data, callback = false) {
  fetch(API_URL + "update", {
    method: "PUT",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      if (callback) {
        callback(data);
      }
    });
}

function createRequest(data, callback = false) {
  fetch(API_URL + "create", {
    method: "POST",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      if (callback) {
        callback(data);
      }
    });
}

function removeObjItem(id) {
  $(`[data-id="${id}"]`).remove();
}

function updateCallback(data) {
  if (data.status == "success") {
    window.location.reload();
  } else {
    window.alert(data.message);
  }
}

function fetchCategoryProducts(id) {
  return fetch(API_URL + "get-products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });
}

function displayProducts(products) {
  console.log(products);
}

function displayProduct(product) {
  product = product.replaceAll("&#34;", '"');
  product = product.replaceAll("\n", "<br>");

  const json = JSON.parse(product);
  edit = json["_id"];
  $("#prod-id").dataset.id = json["_id"];
  for (const prop in json) {
    const elem = $("#" + prop);
    if (elem) {
      elem.value = json[prop];
    }
  }
}

async function getCategoryProducts(id) {
  fetchCategoryProducts(id)
    .then((res) => res.json())
    .then((response) => {
      if (response["status"] == "success") {
        displayProducts(response["products"]);
      } else {
        window.alert("something went wrong");
      }
    });
}

function deleteRequestCB() {
  const new_location = "/admin/products/";
  window.location.href = new_location;
}

function _handleCloseProdModal() {
  $(".product-modal").style.display = "none";
}

function _handleCloseAlert(ev) {
  ev.target.parentElement.style.display = "none";
  ev.target.parentElement.classList.remove("alert-slide-in");
  ev.target.parentElement.classList.remove("alert-slide-out");
  clearTimeout(alert_timeout);
}

function _handleImageBtn(ev) {
  if (ev.target.dataset.type == "prev") {
    $(".product-modal").style.display = "block";
    const src = ev.target.parentElement.previousElementSibling.children[0].src;
    $("#modal-img").src = src;
  } else {
    const holder = ev.target.parentElement.previousElementSibling;
    if (holder.classList.contains("to-remove")) {
      holder.classList.remove("to-remove");
    } else {
      holder.classList.add("to-remove");
    }
  }
}

function _handleRemoveProd(ev) {
  ev.preventDefault();
  if (!confirm("Are you sure you want to remove this object?")) {
    return false;
  }
  const id = $("#prod-id").dataset.id;
  deleteRequest(id, deleteRequestCB);
}

function _handleObjButtonClick(event) {
  const action = event.target.id;
  const obj_id = event.target.parentElement.parentElement.dataset.id;
  switch (action) {
    case "delete":
      if (!confirm("Are you sure you want to remove this object?")) {
        return false;
      }
      deleteRequest(obj_id, deleteRequestCB);
      break;
    case "update":
      startUpdate(obj_id);
      break;
    case "get-products":
      const id = event.target.parentElement.parentElement.dataset.id;
      getCategoryProducts();
  }
}

function getFormData() {
  const json = getFormValues($(`#${index}-form`));
  if (edit) {
    json.id = edit;
  }
  const data = new FormData();
  data.append("item", JSON.stringify(json));
  return data;
}

function _handleSubmitForm(event) {
  event.preventDefault();
  let data;
  try {
    data = getFormData();
  } catch (err) {
    set_alert(false, err.message, "failed");
    return false;
  }
  if (index == "products") {
    const images = $("input[type=file]").files;
    if (images && images.length > 0) {
      for (i = 0; i < images.length; i++) {
        data.append("image-" + i, images[i]);
      }
    }
  }

  // return false;
  if (edit) {
    updateReuest(data, set_alert);
  } else {
    createRequest(data, set_alert);
  }
}

function _handleDisplayProdImages(event) {
  const files = event.target.files;
  if (files.length < 1) {
    return false;
  }
  const collection_holder = $(".selected-images");
  collection_holder.style.display = "flex";
  for (i = 0; i <= files.length - 1; i++) {
    const holder = $create("div", false, ["selected-image-wrapper"]);
    const img = $create("img", false, ["selected-img"]);
    img.setAttribute("data-id", i);
    img.src = URL.createObjectURL(files[i]);

    const span = $create("span", false, ["selected-name"]);
    span.innerHTML = files[i].name;

    const remove = $create("i", false, [
      "fa-solid",
      "fa-xmark",
      "remove-selected-img",
    ]);
    remove.addEventListener("click", _handleRemvoeSelected);
    holder.appendChild(img);
    holder.appendChild(span);
    holder.appendChild(remove);
    collection_holder.appendChild(holder);
  }
}

function _handleRemvoeSelected(ev) {
  const img = ev.target.parentElement.children[0];
  const id = img.dataset.id;

  const inpt = $("#add-prod-images");

  const dt = new DataTransfer();

  for (i = 0; i < inpt.files.length; i++) {
    if (i != id) {
      dt.items.add(inpt.files[i]);
    }
  }
  ev.target.parentElement.remove();

  const selected = $(".selected-img", true);
  let count = 0;
  selected.forEach(function (sel) {
    sel.dataset.id = count;
    count++;
  });

  inpt.files = dt.files;
  console.log(inpt.files);
}

function _handleClickDisplayImage(event) {
  const main = $("#main-display");
  const collection = $(".img-holder", true);
  const holder = event.target.closest(".arr-holder");
  if (holder.dataset.dir == "right") {
    if (main.dataset.id < collection.length - 1) {
      let idx = parseInt(main.dataset.id) + 1;
      collection[idx].classList.add("selected");
      collection[idx - 1].classList.remove("selected");
      main.src = collection[idx].children[0].src;
      main.dataset.id = idx;
    }
  } else {
    if (main.dataset.id > 0) {
      let idx = parseInt(main.dataset.id) - 1;
      collection[idx].classList.add("selected");
      collection[idx + 1].classList.remove("selected");
      main.src = collection[idx].children[0].src;
      main.dataset.id = idx;
    }
  }
}

async function set_alert(data = false, message = false, type = false) {
  if (data) {
    message = data["message"];
    type = data["status"];
  }
  const alert_modal = $(".alert-box");
  alert_modal.style.display = "flex";
  alert_modal.classList.remove("alert-slide-in");
  alert_modal.classList.remove("alert-slide-out");
  alert_modal.classList.remove("alert-success");
  alert_modal.classList.remove("alert-failed");

  alert_modal.classList.add("alert-" + type);

  const message_span = alert_modal.querySelector("span");

  message_span.innerHTML = message;
  // alert_modal.style.display = "block";
  alert_modal.classList.add("alert-slide-in");

  //checking for style in case the close button was clicked
  alert_timeout = setTimeout(function () {
    alert_modal.classList.remove("alert-slide-in");
    alert_modal.classList.add("alert-slide-out");
  }, 3000);
}

function _handleCancelEdit() {
  edit = false;
  const inpts = $("input,textarea", true);
  inpts.forEach(function (elem) {
    elem.value = "";
  });
  $("#cancel-edit").remove();
}

initEvents();
