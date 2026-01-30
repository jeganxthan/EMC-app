# Quick Start Guide - EMC Application

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

## Setup Steps

1. **Install Dependencies**
   ```bash
   cd /home/jegan/Desktop/personal/emc-app
   npm install
   ```

2. **Configure MongoDB**
   
   Edit `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/emc-app
   JWT_SECRET=your_secure_random_string_here
   ```
   
   **For MongoDB Atlas**: Replace with your connection string
   **For Local MongoDB**: Ensure MongoDB is running (`mongod`)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   
   Open: http://localhost:3000
   
   - Register a new doctor account
   - Login with your credentials
   - Start managing patients!

## Project Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Check code quality

## Default Routes

- `/register` - Doctor registration
- `/login` - Doctor login
- `/dashboard` - Doctor profile
- `/dashboard/patients` - Patient management

## Features

✅ Doctor authentication with JWT
✅ Patient CRUD operations
✅ Secure password hashing
✅ Form validation
✅ Responsive Material-UI design
✅ Protected routes
✅ Real-time notifications

## Troubleshooting

**MongoDB Connection Error**:
- Check if MongoDB is running
- Verify MONGODB_URI in `.env.local`

**Port 3000 in use**:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

---

For detailed documentation, see README.md
