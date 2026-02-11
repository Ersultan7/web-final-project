const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRecipeRoutes = require('./routes/publicRecipeRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static frontend (Bootstrap pages)
app.use(express.static(path.join(__dirname, 'public')));

// API routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/meal-plan', mealPlanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public/recipes', publicRecipeRoutes);

// Routes matching assignment paths (no /api prefix)
// Authentication (public)
app.use('/', authRoutes); // POST /register, POST /login

// User management (private)
app.use('/users', userRoutes); // GET/PUT /users/profile

// Second collection "resource" = recipes (private)
app.use('/resource', recipeRoutes); // /resource, /resource/:id

// Public recipes feed (for landing & explore)
app.use('/public/recipes', publicRecipeRoutes);

// Short aliases for other private features
app.use('/favorites', favoriteRoutes);
app.use('/collections', collectionRoutes);
app.use('/meal-plan', mealPlanRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Recipe Book API is running' });
});

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

