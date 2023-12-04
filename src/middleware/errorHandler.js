
const errorDictionary = {
    PRODUCT_NOT_FOUND: 'este producto se agotó',
    USER_NOT_FOUND: 'no encontrmos tu usuario',
    INSUFFICIENT_STOCK: 'por ahora no hay más unidades disponibles',
    CART_ITEM_ALREADY_EXISTS: 'ya agregaste este producto al carrito',
  
  };

  function customizeError(errorCode, message = '') {
    const errorMessage = errorDictionary[errorCode] || 'Error desconocido';
    return new Error(message || errorMessage);
  }
  
  module.exports = { customizeError, errorDictionary };
  