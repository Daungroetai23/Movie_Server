require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoute = require('./Routes/auth')
const RouterMovie = require('./Routes/RouterMovie')
const showtimeRoutes = require('./Routes/showtimeRoutes');
const seatRoutes = require('./routes/seatRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const app = express()

app.use(cors())
app.use(express.json())

// service
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoute)
app.use('/api', RouterMovie)
app.use('/showtimes', showtimeRoutes);
app.use('/seats', seatRoutes);
app.use('/bookings', bookingRoutes);


let port = process.env.PORT || 8000
app.listen(port, ()=> console.log('Server on Port :', port))