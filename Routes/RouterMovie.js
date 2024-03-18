const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploads')
const { MovieList,MovieRead,MovieCreate,MovieUpdate,MovieRemove } = require('../controllers/MovieController')
const authenticate = require('../middlewares/authenticate')
 
// http://localhost:8000/api/Movie
 router.get('/movie',MovieList) 
 router.get('/movie/:id',MovieRead)
//post = create
 router.post('/movie',authenticate,upload.single('image'),MovieCreate)
 router.put('/movie/:id',authenticate,upload.single('image'),MovieUpdate)
// remove = delete
 router.delete('/movie/:id',authenticate,MovieRemove)

 module.exports = router