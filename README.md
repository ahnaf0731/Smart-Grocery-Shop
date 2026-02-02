# Smart Grocery Shop 🛒

A modern, full-stack grocery shopping application with beautiful animations, complete checkout system, and delivery management. Features a REST API backend, responsive web application, and WPF desktop client.

## 📋 Project Overview

Smart Grocery Shop is a comprehensive e-commerce platform for grocery shopping with:
- **Animated UI** - Stunning logo animations, flying cart effects, and smooth transitions
- **Complete Checkout Flow** - Multi-step checkout with delivery address, time slots, and payment methods
- **Order Management** - Full order tracking with delivery details stored in database
- **Multi-Platform** - Web, Desktop (WPF), and REST API

### Components

1. **REST API** - Node.js/Express backend with SQLite database and delivery tracking
2. **Web Application** - Modern HTML/CSS/JavaScript frontend with animations
3. **WPF Desktop Application** - Windows .NET 8.0 desktop client for management

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Git** - [Download](https://git-scm.com/)

## 📁 Project Structure

```
Smart-Grocery-Shop/
├── API/                    # REST API Backend
│   ├── server.js          # Express server with delivery endpoints
│   ├── migrate_database.js # Database migration for delivery fields
│   ├── check_db.js        # Database utilities
│   ├── package.json       # Node dependencies
│   └── README.md          # API documentation
│
├── Web Application/        # Web Frontend
│   ├── main.html          # Home page with animated UI
│   ├── categories.html    # Product categories
│   ├── about.html         # About page
│   ├── script.js          # Main JavaScript with cart animations
│   ├── api.js             # API integration
│   ├── main.css           # Styles with animations & checkout UI
│   └── images/            # Product images
│
└── Wpf/                   # Desktop Application
    ├── MainWindow.xaml    # Main UI
    ├── Product.cs         # Product model
    ├── ProductDbContext.cs # EF Core context
    ├── Migrations/        # Database migrations
    └── Database/          # SQLite database
        └── product_app.db # Shared database with delivery data
```

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ahnaf0731/Smart-Grocery-Shop.git
cd Smart-Grocery-Shop
```

### 2. Setup REST API

```bash
cd API
npm install

# Run database migration (IMPORTANT for delivery features)
node migrate_database.js

# Start the API server
npm start
```

The API will run on `http://localhost:3000`

**Note:** The migration script adds delivery-related columns to the Orders table. This is required for the checkout system to work properly.

### 3. Setup Web Application

Open `Web Application/main.html` in your browser, or use a local server:

```bash
# Using Python
cd "Web Application"
python -m http.server 8080

# Or using Node.js http-server
npx http-server "Web Application" -p 8080
```

Access at `http://localhost:8080/main.html`

### 4. Setup WPF Desktop Application

```bash
cd Wpf
dotnet restore
dotnet build
dotnet run
```

Or open `Smart grocery shop.sln` in Visual Studio.

## 🛠️ Features

### REST API
- ✅ Product CRUD operations
- ✅ User registration and authentication
- ✅ Order management with delivery details
- ✅ Delivery address tracking
- ✅ Delivery time slot management
- ✅ Payment method recording
- ✅ Order history with full details
- ✅ SQLite database
- ✅ CORS enabled
- ✅ RESTful endpoints

### Web Application
- ✅ **Animated Logo** - Floating, pulsing logo with gradient background
- ✅ **Flying Cart Animation** - Products fly into cart when added
- ✅ **Smart Shopping Cart** - Real-time updates with quantity management
- ✅ **User Authentication** - Login and registration modals
- ✅ **Multi-Step Checkout** - Beautiful, user-friendly checkout flow:
  - 📍 Delivery address collection (street, city, postal, phone)
  - 🕒 Delivery time slot selection (morning/afternoon/evening)
  - 💳 Payment method options (cash/card/online)
  - 📦 Collapsible order summary
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Modern UI/UX** - Gradients, smooth transitions, hover effects
- ✅ **Product Categorization** - Browse by category
- ✅ **Image Gallery** - Product images organized by category

### WPF Desktop Application
- ✅ Product management interface
- ✅ Entity Framework Core integration
- ✅ SQLite database with migrations
- ✅ Modern WPF UI
- ✅ CRUD operations for products

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/users/register` | Register user |
| POST | `/api/users/login` | Login user |

## 🗂️ Product Categories

- 🥖 Bakery
- 🥤 Beverages
- 🐟 Fish
- 🍎 Fruits
- 🧃 Juice
- 🥩 Meat
- 🍿 Snacks
- 🥕 Vegetables

## 🔌 Technologies Used

### Backend
- Node.js
- Express.js
- SQLite3
- CORS
- Body-parser

### Frontend (Web)
- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API

### Desktop Application
- C# / .NET 8.0
- WPF (Windows Presentation Foundation)
- Entity Framework Core 9.0.2
- SQLite

## 📝 Development

### API Development
```bash
cd API
npm run dev  # Run with nodemon for auto-reload
```

### Database Check
```bash
cd API
node check_db.js  # Verify database connection
```

### WPF Migrations
```bash
cd Wpf
dotnet ef migrations add MigrationName
dotnet ef database update
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- [@ahnaf0731](https://github.com/ahnaf0731)

## 🐛 Known Issues

- API server port conflicts (default: 3000)
- CORS configuration may need adjustment for production
- Database path configuration in WPF application

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

## 🔜 Future Enhancements

- [x] Animated logo and header
- [x] Flying cart animation
- [x] Complete checkout with delivery details
- [x] Payment method selection
- [x] Delivery time slot management
- [x] Order tracking with delivery info
- [ ] Payment gateway integration
- [ ] Real-time order tracking updates
- [ ] Email notifications for orders
- [ ] SMS notifications for delivery
- [ ] Admin dashboard for order management
- [ ] Mobile application
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Multiple delivery addresses per user
- [ ] Order modification/cancellation
- [ ] Sales analytics and reporting
- [ ] Inventory management alerts
- [ ] Customer chat support

---

⭐ Star this repository if you find it helpful!
