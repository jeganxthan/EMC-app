# EMC (Electronic Medical Care) Application

A complete full-stack Electronic Medical Care web application built with Next.js, TypeScript, MongoDB, and Material-UI.

## 🚀 Features

### Authentication
- Doctor registration and login
- JWT-based authentication with httpOnly cookies
- Secure password hashing using bcrypt
- Protected routes and API endpoints
- Role-based access control (DOCTOR role)

### Doctor Dashboard
- Clean Material-UI layout with responsive AppBar and Drawer
- Doctor profile section displaying personal information
- Secure logout functionality

### Patient Management
- **Add New Patient**: Create patient records with comprehensive details
- **View Patients**: Display all patients in an interactive MUI DataGrid
- **Patient Details**: View complete patient information
- **Edit Patient**: Update existing patient records
- **Delete Patient**: Remove patient records with confirmation
- **Doctor-Patient Linking**: Patients are automatically linked to the logged-in doctor

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Material-UI (MUI) v7**
- **React Hook Form** + **Zod** for form validation
- **Notistack** for notifications
- **Axios** for API calls

### Backend
- **Next.js API Routes**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd emc-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Edit the `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/emc-app
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

   **Important**: 
   - For local MongoDB: Use `mongodb://localhost:27017/emc-app`
   - For MongoDB Atlas: Use your connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/emc-app`)
   - Change `JWT_SECRET` to a strong random string in production

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
emc-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Registration page
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/   # Doctor registration endpoint
│   │   │   │   ├── login/      # Doctor login endpoint
│   │   │   │   └── logout/     # Logout endpoint
│   │   │   └── patients/
│   │   │       ├── route.ts    # GET (all), POST (create)
│   │   │       └── [id]/       # GET, PUT, DELETE (single patient)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   │   ├── page.tsx        # Doctor profile dashboard
│   │   │   └── patients/
│   │   │       ├── page.tsx    # Patients list (DataGrid)
│   │   │       ├── new/        # Add new patient form
│   │   │       └── [id]/
│   │   │           ├── page.tsx    # Patient details
│   │   │           └── edit/       # Edit patient form
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page (redirects to dashboard)
│   ├── components/
│   │   └── ThemeRegistry/      # MUI theme configuration
│   ├── lib/
│   │   ├── db.ts               # MongoDB connection
│   │   └── auth.ts             # JWT utilities
│   ├── models/
│   │   ├── Doctor.ts           # Doctor Mongoose schema
│   │   └── Patient.ts          # Patient Mongoose schema
│   └── middleware.ts           # Route protection middleware
├── .env.local                  # Environment variables
├── package.json
└── README.md
```

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Tokens**: Stored in httpOnly cookies to prevent XSS attacks
- **Protected Routes**: Middleware ensures only authenticated doctors can access dashboard
- **API Security**: All patient endpoints verify doctor authentication
- **Data Isolation**: Doctors can only access their own patients
- **Input Validation**: Zod schemas validate all form inputs and API requests

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new doctor
- `POST /api/auth/login` - Doctor login
- `POST /api/auth/logout` - Logout

### Patients
- `GET /api/patients` - Get all patients for logged-in doctor
- `POST /api/patients` - Create new patient
- `GET /api/patients/[id]` - Get single patient
- `PUT /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient

## 🎨 Database Models

### Doctor Schema
```typescript
{
  name: String (required)
  email: String (required, unique)
  password: String (required, hashed)
  specialization: String (required)
  timestamps: true
}
```

### Patient Schema
```typescript
{
  name: String (required)
  age: Number (required)
  gender: Enum ['Male', 'Female', 'Other'] (required)
  diagnosis: String (required)
  phone: String (required)
  notes: String (optional)
  doctor: ObjectId (ref: Doctor, required)
  timestamps: true
}
```

## 🧪 Usage Guide

1. **Register**: Create a doctor account at `/register`
2. **Login**: Sign in at `/login`
3. **Dashboard**: View your profile information
4. **Add Patient**: Click "Add New Patient" to create a patient record
5. **View Patients**: See all your patients in the interactive table
6. **Manage Patients**: View, edit, or delete patient records
7. **Logout**: Click logout in the sidebar

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check your `MONGODB_URI` in `.env.local`
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📦 Dependencies

### Main Dependencies
- `next`: ^16.1.6
- `react`: ^19.2.3
- `@mui/material`: ^7.3.7
- `@mui/x-data-grid`: Latest
- `mongoose`: ^9.1.5
- `jsonwebtoken`: ^9.0.3
- `bcryptjs`: ^3.0.3
- `react-hook-form`: ^7.71.1
- `zod`: ^4.3.6
- `axios`: ^1.13.4
- `notistack`: ^3.0.2

## 🔄 Future Enhancements

- Appointment scheduling
- Medical records upload
- Prescription management
- Patient search and filtering
- Email notifications
- Multi-language support
- Dark mode toggle
- Export patient data to PDF

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Developer Notes

- All forms use React Hook Form with Zod validation
- Material-UI v7 uses the new `size` prop for Grid components
- Authentication tokens expire after 7 days
- Mongoose models include pre-save hooks for password hashing
- Middleware protects both pages and API routes

---

**Built with ❤️ using Next.js and Material-UI**
# EMC-app
