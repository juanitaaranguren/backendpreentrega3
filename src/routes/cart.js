const express = require('express');
const router = express.Router();
const { isUser } = require('../middleware/authorization');
const Ticket = require('../models/Ticket');
const Product = require('../models/Product');
const User = require('../models/User');

router.post('/add-to-cart', isUser, async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const productId = req.body.productId;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'no se encontró el producto o el usuario' });
    }

    const isInCart = user.cart.some(item => item.product.equals(productId));

    if (isInCart) {
      return res.status(400).json({ message: 'Ya tienes el producto en tu carrito.' });
    }

    user.cart.push({ product: productId, quantity: 1 });
    await user.save();

    res.status(200).json({ message: 'producto agregado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno.' });
  }
});

router.post('/:cid/purchase', isUser, async (req, res) => {
  try {
    const cartId = req.params.cid;
    const userId = req.currentUser._id;

    const cart = await User.findById(userId).populate('cart.product');

    if (!cart) {
      return res.status(404).json({ message: 'no se encontraron datos.' });
    }

    const productsNotProcessed = await processPurchase(cart.cart);

    if (productsNotProcessed.length > 0) {
      return res.status(400).json({ productsNotProcessed });
    }

    const ticket = await generateTicket(userId, cart.cart);

    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    res.status(200).json({ message: 'Compra exitosa', ticketId: ticket._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno' });
  }
});

async function processPurchase(cartItems) {
  const productsNotProcessed = [];

  for (const item of cartItems) {
    const product = item.product;
    const quantityInCart = item.quantity;

    if (product.stock >= quantityInCart) {
      product.stock -= quantityInCart;
      await product.save();
    } else {
      productsNotProcessed.push(product._id);
    }
  }

  return productsNotProcessed;
}

async function generateTicket(userId, cartItems) {
  const ticketItems = cartItems.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity,
  }));

  const totalAmount = ticketItems.reduce((total, item) => total + item.subtotal, 0);

  const ticketData = {
    purchaser: userId,
    amount: totalAmount,
    items: ticketItems,
  };

  const ticket = new Ticket(ticketData);
  await ticket.save();

  return ticket;
}

module.exports = router;
