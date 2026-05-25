console.log("Frontend javaScript is running");

function itemTemplate(item) {
  return `<li
    class="list-group-item list-group-item-info d-flex align-items-center justify-content-between">
    <span class="item-text">${item.reja}</span>
    <div>
      <button
        data-id="${item._id}"
        class="edit-me btn btn-secondary btn-sm mr-1">
        Ozgartirish
      </button>
      <button
      data-id="${item._id}"
        class="delete-me btn btn-danger btn-sm">
        Ochirish
      </button>
    </div>
  </li>`;
}

const createField = document.getElementById("create-field");
const formObject = document.getElementById("create-form");

/* CREATE */
formObject.addEventListener("submit", function (e) {
  e.preventDefault();

  axios
    .post("/create-item", { reja: createField.value })
    .then((response) => {
      document
        .getElementById("item-list")
        .insertAdjacentHTML("beforeend", itemTemplate(response.data));
      createField.value = "";
      createField.focus();
    })
    .catch((err) => {
      console.log("Iltimos qaytadan harakat qiling!");
    });
});

document.addEventListener("click", function (e) {
  /* DELETE */
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Aniq ochirmoqchimisiz?")) {
      axios
        .post("/delete-item", { id: e.target.getAttribute("data-id") })
        .then((respose) => {
          console.log(respose.data);
          e.target.parentElement.parentElement.remove();
        })
        .catch((err) => {
          console.log("Iltimos qaytadan harakat qiling!");
        });
    }
  }

  /* EDIT */
  if (e.target.classList.contains("edit-me")) {
    const userInput = prompt(
      "O'zgartirish kiriting",
      e.target.parentElement.parentElement.querySelector(".item-text")
        .innerHTML,
    );

    if (userInput) {
      axios
        .post("/edit-item", {
          id: e.target.getAttribute("data-id"),
          new_input: userInput,
        })
        .then((response) => {
          console.log(response.data);
          e.target.parentElement.parentElement.querySelector(
            ".item-text",
          ).innerHTML = userInput;
        })
        .catch((err) => {
          console.log("Iltimos qaytadan harakat qiling!");
        });
    }
  }
});

document.getElementById("clean-all").addEventListener("click", function () {
  axios.post("/delete-all", { delete_all: true }).then((respose) => {
    alert(respose.data.state);
    document.location.reload();
  });
});

/* RAIN EFFECT */
const canvas = document.createElement("canvas");
canvas.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 0;
`;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const drops = Array.from({ length: 60 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  length: Math.random() * 15 + 8,
  speed: Math.random() * 2 + 1.5,
  opacity: Math.random() * 0.2 + 0.05,
}));

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drops.forEach((drop) => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 1, drop.y + drop.length);
    ctx.strokeStyle = `rgba(180, 200, 255, ${drop.opacity})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    drop.y += drop.speed;
    if (drop.y > canvas.height) {
      drop.y = -drop.length;
      drop.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(drawRain);
}

drawRain();
