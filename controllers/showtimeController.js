const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await prisma.showtime.findMany();
    res.json(showtimes);
  } catch (error) {
    console.error('Error fetching showtimes: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get showtime by ID
const getShowtimeById = async (req, res) => {
  const { id } = req.params;
  try {
    const showtime = await prisma.showtime.findUnique({
      where: { id: parseInt(id) },
      include: { 
        movie: true,
        showtimeTimes: true,
      }
    });
    if (!showtime) { 
      return res.status(404).json({ error: 'Showtime not found' }); 
    }
    
    res.json(showtime);
  } catch (error) {
    console.error('Error fetching showtime: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const createShowtime = async (req, res) => {
    const { date, time, cinema, price, movieId } = req.body;
    try {
      const newShowtime = await prisma.showtime.create({
        data: {
          date,
          time,
          cinema,
          price,
          movieId: parseInt(movieId)
        }
      });
      res.status(201).json(newShowtime);
    } catch (error) {
      console.error('Error creating showtime: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Update showtime by ID
  const updateShowtimeById = async (req, res) => {
    const { id } = req.params;
    const { date, time, cinema, price, movieId } = req.body;
    try {
      const updatedShowtime = await prisma.showtime.update({
        where: { id: parseInt(id) },
        data: {
          date,
          time,
          cinema,
          price,
          movieId: parseInt(movieId)
        }
      });
      res.json(updatedShowtime);
    } catch (error) {
      console.error('Error updating showtime: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Delete showtime by ID
  const deleteShowtimeById = async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.showtime.delete({
        where: { id: parseInt(id) }
      });
      res.json({ message: 'Showtime deleted successfully' });
    } catch (error) {
      console.error('Error deleting showtime: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = {
    getAllShowtimes,
    getShowtimeById,
    createShowtime,
    updateShowtimeById,
    deleteShowtimeById
  };