const Product = require('../models/Products');


router.post('/create', isAdmin, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const newProduct = new Product({ name, price, description });
    await newProduct.save();

    res.status(201).json({ message: 'Producto creado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno' });
  }
});


router.put('/:productId/update', isAdmin, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, price, description } = req.body;

   
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'no se encontró el producto' });
    }

   
    product.name = name;
    product.price = price;
    product.description = description;
    await product.save();

    res.status(200).json({ message: 'Producto actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


router.delete('/:productId/delete', isAdmin, async (req, res) => {
  try {
    const productId = req.params.productId;

 
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

   
    await product.remove();

    res.status(200).json({ message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
