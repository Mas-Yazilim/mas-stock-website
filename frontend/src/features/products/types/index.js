// Product types for JavaScript usage

/**
 * @typedef {Object} ProductAccessory
 * @property {string} name
 * @property {string} [description]
 * @property {number} price
 * @property {boolean} available
 */

/**
 * @typedef {Object} ProductColor
 * @property {string} name
 * @property {string} hex
 * @property {boolean} available
 */

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {string} brand
 * @property {string} model
 * @property {string} storage
 * @property {string} category
 * @property {ProductColor[]} colors
 * @property {ProductAccessory[]} [accessories]
 * @property {number} cashPrice
 * @property {number} visaPrice
 * @property {boolean} isActive
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {Product[]} products
 */

// Default objects for initialization
export const createProductAccessory = () => ({
  name: '',
  description: '',
  price: 0,
  available: true
})

export const createProductColor = () => ({
  name: '',
  hex: '#000000',
  available: true
})

export const createProduct = () => ({
  _id: '',
  name: '',
  brand: '',
  model: '',
  storage: '',
  category: '',
  colors: [],
  accessories: [],
  cashPrice: 0,
  visaPrice: 0,
  isActive: true,
  createdAt: '',
  updatedAt: ''
})

export const createCategory = () => ({
  id: '',
  name: '',
  products: []
})