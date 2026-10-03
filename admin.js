const ADMIN_CODE = "Pégase123";

let cars = [];

let selectedPhotos = [];

const $ = id => document.getElementById(id);


/* =========================
   CONNEXION
========================= */

$("loginButton").addEventListener("click", login);

$("adminCode").addEventListener("keydown", event => {

  if (event.key === "Enter") {
    login();
  }

});


function login() {

  const code = $("adminCode").value;

  if (code === ADMIN_CODE) {

    $("loginError").textContent = "";

    $("loginButton").disabled = true;

    $("adminCode").value = "";

    $("adminPanel").hidden = false;

    document.querySelector(".login-card").hidden = true;

    loadCars();

  } else {

    $("loginError").textContent =
      "Code incorrect.";

  }

}


/* =========================
   DÉCONNEXION
========================= */

$("logoutButton").addEventListener("click", () => {

  $("adminPanel").hidden = true;

  document.querySelector(".login-card").hidden = false;

  $("loginButton").disabled = false;

});


/* =========================
   PHOTOS
========================= */

$("photos").addEventListener("change", event => {

  const files = [...event.target.files];

  selectedPhotos = [];

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


/* =========================
   AJOUTER / MODIFIER
========================= */

$("carForm").addEventListener("submit", event => {

  event.preventDefault();

  const editId = $("editId").value;


  const car = {

    id: editId || Date.now().toString(),

    brand: $("brand").value,

    model: $("model").value,

    price: $("price").value,

    year: $("year").value,

    km: $("km").value,

    fuel: $("carFuel").value,

    gear: $("gear").value,

    location: $("location").value,

    description: $("description").value,

    photos: [...selectedPhotos]

  };


  if (editId) {

    cars = cars.map(existingCar =>
      existingCar.id === editId
        ? car
        : existingCar
    );

  } else {

    cars.push(car);

  }


  saveCars();

  renderAdmin();

  resetForm();

  alert(
    editId
      ? "Annonce modifiée !"
      : "Annonce ajoutée !"
  );

});


/* =========================
   SAUVEGARDE LOCALE
========================= */

function saveCars() {

  localStorage.setItem(
    "pegaseCars",
    JSON.stringify(cars)
  );

}


function loadCars() {

  const saved =
    localStorage.getItem("pegaseCars");

  if (saved) {

    try {

      cars = JSON.parse(saved);

    } catch {

      cars = [];

    }

  }

  renderAdmin();

}


/* =========================
   AFFICHAGE ADMIN
========================= */

function renderAdmin() {

  $("carCount").textContent = cars.length;


  $("adminCars").innerHTML =
    cars.map(car => `

      <div class="admin-car">

        <div>

          ${
            car.photos?.[0]
              ? `<img
                  src="${car.photos[0]}"
                  alt=""
                >`
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


/* =========================
   MODIFIER
========================= */

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


  selectedPhotos =
    [...(car.photos || [])];

  renderPreview();


  $("formTitle").textContent =
    "Modifier le véhicule";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================
   SUPPRIMER
========================= */

function deleteCar(id) {

  const confirmation =
    confirm(
      "Supprimer définitivement cette annonce ?"
    );

  if (!confirmation) return;


  cars =
    cars.filter(car => car.id !== id);


  saveCars();

  renderAdmin();

}


/* =========================
   ANNULER
========================= */

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


/* =========================
   SÉCURITÉ AFFICHAGE
========================= */

function escapeHTML(value) {

  return String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]
  );

}
