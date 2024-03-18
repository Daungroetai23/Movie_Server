const prisma = require('../models/db');
const sharp = require('sharp');
const fs = require('fs');
exports.MovieList = async (req, res, next) =>{
    try {
        const movies = await prisma.movie.findMany();
        res.status(200).json(movies);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.MovieRead = async (req, res, next) =>{
    try {
        const { id: movieId } = req.params;
        const movies = await prisma.movie.findUnique({
            where: {
                id: parseInt(movieId),
            }
        })
        res.status(200).json(movies);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.MovieCreate = async (req, res, next) =>{
    try {
        const { name, genre, viewer_rate, actors, director,time,detail } = req.body;
        const image =  req.file.filename ; 
        const movie = await prisma.movie.create({
            data: {
                name:name,
                genre:genre,
                viewer_rate:viewer_rate,
                actors:actors,
                director:director,
                time:parseInt(time),
                detail:detail,
                Img:image
            },
        });
        res.status(201).json(movie);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.MovieUpdate = async (req, res, next) =>{
    try {
        const { id } = req.params;
        const { name, genre, viewer_rate, actors, director } = req.body;
        const updatedMovie = await prisma.movie.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                genre,
                viewer_rate,
                actors,
                director,
            },
        });
        res.json(updatedMovie);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.MovieRemove = async (req, res, next) =>{
    try {
        const { id } = req.params;
        await prisma.movie.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(204).send(); // No Content
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
