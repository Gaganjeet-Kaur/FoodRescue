# FoodRescue – Smart Surplus Food Redistribution Platform

## About the Project
FoodRescue is a MERN stack web application that connects surplus food donors with communities that need food. It helps reduce food waste by making surplus food available for donation and pickup requests.

## Features
- Add surplus food donations.
- View available food donations.
- Search donations by food name, location, and category.
- Submit food pickup requests.
- Store donations and requests in MongoDB.
- Validate donation form inputs.
- Set pickup deadlines.

## Technology Stack
- Frontend: React.js, CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Tools: VS Code, Git, GitHub

## Installation and Setup

### 1. Clone Repository
```bash
git clone https://github.com/Gaganjeet-Kaur/FoodRescue.git
cd FoodRescue
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
```

### 4. Configure Environment Variables
Create a `.env` file inside the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 5. Start Backend
Inside the `server` folder, run:

```bash
npm run dev
```

### 6. Start Frontend
Open another terminal in the project root and run:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/donations | Fetch donations |
| POST | /api/donations | Add donation |
| DELETE | /api/donations/:id | Delete donation |
| GET | /api/requests | Fetch requests |
| POST | /api/requests | Submit food request |

## Future Enhancements
- User authentication and role-based access.
- NGO and donor dashboards.
- Real-time pickup notifications.
- Donation approval and collection tracking.

## Project Goal
Rescue Food. Reduce Waste. Feed Communities.
