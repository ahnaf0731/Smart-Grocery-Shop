# Smart Grocery Shop

A comprehensive grocery shopping system with three integrated components: a REST API backend, a web application frontend, and a Windows desktop application.

## 📋 Project Overview

Smart Grocery Shop is a multi-platform grocery management system that allows users to browse products, manage inventory, and handle shopping operations across different platforms.

### Components

1. **REST API** - Node.js/Express backend with SQLite database
2. **Web Application** - HTML/CSS/JavaScript frontend
3. **WPF Desktop Application** - Windows .NET 8.0 desktop client

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Git** - [Download](https://git-scm.com/)

## 📁 Project Structure

```
Smart-Grocery-Shop/
├── API/                    # REST API Backend
│   ├── server.js          # Express server
│   ├── check_db.js        # Database utilities
│   ├── package.json       # Node dependencies
│   └── README.md          # API documentation
│
├── Web Application/        # Web Frontend
│   ├── main.html          # Home page
│   ├── categories.html    # Product categories
│   ├── about.html         # About page
│   ├── script.js          # Main JavaScript
│   ├── api.js             # API integration
│   ├── main.css           # Styles
│   └── images/            # Product images
│
└── Wpf/                   # Desktop Application
    ├── MainWindow.xaml    # Main UI
    ├── Product.cs         # Product model
    ├── ProductDbContext.cs # EF Core context
    ├── Migrations/        # Database migrations
    └── Database/          # SQLite database
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
npm start
```

The API will run on `http://localhost:3000`

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
- ✅ User registration and login
- ✅ SQLite database
- ✅ CORS enabled
- ✅ RESTful endpoints

### Web Application
- ✅ Product browsing by categories
- ✅ Responsive design
- ✅ Product search and filtering
- ✅ Shopping cart functionality
- ✅ Image gallery for products

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

- [ ] User authentication with JWT
- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Admin dashboard
- [ ] Mobile application
- [ ] Real-time inventory updates
- [ ] Email notifications
- [ ] Advanced search filters

---

⭐ Star this repository if you find it helpful!
