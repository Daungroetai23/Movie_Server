// controllers/seatController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /seats - ดึงข้อมูลที่นั่งทั้งหมด
const getAllSeats = async (req, res) => {
    try {
        const seats = await prisma.seat.findMany();
        res.json(seats);
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve seats' });
    }
};

// GET /seats/:id - ดึงข้อมูลที่นั่งตาม ID
const getSeatById = async (req, res) => {
    const { id } = req.params;
    try {
        const seats = await prisma.seat.findMany({
            where: {
              showtime: {
                id: parseInt(id)
              }
            },
            include: {
              showtime: {
                select: {
                  showtimeTime: true
                }
              }
            }
          });
          
          // แสดงผลที่นั่งและสถานะของแต่ละที่นั่ง
          seats.forEach(seat => {
            console.log(`Seat ${seat.seatNumber} - ${seat.isBooked ? 'Booked' : 'Available'}`);
          });          
        if (!seats) {
            return res.status(404).json({ message: 'Seats not found' });
        }
        return res.json(seats);
    } catch (error) {
        return res.status(500).json({ error: 'Could not retrieve seats' });
    }
};

const getSeatsByShowtimeTimeId = async (req, res) => {
    const { id } = req.params;
    try {
        const seats = await prisma.seat.findMany({
            where: {
                showtime: {
                    showtimeTimes: {
                        some: {
                            id: parseInt(id)
                        }
                    }
                }
            },
            include: {
                showtime: {
                    include: {
                        movie: true,
                        showtimeTimes: true
                    }
                },
                Booking: {
                    where: {
                        showtimeTimeId: parseInt(id)
                    }
                }
            }
        });

        // สร้างอาร์เรย์ของที่นั่งพร้อมกับสถานะการจอง
        const seatsWithStatus = seats.map(seat => ({
            id: seat.id,
            seatNumber: seat.seatNumber,
            price: seat.price,
            status: seat.Booking.length > 0 ? 'BOOKED' : 'AVAILABLE',
            movieId: seat.showtime.movie.id,
            movieDate: seat.showtime.date,
            showtimeId: seat.showtime.id,
            showtimeTimesId: seat.showtime.showtimeTimes.find(time => time.id === parseInt(id)) ? parseInt(id) : null,
            time: seat.showtime.showtimeTimes.find(time => time.id === parseInt(id)) ? seat.showtime.showtimeTimes.find(time => time.id === parseInt(id)).time : null
        }));
        return res.json(seatsWithStatus);
    } catch (error) {
        console.error('Error fetching seats by showtime time id:', error);
        return res.status(500).json({ error: 'Could not retrieve seats' });
    }
};
// POST /seats - เพิ่มที่นั่งใหม่
const addSeat = async (req, res) => {
    const newSeat = req.body;
    try {
        const createdSeat = await prisma.seat.create({
            data: newSeat
        });
        res.status(201).json(createdSeat);
    } catch (error) {
        res.status(500).json({ error: 'Could not add seat' });
    }
};

// PUT /seats/:id - แก้ไขข้อมูลที่นั่งตาม ID
const updateSeat = async (req, res) => {
    const { id } = req.params;
    const updatedSeat = req.body;
    try {
        const existingSeat = await prisma.seat.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingSeat) {
            return res.status(404).json({ message: 'Seat not found' });
        }
        const updated = await prisma.seat.update({
            where: { id: parseInt(id) },
            data: updatedSeat
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Could not update seat' });
    }
};

// DELETE /seats/:id - ลบที่นั่งตาม ID
const deleteSeat = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSeat = await prisma.seat.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Seat deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete seat' });
    }
};

module.exports = {
    getAllSeats,
    getSeatById,
    addSeat,
    updateSeat,
    deleteSeat,
    getSeatsByShowtimeTimeId
};
