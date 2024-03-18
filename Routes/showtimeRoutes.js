const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

router.get('/', showtimeController.getAllShowtimes);
router.get('/:id', showtimeController.getShowtimeById);
router.post('/', showtimeController.createShowtime);
router.put('/:id', showtimeController.updateShowtimeById);
router.delete('/:id', showtimeController.deleteShowtimeById);


module.exports = router;
