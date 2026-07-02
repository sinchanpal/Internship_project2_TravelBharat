import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { getAllStates, getCitiesByStateId, getCityAndPlaces, getStateAndCities } from '../controllers/exploreController.js';

const exploreRouter = express.Router();

exploreRouter.get('/get-all-states', isAuth, getAllStates);
exploreRouter.get('/state/:slug', isAuth, getStateAndCities);
exploreRouter.get('/cities-by-state/:stateId', isAuth, getCitiesByStateId);
exploreRouter.get('/places-by-city/:cityId', isAuth, getCityAndPlaces);

export default exploreRouter;