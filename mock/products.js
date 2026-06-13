const products = [
  {
    _id: "prod-1",
    imagePath:
      "https://claudescafedavao.com/wp-content/uploads/2018/08/consoles.jpg",
    title: "XBOX 400E",
    description:
      "Xbox gaming console with next-gen games and entertainment experience.",
    price: 20030
  },
  {
    _id: "prod-2",
    imagePath:
      "https://claudescafedavao.com/wp-content/uploads/2018/08/consoles.jpg",
    title: "XBOX 600T",
    description:
      "Premium Xbox console for high-performance gaming and streaming.",
    price: 35000
  },
  {
    _id: "prod-3",
    imagePath:
      "https://claudescafedavao.com/wp-content/uploads/2018/08/consoles.jpg",
    title: "XBOX 000F",
    description: "Compact Xbox console ideal for casual and family gaming.",
    price: 30000
  },
  {
    _id: "prod-4",
    imagePath:
      "https://claudescafedavao.com/wp-content/uploads/2018/08/consoles.jpg",
    title: "XBOX 00ET",
    description: "Entry-level Xbox console with essential gaming features.",
    price: 10030
  }
];

function getAll() {
  return products;
}

function findById(id) {
  return products.find(p => p._id === id || p.id === id);
}

module.exports = { getAll, findById };
