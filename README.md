# Recipe Book – Node.js Final Project

Minimalistic orange **Recipe Book** web app built with **Node.js**, **Express.js**, **MongoDB**, **JWT authentication**, and **Bootstrap**.

This project is structured to match all of your final project requirements: modular backend (routes, controllers, models, middleware, config), MongoDB with 5+ collections, full authentication flow with JWT and bcrypt, RBAC, validation & global error handling, and at least four responsive Bootstrap pages.

---

## 1. Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth & Security**: JWT, bcryptjs, RBAC
- **Validation**: Joi
- **Frontend**: Static HTML + Bootstrap 5 (CDN), custom minimalistic orange theme
- **Dev tools**: nodemon, morgan, dotenv

---

## 2. Project Structure

```text
.
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # /register, /login logic
│   ├── recipeController.js   # Recipe CRUD ("resource")
│   └── userController.js     # User profile
├── middleware/
│   ├── authMiddleware.js     # JWT protect + RBAC helper
│   ├── errorMiddleware.js    # 404 + global error handler
│   └── validateMiddleware.js # Generic Joi validator (optional)
├── models/
│   ├── User.js               # Users (with role)
│   ├── Recipe.js             # Recipes (second collection / resource)
│   ├── Category.js           # Recipe categories
│   ├── Ingredient.js         # Ingredient reference
│   └── Favorite.js           # User favorites (user–recipe link)
├── public/
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── register.html         # Register page
│   ├── dashboard.html        # Logged-in recipe dashboard
│   ├── css/
│   │   └── styles.css        # Minimalistic orange Bootstrap overrides
│   └── js/
│       └── app.js            # Frontend logic (auth + recipes)
├── routes/
│   ├── authRoutes.js         # /api/auth + /register, /login
│   ├── userRoutes.js         # /api/users + /users/profile
│   └── recipeRoutes.js       # /api/recipes + /resource
├── .env.example              # Example environment variables
├── package.json
└── server.js                 # Express app entry point
```

---

## 3. How to Run the Project

### 3.1 Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** running locally or a MongoDB Atlas connection string

### 3.2 Installation

1. Open a terminal and go to the project folder:

   ```bash
   cd c:\Study\Node\Final
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (you can copy from `.env.example`):

   ```bash
   copy .env.example .env   # or create manually
   ```

   Edit `.env` with your values:

   ```env
   MONGO_URI=mongodb://localhost:27017/recipe_book
   JWT_SECRET=your-strong-secret
   PORT=5000
   NODE_ENV=development
   ```

### 3.3 Start the Server

- Development with auto-reload:

  ```bash
  npm run dev
  ```

- Production/start:

  ```bash
  npm start
  ```

The app will run at `http://localhost:5000`.

- Frontend pages:
  - `http://localhost:5000/` – landing page
  - `http://localhost:5000/register.html` – register
  - `http://localhost:5000/login.html` – login
  - `http://localhost:5000/dashboard.html` – recipe dashboard (requires login)

---

## 4. Database & Collections (Requirement: 5+)

The app uses **MongoDB** with at least **five collections**:

1. **User**
   - Fields: `username`, `email`, `password` (hashed), `role` (`user` | `admin`), timestamps
   - First registered user automatically becomes **admin** (for RBAC demo).

2. **Recipe** (second main collection / "resource")
   - Fields: `title`, `description`, `ingredients[]`, `steps[]`, `cookingTime`, `difficulty`, `isCooked`, `isPublic`, `category`, `author`, timestamps
   - `author` references `User`.

3. **Category**
   - Fields: `name`, `description`, timestamps
   - Referenced by `Recipe.category`.

4. **Ingredient**
   - Fields: `name`, `unit`, timestamps
   - Example catalog of ingredients (not strictly required in controllers, but available).

5. **Favorite**
   - Fields: `user`, `recipe`, timestamps
   - Unique index on (`user`, `recipe`) to prevent duplicates.

---

## 5. API Endpoints (Mapped to Requirements)

All JSON responses follow a simple consistent pattern and use meaningful HTTP status codes.

### 5.1 Authentication – Public Endpoints

**Requirement:**

- `POST /register`
- `POST /login`

**Implemented:**

- `POST /register`
- `POST /login`
- Aliases with `/api` prefix:
  - `POST /api/auth/register`
  - `POST /api/auth/login`

**Register – POST /register**

- Body:

  ```json
  {
    "username": "chef1",
    "email": "chef@example.com",
    "password": "secret123"
  }
  ```

- Validations:
  - `username`: required, string, 3–50 chars
  - `email`: required, valid email
  - `password`: required, min 6 chars

- Behavior:
  - Password hashed using **bcryptjs**.
  - If this is the first user, `role` is set to `"admin"`, otherwise `"user"`.
  - Returns JWT token and user info (without password).

**Login – POST /login**

- Body:

  ```json
  {
    "email": "chef@example.com",
    "password": "secret123"
  }
  ```

- Validations:
  - `email`: required, valid email
  - `password`: required, min 6 chars

- Behavior:
  - Verifies credentials using bcrypt.
  - Returns JWT token and user info.

---

### 5.2 User Management – Private Endpoints

**Requirement:**

- `GET /users/profile`
- `PUT /users/profile`

**Implemented:**

- `GET /users/profile`
- `PUT /users/profile`
- Aliases with `/api` prefix:
  - `GET /api/users/profile`
  - `PUT /api/users/profile`

**Auth:**

- Requires header: `Authorization: Bearer <JWT_TOKEN>`
- JWT is validated in `middleware/authMiddleware.js` (`protect`).

**GET /users/profile**

- Returns logged-in user profile:

  ```json
  {
    "id": "...",
    "username": "chef1",
    "email": "chef@example.com",
    "role": "user",
    "createdAt": "..."
  }
  ```

**PUT /users/profile**

- Body (all optional):

  ```json
  {
    "username": "newName",
    "email": "new-email@example.com"
  }
  ```

- Validations:
  - `username`: string, 3–50 chars
  - `email`: valid email
  - Email uniqueness enforced.

---

### 5.3 Second Collection Management – "Resource" (Recipe)

**Requirement:**

- `POST /resource`
- `GET /resource`
- `GET /resource/:id`
- `PUT /resource/:id`
- `DELETE /resource/:id`

**Implemented:**

- **All endpoints are private and require JWT.**
- Bound to **Recipe** collection.

Routes:

- `POST /resource`
- `GET /resource`
- `GET /resource/:id`
- `PUT /resource/:id`
- `DELETE /resource/:id`

Additional aliases:

- `POST /api/recipes`
- `GET /api/recipes`
- `GET /api/recipes/:id`
- `PUT /api/recipes/:id`
- `DELETE /api/recipes/:id`

**Create recipe – POST /resource**

- Body example:

  ```json
  {
    "title": "Tomato Pasta",
    "description": "Simple and fresh.",
    "ingredients": [
      { "name": "Pasta", "quantity": "200g" },
      { "name": "Tomato", "quantity": "2 pcs" }
    ],
    "steps": ["Boil pasta", "Make sauce", "Mix & serve"],
    "cookingTime": 20,
    "difficulty": "easy",
    "isPublic": true
  }
  ```

- Validations (Joi):
  - `title`: required, 3–100 chars
  - `ingredients`: required, array, at least 1 item (`name` + `quantity`)
  - `steps`: required, array, at least 1 step
  - `cookingTime`: optional, positive integer
  - `difficulty`: `easy | medium | hard`

**Get recipes – GET /resource**

- Returns all recipes **belonging to the logged-in user** (filtered by `author`).

**Get single recipe – GET /resource/:id**

- Returns one recipe by ID.
- Access rules:
  - If recipe `isPublic = true` → visible.
  - If not public → only author or admin can view.

**Update recipe – PUT /resource/:id**

- Same validation as create, but all fields optional.
- Access rules:
  - Only **author** or **admin** can update.
  - Example use case: mark recipe as completed/cooked:

    ```json
    {
      "isCooked": true
    }
    ```

**Delete recipe – DELETE /resource/:id**

- Access rules:
  - Only **author** or **admin** can delete.

---

## 6. Authentication & Security

- **JWT**:
  - Implemented in `controllers/authController.js` with `jsonwebtoken`.
  - Token payload includes `id` and `role`.
  - Used in `authMiddleware.protect` to attach `req.user`.

- **Password hashing**:
  - Implemented with **bcryptjs** during registration.
  - Password is never returned in API responses.

- **Protected routes**:
  - All private endpoints use `protect` middleware.
  - Example: `/users/profile`, `/resource`, `/resource/:id`, etc.

---

## 7. Validation & Global Error Handling

- **Validation**:
  - Implemented with **Joi** schemas inside controllers:
    - `authController`: register & login validation.
    - `userController`: profile update validation.
    - `recipeController`: create & update recipe validation.
  - On validation failure, returns:
    - **HTTP 400** + `{ message: "Validation error", details: [...] }`.

- **Error handling**:
  - `middleware/errorMiddleware.js`:
    - `notFound` → 404 for unknown routes.
    - `errorHandler` → global error handler.
  - Returns environment-aware stack (hidden in production).

---

## 8. Role-Based Access Control (RBAC)

- **Roles**:
  - `User.role` can be `"user"` or `"admin"`.
  - First registered user becomes `"admin"` automatically.
  - Others default to `"user"`.

- **Authorization logic**:
  - In `recipeController`:
    - **Update** and **delete** operations:
      - Allowed for **author** of the recipe.
      - Allowed for **admin** (can manage any recipe).
  - Generic `authorizeRoles(...roles)` helper in `authMiddleware.js` can be used for future admin-only routes (e.g., admin dashboards).

---

## 9. Frontend Pages (Bootstrap, Minimalistic Orange)

The frontend is served from `/public` and uses Bootstrap 5 via CDN + a custom orange theme in `styles.css`.

- **`index.html`**
  - Landing page with orange-accent hero, project summary, and links to login/register.
  - Responsive layout with Bootstrap grid.

- **`register.html`**
  - Registration form (username, email, password).
  - Calls `POST /register` via Fetch in `app.js`.
  - On success, stores JWT token and redirects to dashboard.

- **`login.html`**
  - Login form (email, password).
  - Calls `POST /login`, stores JWT token on success.

- **`dashboard.html`**
  - Private page that requires JWT token in localStorage.
  - On load:
    - Fetches `/users/profile` to show username and role.
    - Fetches `/resource` to list current user's recipes.
  - Includes a small form to create a new recipe, saving via `POST /resource`.
  - Allows marking recipes as cooked (`PUT /resource/:id`) and deleting them (`DELETE /resource/:id`).

All pages share the same **minimalistic orange** look via `public/css/styles.css`.

---

## 10. How to Demonstrate in Defence

Suggested flow for presentation:

1. **Overview**:
   - Show `README.md` and folder structure: `controllers`, `routes`, `models`, `middleware`, `config`, `public`.
2. **Run the app**:
   - Start MongoDB, then run `npm run dev`.
   - Open `http://localhost:5000/` to show the landing page.
3. **Auth demo**:
   - Go to `/register.html`, create the first user (becomes admin).
   - Log out and register a second normal user.
4. **Recipes demo**:
   - Log in as a user, open `/dashboard.html`.
   - Create, list, update (mark as cooked), and delete recipes.
5. **API demo (Postman / curl)**:
   - Call `/register`, `/login`, `/users/profile`, `/resource` endpoints.
   - Show JWT in headers and how protected routes behave without it.
6. **Code explanation**:
   - Show how JWT is created and verified.
   - Show Joi validation and global error handler.
   - Show RBAC logic in `recipeController` and `User` model roles.

This should fully satisfy all the stated project requirements.

