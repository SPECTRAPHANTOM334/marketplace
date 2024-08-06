const Car = require('../models/Car')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors')



const getAllCars = async (req, res) => {
  const { status, name, price, year, mileage, fuel, transmission, registeredIn, assembly, bodyType, color, engineCapacity, sort, limit, page } = req.query

  const queryObject = { createdBy: req.user.userId, expiryDate: { $gt: new Date() } }; 

  if (status) {
    queryObject.status = status
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }

  if (price) {
    queryObject.price = { $lte: Number(price) }
  }

  if (year) {
    queryObject.year = { $lte: Number(year) }
  }

  if (mileage) {
    queryObject.mileage = { $lte: Number(mileage) }
  }

  if (fuel) {
    queryObject.fuel = fuel
  }

  if (transmission) {
    queryObject.transmission = transmission
  }

  if (registeredIn) {
    queryObject.registeredIn = registeredIn
  }

  if (assembly) {
    queryObject.assembly = assembly
  }

  if (bodyType) {
    queryObject.bodyType = bodyType
  }

  if (color) {
    queryObject.color = color
  }

  if (engineCapacity) {
    queryObject.engineCapacity = { $lte: Number(engineCapacity) }
  }

  let result = Car.find(queryObject)

  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('-createdAt')
  }

  const pageNumber = Number(page) || 1
  const limitNumber = Number(limit) || 3
  const skip = (pageNumber - 1) * limitNumber

  result = result.skip(skip).limit(limitNumber)

  const cars = await result
  const totalCars = await Car.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalCars / limitNumber)
  res.status(StatusCodes.OK).json({ cars, count: cars.length, numOfPages })
}

const getExpiredCars = async (req, res) => {
  const queryObject = { createdBy: req.user.userId, expiryDate: { $lte: new Date() } };

  let result = Car.find(queryObject);

  const cars = await result;
  const totalCars = await Car.countDocuments(queryObject);

  res.status(StatusCodes.OK).json({ cars, count: cars.length });
};

const getAllAds = async (req, res) => {
  const { status, name, price, year, mileage, fuel, transmission, registeredIn, assembly, bodyType, color, engineCapacity, sort, limit, page } = req.query

  const queryObject = {}; // Fetch all ads regardless of expiry

  if (status) {
    queryObject.status = status
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }

  if (price) {
    queryObject.price = { $lte: Number(price) }
  }

  if (year) {
    queryObject.year = { $lte: Number(year) }
  }

  if (mileage) {
    queryObject.mileage = { $lte: Number(mileage) }
  }

  if (fuel) {
    queryObject.fuel = fuel
  }

  if (transmission) {
    queryObject.transmission = transmission
  }

  if (registeredIn) {
    queryObject.registeredIn = registeredIn
  }

  if (assembly) {
    queryObject.assembly = assembly
  }

  if (bodyType) {
    queryObject.bodyType = bodyType
  }

  if (color) {
    queryObject.color = color
  }

  if (engineCapacity) {
    queryObject.engineCapacity = { $lte: Number(engineCapacity) }
  }

  let result = Car.find(queryObject)

  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('-createdAt')
  }

  const pageNumber = Number(page) || 1
  const limitNumber = Number(limit) || 3
  const skip = (pageNumber - 1) * limitNumber

  result = result.skip(skip).limit(limitNumber)

  const cars = await result
  const totalCars = await Car.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalCars / limitNumber)
  res.status(StatusCodes.OK).json({ cars, count: cars.length, numOfPages })
}


const getCar = async (req, res) => {
  const {
    user: { userId },
    params: { id: carId },
  } = req

  const car = await Car.findOne({
    _id: carId,
    createdBy: userId,
  })
  if (!car) {
    throw new NotFoundError(`No ads with id ${carId}`)
  }
  res.status(StatusCodes.OK).json({ car })
}


const createCar = async (req, res) => {
  req.body.createdBy = req.user.userId;
  req.body.expiryDate = new Date(Date.now() + 3600000); 
  const car = await Car.create(req.body);
  res.status(StatusCodes.CREATED).json({ car });
};


const updateCar = async (req, res) => {
  const {
    body: { name, description, price, year, mileage, fuel, transmission, registeredIn, assembly, bodyType, color, engineCapacity },
    user: { userId },
    params: { id: carId },
  } = req

  if (
    name === '' ||
    description === '' ||
    price === '' ||
    year === '' ||
    mileage === '' ||
    fuel === '' ||
    transmission === '' ||
    registeredIn === '' ||
    assembly === '' ||
    bodyType === '' ||
    color === '' ||
    engineCapacity === ''
  ) {
    throw new BadRequestError('All fields must be filled out')
  }

  const car = await Car.findByIdAndUpdate(
    { _id: carId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!car) {
    throw new NotFoundError(`No ads with id ${carId}`)
  }

  res.status(StatusCodes.OK).json({ car })
}

const deleteCar = async (req, res) => {
  const {
    user: { userId },
    params: { id: carId },
  } = req;

  const car = await Car.findOne({ _id: carId, createdBy: userId })
  if (!car) {
    throw new NotFoundError(`No ads with id ${carId}`)
  }

  const oneHourInMilliseconds = 3600000
  const currentTime = Date.now()
  const carCreatedTime = new Date(car.createdAt).getTime()
  const timeElapsed = currentTime - carCreatedTime

  if (timeElapsed < oneHourInMilliseconds) {
    throw new UnauthenticatedError('You can only delete your ad one hour after posting it')
  }

  await Car.findByIdAndRemove(carId)
  res.status(StatusCodes.OK).send()
}



module.exports = {
  createCar,
  deleteCar,
  getAllCars,
  updateCar,
  getCar,
  getExpiredCars,
  getAllAds,
}
