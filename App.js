import React, { useState } from 'react';
import './App.css';

// Base de datos de productos (tacos)
const tacos = [
  // Tacos tradicionales
  { id: 1, title: "Tacos al Pastor", brand: "Tradicional", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZS-J5gGJI6PmdHS4sFY8ec1-piVqjW3nAMA&s", description: "Cerdo marinado, piña y cilantro.", price: 25 },
  { id: 2, title: "Tacos de Bistec", brand: "Tradicional", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6ogAulg3Kp1oly7KrRR-JHG1omebysU3-rQ&s", description: "Bistec asado con cebolla.", price: 28 },
  { id: 3, title: "Tacos de Suadero", brand: "Tradicional", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQew8D7N_bB4VOWKp3ncT7dgCSnV3wwSDeT0Q&s", description: "Suadero dorado con salsa verde.", price: 27 },
  
  // Tacos de mariscos
  { id: 4, title: "Tacos de Pescado", brand: "Mariscos", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXlfR6OOUhyIvtqfzP0Qkiyt_WrYsCo8neuA&s", description: "Pescado empanizado con repollo.", price: 35 },
  { id: 5, title: "Tacos de Camarón", brand: "Mariscos", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqfmlEmdASMSt--j22XDhBm4vIus6x4JwiIQ&sz", description: "Camarones al mojo de ajo.", price: 40 },
  
  // Vegetarianos
  { id: 6, title: "Tacos de Nopal", brand: "Vegetariano", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa0m9GnI6NZc8QyDBm0Wj5uD6tEDFJXssvHw&s", description: "Nopales con queso fresco.", price: 22 },
  
  // Especialidades
  { id: 7, title: "Tacos de Arrachera", brand: "Gourmet", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4LWGJSVA2MM2oc_QGH1pPzqKGtx1FOvkTA&s", description: "Arrachera marinada con guacamole.", price: 45 },
  { id: 8, title: "Tacos de Cochinita", brand: "Especial", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-2luUYsP_WFVdizlhY3-PJiTSfj73sEeroA&s", description: "Cochinita pibil estilo Yucatán.", price: 38 }
];

// Extras mexicanos (sin imágenes para mantener URLs originales)
const extras = [
  { id: 101, title: "Guacamole", price: 15, description: "Porción de guacamole fresco" },
  { id: 102, title: "Salsa Verde", price: 5, description: "Salsa verde picante" },
  { id: 103, title: "Salsa Roja", price: 5, description: "Salsa roja ahumada" },
  { id: 104, title: "Queso Extra", price: 10, description: "Queso fresco adicional" },
  { id: 105, title: "Frijoles Charros", price: 12, description: "Porción de frijoles charros" }
];

// Métodos de pago (íconos simplificados)
const paymentLogos = {
  'credit-card': '💳',
  'paypal': 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png',
  'cash': '💰',
  'transfer': '🏦'
};

function App() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });
  const [step, setStep] = useState(1); // 1: Menú, 2: Extras, 3: Pago, 4: Confirmación

  // Funciones principales
  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());
  
  const handleAddToCart = (product) => {
    setCart([...cart, {...product, type: 'taco'}]);
    setStep(2); // Ir a selección de extras
  };

  const handleAddExtra = (extra) => {
    setSelectedExtras({
      ...selectedExtras,
      [extra.id]: !selectedExtras[extra.id]
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    const tacosTotal = cart.filter(item => item.type === 'taco').reduce((total, item) => total + item.price, 0);
    const extrasTotal = Object.keys(selectedExtras)
      .filter(id => selectedExtras[id])
      .reduce((total, id) => {
        const extra = extras.find(e => e.id === parseInt(id));
        return total + (extra ? extra.price : 0);
      }, 0);
    return (tacosTotal + extrasTotal).toFixed(2);
  };

  const resetCart = () => {
    setCart([]);
    setSelectedExtras({});
    setPaymentMethod('');
    setPaymentInfo({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      email: ''
    });
    setStep(1);
  };

  // Filtrado de productos
  const filteredTacos = tacos.filter(taco =>
    taco.title.toLowerCase().includes(search) ||
    taco.brand.toLowerCase().includes(search)
  );

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="logo-container">
          <h1>🌮 Taquería "El Buen Sazón"</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar tacos..."
            onChange={handleSearch}
            className="search-input"
          />
          <button className="cart-button" onClick={() => setStep(1)}>
            🛒 {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main>
        {step === 1 && (
          <div className="menu-container">
            <div className="product-grid">
              {filteredTacos.map(taco => (
                <div key={taco.id} className="taco-card">
                  <img src={taco.image} alt={taco.title} className="taco-image" />
                  <div className="taco-info">
                    <h3>{taco.title}</h3>
                    <p className="taco-type">{taco.brand}</p>
                    <p className="taco-description">{taco.description}</p>
                    <p className="taco-price">${taco.price.toFixed(2)} MXN</p>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(taco)}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Carrito de compras */}
            {cart.length > 0 && (
              <div className="cart-sidebar">
                <h2>Tu Pedido</h2>
                <ul className="cart-items">
                  {cart.map(item => (
                    <li key={item.id} className="cart-item">
                      <img src={item.image} alt={item.title} className="cart-item-image" />
                      <div className="cart-item-details">
                        <span>{item.title}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                      <button 
                        className="remove-item-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="cart-total">
                  <span>Total:</span>
                  <span>${calculateTotal()} MXN</span>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={() => setStep(3)}
                >
                  Pagar ahora
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="extras-container">
            <h2>Añade extras a tu pedido</h2>
            <div className="extras-grid">
              {extras.map(extra => (
                <div 
                  key={extra.id} 
                  className={`extra-card ${selectedExtras[extra.id] ? 'selected' : ''}`}
                  onClick={() => handleAddExtra(extra)}
                >
                  <div className="extra-info">
                    <h3>{extra.title}</h3>
                    <p>{extra.description}</p>
                    <p className="extra-price">+${extra.price.toFixed(2)} MXN</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="extras-actions">
              <button 
                className="back-btn"
                onClick={() => setStep(1)}
              >
                Volver
              </button>
              <button 
                className="continue-btn"
                onClick={() => setStep(3)}
              >
                Continuar al pago
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Método de pago */}
        {step === 3 && (
          <div className="payment-container">
            <h2>Método de Pago</h2>
            <div className="payment-methods">
              {Object.entries(paymentLogos).map(([method, logo]) => (
                <div 
                  key={method} 
                  className={`payment-method ${paymentMethod === method ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {typeof logo === 'string' && logo.startsWith('http') ? (
                    <img src={logo} alt={method} className="payment-logo" />
                  ) : (
                    <span className="payment-icon">{logo}</span>
                  )}
                  <h3>
                    {method === 'credit-card' && 'Tarjeta'}
                    {method === 'paypal' && 'PayPal'}
                    {method === 'cash' && 'Efectivo'}
                    {method === 'transfer' && 'Transferencia'}
                  </h3>
                </div>
              ))}
            </div>

            {paymentMethod && (
              <div className="payment-form">
                {paymentMethod === 'credit-card' && (
                  <>
                    <div className="form-group">
                      <label>Número de tarjeta</label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456" 
                        required 
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Fecha de expiración</label>
                        <input type="text" placeholder="MM/AA" required />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input type="text" placeholder="123" required />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="form-group">
                    <label>Email de PayPal</label>
                    <input type="email" placeholder="tucorreo@example.com" required />
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="cash-message">
                    <p>Paga en efectivo al recibir tu pedido.</p>
                  </div>
                )}

                {paymentMethod === 'transfer' && (
                  <div className="transfer-info">
                    <p>Realiza una transferencia a:</p>
                    <p><strong>Banco:</strong> BanTaco</p>
                    <p><strong>CLABE:</strong> 1234 5678 9012 3456 78</p>
                    <p><strong>Beneficiario:</strong> Taquería El Buen Sazón</p>
                  </div>
                )}

                <div className="order-summary">
                  <h3>Resumen del pedido</h3>
                  <ul>
                    {cart.map(item => (
                      <li key={item.id}>
                        <span>{item.title}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </li>
                    ))}
                    {Object.keys(selectedExtras)
                      .filter(id => selectedExtras[id])
                      .map(id => {
                        const extra = extras.find(e => e.id === parseInt(id));
                        return (
                          <li key={id}>
                            <span>+ {extra.title}</span>
                            <span>${extra.price.toFixed(2)}</span>
                          </li>
                        );
                      })
                    }
                  </ul>
                  <div className="order-total">
                    <strong>Total:</strong>
                    <span>${calculateTotal()} MXN</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="back-btn"
                    onClick={() => {
                      setPaymentMethod('');
                      setStep(2);
                    }}
                  >
                    Volver
                  </button>
                  <button 
                    type="button" 
                    className="confirm-payment-btn"
                    onClick={() => setStep(4)}
                  >
                    Confirmar pago
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Paso 4: Confirmación */}
        {step === 4 && (
          <div className="confirmation-container">
            <div className="confirmation-card">
              <div className="confirmation-icon">✅</div>
              <h2>¡Pedido confirmado!</h2>
              <p>Tu orden de tacos está en camino.</p>
              
              <div className="order-summary">
                <h3>Resumen del pedido</h3>
                <ul>
                  {cart.map(item => (
                    <li key={item.id}>
                      <span>{item.title}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                  {Object.keys(selectedExtras)
                    .filter(id => selectedExtras[id])
                    .map(id => {
                      const extra = extras.find(e => e.id === parseInt(id));
                      return (
                        <li key={id}>
                          <span>+ {extra.title}</span>
                          <span>${extra.price.toFixed(2)}</span>
                        </li>
                      );
                    })
                  }
                </ul>
                <div className="order-total">
                  <strong>Total:</strong>
                  <span>${calculateTotal()} MXN</span>
                </div>
              </div>

              <button 
                className="new-order-btn"
                onClick={resetCart}
              >
                Hacer otro pedido
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>🌮 Taquería "El Buen Sazón"</h3>
            <p>Horario: Lunes a Domingo, 12pm - 10pm</p>
            <p>Dirección: Calle Taco #123, Ciudad México</p>
          </div>
          <div className="footer-contact">
            <p>📞 Tel: 55 1234 5678</p>
            <p>✉️ contacto@elbuensazon.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;