const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany();
        res.json(bookings);
    } catch (error) {
        console.error('Could not retrieve bookings:', error);
        res.status(500).json({ error: 'Could not retrieve bookings' });
    }
};

const getBookingById = async (req, res) => {
    const { id  } = req.params;
    try {
        const booking = await prisma.booking.findMany({
            where: { userId : parseInt(id)},
            include: {
                user: true,
                movie: true,
                showtimeTime: {
                    include: {
                        showtime: true
                    }
                },
                seat: true
            },
        });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        console.error('Could not retrieve booking:', error);
        res.status(500).json({ error: 'Could not retrieve booking' });
    }
};

const createBooking = async (req, res) => {
    const { selectedSeatIds, totalPrice, userId, movieId, showtimeId } = req.body;

    // ตรวจสอบความถูกต้องของข้อมูลที่รับมา
    if (!selectedSeatIds || !selectedSeatIds.length || !totalPrice || !userId || !movieId || !showtimeId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const createdBookings = await Promise.all(selectedSeatIds.map(async id => {
            // สร้างการจอง
            const createdBooking = await prisma.booking.create({
                data: {
                    quantity: 1,
                    price: parseFloat(totalPrice),
                    status: "BOOKED",
                    showtimeTime:{
                        connect: {
                            id: parseInt(showtimeId)
                        }
                    },
                    user: { connect: { id: parseInt(userId) } },
                    movie: { connect: { id: parseInt(movieId) } },
                    seat: { connect: { id: parseInt(id) } }
                }
            });
            return createdBooking;
        }));

        // Create payment for each booking
        const createdPayments = await Promise.all(createdBookings.map(async booking => {
            const createdPayment = await prisma.payment.create({
                data: {
                    amount: parseFloat(totalPrice),
                    booking: { connect: { id: booking.id } }
                }
            });
            return createdPayment;
        }));

        // ส่งการจองที่สร้างกลับไป
        res.status(201).json(createdBookings);
    } catch (error) {
        console.error('Could not create booking:', error);
        res.status(500).json({ error: 'Could not create booking' });
    }
};
const updateBooking = async (req, res) => {
    const { id } = req.params;
    const updatedBooking = req.body;
    try {
        const existingBooking = await prisma.booking.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        const updated = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: updatedBooking
        });
        res.json(updated);
    } catch (error) {
        console.error('Could not update booking:', error);
        res.status(500).json({ error: 'Could not update booking' });
    }
};

const deleteBooking = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBooking = await prisma.booking.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        console.error('Could not delete booking:', error);
        res.status(500).json({ error: 'Could not delete booking' });
    }
};

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
};
