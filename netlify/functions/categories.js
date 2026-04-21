exports.handler = async function () {
  return {
    statusCode: 200,
    body: JSON.stringify([
      { id: 1, name: "Restaurants" },
      { id: 2, name: "Electronics" },
      { id: 3, name: "Groceries" }
    ]),
  };
};