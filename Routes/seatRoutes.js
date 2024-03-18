// routes/seatRoutes.js
const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// GET /seats - ดึงข้อมูลที่นั่งทั้งหมด
router.get('/', seatController.getAllSeats);

// GET /seats/:id - ดึงข้อมูลที่นั่งตาม ID
router.get('/showtime/:id', seatController.getSeatsByShowtimeTimeId); // เปลี่ยนชื่อเส้นทางและพารามิเตอร์เป็น showtime/:id

// POST /seats - เพิ่มที่นั่งใหม่
router.post('/', seatController.addSeat);

// PUT /seats/:id - แก้ไขข้อมูลที่นั่งตาม ID
router.put('/:id', seatController.updateSeat);

// DELETE /seats/:id - ลบที่นั่งตาม ID
router.delete('/:id', seatController.deleteSeat);

module.exports = router;
