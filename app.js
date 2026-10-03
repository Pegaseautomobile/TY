const API = "/api/cars";


async function getCars() {

  try {

    const response = await fetch(API);

    if (!response.ok) {
      throw new Error("Erreur API");
    }

    return await response.json();

  } catch (error) {

    console.error(error);

    return [];

  }

}


async function renderCars() {

  const search =
    document.getElementById("search").value.toLowerCase();

  const fuel =
    document.getElementById("fuel").value;

  const container =
    document.getElementById("cars");

  const empty =
    document.getElementById("empty");


  const cars = await getCars();


  const filtered = cars.filter(car => {

    const text =
      `${car.brand} ${car.model}`.toLowerCase();

    return (
      text.includes(search) &&
      (!fuel || car.fuel === fuel)
    );

  });


  container.innerHTML = filtered.map(car => `

    <article class="car">

      <div class="car-img">

        ${
          car.photos && car.photos.length
            ? `<img
                src="${car.photos[0]}"
                alt="${escapeHTML(car.brand)} ${escapeHTML(car.model)}"
              >`
            : ""
        }

      </div>


      <div class="car-body">

        <h3>
          ${escapeHTML(car.brand)}
          ${escapeHTML(car.model)}
        </h3>

        <div class="price">
          ${escapeHTML(car.price)}
        </div>


        <div class="meta">

          <span>${escapeHTML(car.year)}</span>

          <span>${escapeHTML(car.km)}</span>

          <span>${escapeHTML(car.fuel)}</span>

          <span>${escapeHTML(car.gear)}</span>

        </div>


        <p>
          ${escapeHTML(car.description || "")}
        </p>


        <a
          href="tel:+33643486124"
          class="btn green call"
        >
          📞 Mettre en relation avec le vendeur
        </a>

      </div>

    </article>

  `).join("");


  empty.hidden = filtered.length !== 0;

}


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


document
  .getElementById("search")
  .addEventListener("input", renderCars);


document
  .getElementById("fuel")
  .addEventListener("change", renderCars);


document.getElementById("year").textContent =
  new Date().getFullYear();


renderCars();
