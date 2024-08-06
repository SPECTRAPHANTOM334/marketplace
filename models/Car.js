const mongoose = require('mongoose')

const CarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide vehicle name'],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Please provide vehicle description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide vehicle price'],
    },
    year: {
      type: Number,
      required: [true, 'Please provide vehicle year'],
    },
    mileage: {
      type: Number,
      required: [true, 'Please provide vehicle mileage'],
    },
    fuel: {
      type: String,
      enum: ['petrol', 'gasoline', 'electric'],
      required: [true, 'Please provide vehicle fuel type (petrol, gasoline or electric)'],
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic',],
      required: [true, 'Please provide vehicle transmission type (manual or automatic)'],
    },
    registeredIn: {
      type: String,
      required: [true, 'Please provide registration location'],
    },
    assembly: {
      type: String,
      enum: ['local', 'imported'],
      required: [true, 'Please provide vehicle assembly (local or imported)'],
    },
    bodyType: {
      type: String,
      enum:['City car', 'Supermini', 'Hatchback', 'MPV', 'Saloon', 'Estate', 'Coupe', 'Crossover', 'SUV', 'Cabriolet'],
      required: [true, 'Please provide vehicle body type (City car, Supermini, Hatchback, MPV, Saloon, Estate, Coupe, Crossover, SUV, Cabriolet )'],
    },
    color: {
      type: String,
      required: [true, 'Please provide vehicle color'],
    },
    engineCapacity: {
      type: Number,
      required: [true, 'Please provide vehicle engine capacity'],
    },
    status: {
      type: String,
      enum: ['available', 'purchased'],
      default: 'available',
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 3600000),
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    features: {
      abs: { type: Boolean, default: false },
      amFmRadio: { type: Boolean, default: false },
      airBags: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: false },
      alloyRims: { type: Boolean, default: false },
      cdPlayer: { type: Boolean, default: false },
      immobilizerKey: { type: Boolean, default: false },
      keylessEntry: { type: Boolean, default: false },
      powerLocks: { type: Boolean, default: false },
      powerMirrors: { type: Boolean, default: false },
      powerSteering: { type: Boolean, default: false },
      powerWindows: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Car', CarSchema)
