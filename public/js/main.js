let index = getCurrentIndex();
let API_URL = getCurrentAPI();
let edit = false;

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
  console.log(obj_buttons);
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
}

function getFormValues(form) {
  let item = {};

  const inputs = $("input[type=text],textarea,select", true);
  console.log(inputs);
  inputs.forEach(function (elem) {
    item[elem.id] = elem.value;
  });

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

function startUpdate(id) {
  edit = id;
  populateForm();
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

function updateReuest(obj, callback = false) {
  fetch(API_URL + "update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
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
        callback();
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

function _handleObjButtonClick(event) {
  const action = event.target.id;
  const obj_id = event.target.parentElement.parentElement.dataset.id;
  switch (action) {
    case "delete":
      deleteRequest(obj_id);
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
  const data = new FormData();
  data.append("item", JSON.stringify(json));
  return data;
}

function _handleSubmitForm(event) {
  event.preventDefault();

  const data = getFormData();
  if (index == "products") {
    const images = $("input[type=file]").files;
    if (images && images.length > 0) {
      for (i = 0; i < images.length; i++) {
        data.append("image-" + i, images[i]);
      }
    }
  }
  if (edit) {
    data.id = edit;
    updateReuest(data, updateCallback);
  } else {
    createRequest(data);
  }
}

function _handleDisplayProdImages(event) {
  const files = event.target.files;
  if (files.length < 1) {
    return false;
  }
  const collection_holder = $(".img-collection-wrapper");

  for (i = 0; i <= files.length - 1; i++) {
    const holder = $create("div", false, ["img-holder"]);
    const img = $create("img");
    img.setAttribute("data-id", i);
    img.src = URL.createObjectURL(files[i]);

    holder.appendChild(img);
    collection_holder.appendChild(holder);

    if (i == 0) {
      holder.classList.add("selected");
      $("#main-display").src = URL.createObjectURL(files[i]);
      $("#main-display").dataset.id = i;
    }
  }
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

function _handleCancelEdit() {
  edit = false;
}

initEvents();
