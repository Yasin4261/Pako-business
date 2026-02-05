# Pako Business - Restaurant Order Hub

A streamlined restaurant ordering management system that enables restaurants to create and track customer orders efficiently.

## Features

- **Menu Catalog Management** - Browse available menu items with pricing
- **Order Creation** - Restaurants can submit orders with customer details
- **Order Tracking** - View all orders with status updates
- **Status Management** - Track orders through their lifecycle (pending, confirmed, preparing, ready, delivered, cancelled)
- **User-Friendly Interface** - Clean, intuitive web interface for order management

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Yasin4261/Pako-business.git
cd Pako-business
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Get Menu Catalog
```
GET /api/catalog
```
Retrieves all available menu items.

### Submit Order
```
POST /api/submit-order
```
Creates a new order. Requires:
- `restaurantName` (required)
- `orderedItems` (required, array of items with itemId and quantity)
- `customerDetails` (optional, object with name, phone, address)
- `deliveryInstructions` (optional)

### Get All Orders
```
GET /api/orders
```
Retrieves all orders from the system.

### Get Specific Order
```
GET /api/orders/:orderId
```
Retrieves details of a specific order.

### Update Order Status
```
PATCH /api/orders/:orderId/status
```
Updates the status of an order. Valid statuses: pending, confirmed, preparing, ready, delivered, cancelled.

## Usage Example

1. Open the web interface
2. Browse available menu items
3. Select items and quantities using the + and - buttons
4. Fill in restaurant and customer information
5. Review the order summary
6. Submit the order
7. View the order in the recent orders section

## Technology Stack

- **Backend**: Node.js with Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: In-memory (for demonstration purposes)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Yasin Güneş