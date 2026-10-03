const cars = [];


function renderCars() {

  const search =
    document.getElementById("search").value.toLowerCase();

  const fuel =
    document.getElementById("fuel").value;

  const container =
    document.getElementById("cars");

  const empty =
    document.getElementById("empty");


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
            ? `<img src="${car.photos[0]}" alt="${car.brand} ${car.model}">`
            : ""
        }

      </div>


      <div class="car-body">

        <h3>
          ${car.brand} ${car.model}
        </h3>

        <div class="price">
          ${car.price}
        </div>


        <div class="meta">

          <span>${car.year}</span>

          <span>${car.km}</span>

          <span>${car.fuel}</span>

          <span>${car.gear}</span>

        </div>


        <p>
          ${car.description || ""}
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


document
  .getElementById("search")
  .addEventListener("input", renderCars);


document
  .getElementById("fuel")
  .addEventListener("change", renderCars);


document.getElementById("year").textContent =
  new Date().getFullYear();


renderCars();
