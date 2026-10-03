const ADMIN_CODE = "Pégase123";

const API = "/api/cars";

let cars = [];
let selectedPhotos = [];

const $ = id => document.getElementById(id);


/* CONNEXION */

$("loginButton").addEventListener("click", login);

$("adminCode").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    login();
  }
});


function login() {

  if ($("adminCode").value === ADMIN_CODE) {

    $("loginError").textContent = "";

    $("loginButton").disabled = true;

    $("adminPanel").hidden = false;

    document.querySelector(".login-card").hidden = true;

    loadCars();

  } else {

    $("loginError").textContent = "Code incorrect.";

  }

}


/* DÉCONNEXION */

$("logoutButton").addEventListener("click", () => {

  $("adminPanel").hidden = true;

  document.querySelector(".login-card").hidden = false;

  $("loginButton").disabled = false;

});


/* CHARGER LES VOITURES */

async function loadCars() {

  const response = await fetch(API);

  cars = await response.json();

  renderAdmin();

}


/* PHOTOS */

$("photos").addEventListener("change", event => {

  selectedPhotos = [];

  const files = [...event.target.files];

  files.forEach(file => {

    const reader = new FileReader();

    reader.onload = () => {

      selectedPhotos.push(reader.result);

      renderPreview();

    };

    reader.readAsDataURL(file);

  });

});


function renderPreview() {

  $("photoPreview").innerHTML =
    selectedPhotos
      .map(photo => `<img src="${photo}" alt="">`)
      .join("");

}


/* AJOUTER / MODIFIER */

$("carForm").addEventListener("submit", async event => {

  event.preventDefault();

  const editId = $("editId").value;


  const car = {

    brand: $("brand").value,

    model: $("model").value,

    price: $("price").value,

    year: $("year").value,

    km: $("km").value,

    fuel: $("carFuel").value,

    gear: $("gear").value,

    location: $("location").value,

    description: $("description").value,

    photos: selectedPhotos

  };


  let response;


  if (editId) {

    response = await fetch(
      `${API}?id=${editId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(car)
      }
    );

  } else {

    response = await fetch(
      API,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(car)
      }
    );

  }


  if (!response.ok) {

    alert("Erreur lors de l'enregistrement.");

    return;

  }


  alert(
    editId
      ? "Annonce modifiée !"
      : "Annonce ajoutée !"
  );


  resetForm();

  await loadCars();

});


/* AFFICHAGE */

function renderAdmin() {

  $("carCount").textContent = cars.length;


  $("adminCars").innerHTML = cars.map(car => `

    <div class="admin-car">

      <div>

        ${
          car.photos?.[0]
            ? `<img src="${car.photos[0]}" alt="">`
            : ""
        }

        <strong>
          ${escapeHTML(car.brand)}
          ${escapeHTML(car.model)}
        </strong>

        <br>

        <span>
          ${escapeHTML(car.price)}
        </span>

      </div>


      <div class="admin-actions">

        <button
          onclick="editCar('${car.id}')"
        >
          ✏️ Modifier
        </button>

        <button
          onclick="deleteCar('${car.id}')"
          class="delete-button"
        >
          🗑️ Supprimer
        </button>

      </div>

    </div>

  `).join("");

}


/* MODIFIER */

function editCar(id) {

  const car =
    cars.find(car => car.id === id);

  if (!car) return;


  $("editId").value = car.id;

  $("brand").value = car.brand;

  $("model").value = car.model;

  $("price").value = car.price;

  $("year").value = car.year;

  $("km").value = car.km;

  $("carFuel").value = car.fuel;

  $("gear").value = car.gear;

  $("location").value = car.location;

  $("description").value =
    car.description || "";


  selectedPhotos = [
    ...(car.photos || [])
  ];

  renderPreview();


  $("formTitle").textContent =
    "Modifier le véhicule";

}


/* SUPPRIMER */

async function deleteCar(id) {

  if (
    !confirm(
      "Supprimer définitivement cette annonce ?"
    )
  ) {
    return;
  }


  const response = await fetch(
    `${API}?id=${id}`,
    {
      method: "DELETE"
    }
  );


  if (!response.ok) {

    alert("Erreur lors de la suppression.");

    return;

  }


  await loadCars();

}


/* ANNULER */

$("cancelButton").addEventListener(
  "click",
  resetForm
);


function resetForm() {

  $("carForm").reset();

  $("editId").value = "";

  selectedPhotos = [];

  $("photoPreview").innerHTML = "";

  $("formTitle").textContent =
    "Ajouter un véhicule";

}


/* PROTECTION AFFICHAGE */

function escapeHTML(value) {

  return String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character])
  );

}
