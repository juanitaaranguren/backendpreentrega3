const User = require('../models/User');
const Chat = require('../models/Chat');


router.post('/send-message', isUser, async (req, res) => {
  try {
    const userId = req.currentUser._id; 
    const { recipientId, message } = req.body;

    const sender = await User.findById(userId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ message: 'no se encontró el producto o usuario' });
    }

    let chat = await Chat.findOne({
      $or: [
        { participants: [sender._id, recipient._id] },
        { participants: [recipient._id, sender._id] }
      ]
    });

    if (!chat) {
      chat = new Chat({ participants: [sender._id, recipient._id], messages: [] });
    }

    chat.messages.push({ sender: sender._id, text: message });
    await chat.save();

    res.status(200).json({ message: 'enviaste el mensaje correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno.' });
  }
});

module.exports = router;
