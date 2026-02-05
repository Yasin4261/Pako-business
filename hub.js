const express = require('express');
const diningSvc = express();
const port = 3000;

diningSvc.use(express.json());
diningSvc.use(express.static('web'));

// In-memory storage for demonstration
const orderRegistry = new Map();
const menuCatalog = new Map();
let orderSequence = 1000;

// Initialize sample menu
menuCatalog.set('item_01', { identifier: 'item_01', title: 'Grilled Chicken Plate', cost: 15.99, availability: true });
menuCatalog.set('item_02', { identifier: 'item_02', title: 'Vegetarian Pasta Bowl', cost: 12.50, availability: true });
menuCatalog.set('item_03', { identifier: 'item_03', title: 'Seafood Platter', cost: 22.00, availability: true });
menuCatalog.set('item_04', { identifier: 'item_04', title: 'Caesar Salad', cost: 8.99, availability: true });

// Endpoint: Retrieve menu catalog
diningSvc.get('/api/catalog', (req, res) => {
  const availableItems = Array.from(menuCatalog.values());
  res.json({ 
    success: true, 
    items: availableItems,
    message: 'Menu catalog retrieved successfully' 
  });
});

// Endpoint: Submit new dining order
diningSvc.post('/api/submit-order', (req, res) => {
  const { restaurantName, customerDetails, orderedItems, deliveryInstructions } = req.body;
  
  if (!restaurantName || !orderedItems || orderedItems.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Restaurant name and ordered items are required' 
    });
  }

  const orderIdentifier = `ORD-${orderSequence++}`;
  const timestamp = new Date().toISOString();
  
  let totalAmount = 0;
  const validatedItems = [];
  
  for (const item of orderedItems) {
    const menuItem = menuCatalog.get(item.itemId);
    if (menuItem && menuItem.availability) {
      const quantity = item.quantity || 1;
      validatedItems.push({
        ...menuItem,
        quantity: quantity,
        subtotal: menuItem.cost * quantity
      });
      totalAmount += menuItem.cost * quantity;
    }
  }

  const newOrder = {
    orderIdentifier,
    restaurantName,
    customerDetails: customerDetails || {},
    orderedItems: validatedItems,
    totalAmount,
    deliveryInstructions: deliveryInstructions || 'No special instructions',
    orderStatus: 'pending',
    createdAt: timestamp,
    lastModified: timestamp
  };

  orderRegistry.set(orderIdentifier, newOrder);

  res.status(201).json({ 
    success: true, 
    order: newOrder,
    message: 'Order submitted successfully' 
  });
});

// Endpoint: Fetch all orders
diningSvc.get('/api/orders', (req, res) => {
  const allOrders = Array.from(orderRegistry.values());
  res.json({ 
    success: true, 
    orders: allOrders,
    count: allOrders.length,
    message: 'Orders retrieved successfully' 
  });
});

// Endpoint: Fetch specific order
diningSvc.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orderRegistry.get(orderId);
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
  }

  res.json({ 
    success: true, 
    order,
    message: 'Order details retrieved' 
  });
});

// Endpoint: Update order status
diningSvc.patch('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;
  
  const order = orderRegistry.get(orderId);
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
  }

  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid status value' 
    });
  }

  order.orderStatus = newStatus;
  order.lastModified = new Date().toISOString();
  orderRegistry.set(orderId, order);

  res.json({ 
    success: true, 
    order,
    message: 'Order status updated successfully' 
  });
});

diningSvc.listen(port, () => {
  console.log(`Pako Business Hub is running on port ${port}`);
  console.log(`Access the system at http://localhost:${port}`);
});
