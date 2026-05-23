# TravelRush 🗺️

An Airbnb-style travel listing platform where users can browse, create,
and review travel stays. Features interactive maps, cloud image storage,
and full user authentication.

🔗 **Live Demo:** *(https://travelrush.onrender.com/login)*

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Frontend:** EJS, CSS, JavaScript
- **Auth:** Passport.js (local strategy) + connect-mongo sessions
- **Maps:** Mapbox GL JS + Mapbox Geocoding API
- **Media:** Cloudinary + Multer
- **Deployment:** Render

## Features
- Full CRUD for travel listings — create, edit, delete stays
- Interactive Mapbox map showing listing locations
- Cloudinary-powered image uploads
- User authentication with persistent sessions via connect-mongo
- Review and rating system per listing
- Fully responsive layout

## Setup & Installation
```bash
git clone https://github.com/seeratirsh/TravelRush
cd TravelRush
npm install
```

Create a `.env` file with:
```
MONGO_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAPBOX_TOKEN=your_mapbox_token
SESSION_SECRET=your_session_secret
```

```bash
node app.js
```

## What I Learned
- Resolved connect-mongo v6 named export issue on deployment
- Debugged trust proxy and secure cookie config on Render
- Handled Cloudinary v1/v2 dependency conflicts with multer-storage-cloudinary
