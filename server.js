

const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Rutas para productos
const productosFilePath = './data/productos.json';

app.get('/api/products', (req, res) => {
  const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));
  res.json(productos);
});

app.get('/api/products/:pid', (req, res) => {
  const pid = req.params.pid;
  const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));
  const producto = productos.find((p) => p.id === pid);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));
  newProduct.id = generateNewProductId(productos);
  productos.push(newProduct);
  fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));
  res.json(newProduct);
});

app.put('/api/products/:pid', (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;
  const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));
  const index = productos.findIndex((p) => p.id === pid);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...updatedProduct };
    fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));
    res.json(productos[index]);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

app.delete('/api/products/:pid', (req, res) => {
  const pid = req.params.pid;
  const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));
  const index = productos.findIndex((p) => p.id === pid);
  if (index !== -1) {
    productos.splice(index, 1);
    fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Rutas para carritos
const carritosFilePath = './data/carrito.json';

app.post('/api/carts', (req, res) => {
  const newCart = req.body;
  newCart.id = generateNewCartId();
  fs.writeFileSync(carritosFilePath, JSON.stringify(newCart, null, 2));
  res.json(newCart);
});

app.get('/api/carts/:cid', (req, res) => {
  const cid = req.params.cid;
  const carrito = JSON.parse(fs.readFileSync(carritosFilePath, 'utf-8'));
  if (carrito.id === cid) {
    res.json(carrito.products);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;
  const carrito = JSON.parse(fs.readFileSync(carritosFilePath, 'utf-8'));

  
  const productIndex = carrito.products.findIndex((p) => p.product_id === pid);


  if (productIndex !== -1) {
    carrito.products[productIndex].quantity += quantity;
  } else {
    carrito.products.push({ id: pid, quantity: quantity });
  }

  fs.writeFileSync(carritosFilePath, JSON.stringify(carrito, null, 2));
  res.json(carrito);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

function generateNewProductId(productos) {
  // Implementa la lógica para generar un ID único
  // Puedes utilizar un algoritmo para generar IDs únicos
  // Por ejemplo, puedes generar un UUID o simplemente un número incremental
  // Aquí te doy un ejemplo sencillo de generación de ID incremental:
  let maxId = 0;
  for (const producto of productos) {
    if (producto.id > maxId) {
      maxId = producto.id;
    }
  }
  return maxId + 1;
}

function generateNewCartId() {
  // Implementa la lógica para generar un ID único para carritos
  // Similar a generateNewProductId, puedes utilizar un algoritmo adecuado
  // Aquí te doy un ejemplo sencillo de generación de ID incremental:
  let maxId = 0;
  const carrito = JSON.parse(fs.readFileSync(carritosFilePath, 'utf-8'));
  if (carrito && carrito.id) {
    maxId = parseInt(carrito.id);
  }
  return (maxId + 1).toString();
}
