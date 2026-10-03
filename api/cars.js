let cars = [];

export default function handler(req, res) {

  if (req.method === "GET") {

    return res.status(200).json(cars);

  }


  if (req.method === "POST") {

    const car = {
      id: Date.now().toString(),
      ...req.body
    };

    cars.push(car);

    return res.status(201).json(car);

  }


  if (req.method === "PUT") {

    const { id } = req.query;

    const index =
      cars.findIndex(car => car.id === id);

    if (index === -1) {

      return res
        .status(404)
        .json({
          error: "Véhicule introuvable"
        });

    }

    cars[index] = {
      ...cars[index],
      ...req.body
    };

    return res.status(200).json(cars[index]);

  }


  if (req.method === "DELETE") {

    const { id } = req.query;

    cars =
      cars.filter(car => car.id !== id);

    return res.status(200).json({
      success: true
    });

  }


  return res
    .status(405)
    .json({
      error: "Méthode non autorisée"
    });

}
