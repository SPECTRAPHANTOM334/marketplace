const express = require('express')

const router = express.Router()
const {
  createCar,
  deleteCar,
  getAllCars,
  updateCar,
  getCar,
  getExpiredCars,
  getAllAds
} = require('../controllers/cars')
const authenticateUser = require('../middleware/authentication');

router.route('/').post(authenticateUser, createCar).get(authenticateUser, getAllCars);
router.route('/expired').get(authenticateUser, getExpiredCars);
router.route('/all-ads').get(getAllAds); // Add the new route here
router.route('/:id').get(authenticateUser, getCar).delete(authenticateUser, deleteCar).patch(authenticateUser, updateCar);

module.exports = router
