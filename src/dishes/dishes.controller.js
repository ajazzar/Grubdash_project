const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
const orders = require("../data/orders-data");

function create(req, res) {
 const { data: { name, description, image_url, price } = {} } = req.body;
  const newdish = {
    id: nextId(),
    name,
    description, 
    image_url,
    price,
  };
  dishes.push(newdish);
  res.status(201).json({ data: newdish});
   }

function hasDish(req, res, next) {
 const { data: { name, description, image_url, price, id } = {} } = req.body;
   const  dishId  = req.params.dishId;
   const foundDish = dishes.find((dish) => dish.id === dishId);
    
   if (name && description && image_url && price && price > 0 && typeof price === "number") {
    return next();
  }
  next({ status: 400, message: `A name, description,  image_url, id, and price are required.` });
}

function list(req, res) {  
   res.json({ data: dishes });
}

function dishExists(req, res, next) {
  const   { dishId }   = req.params;
  const {data: {id} = {} } = req.body;
  
  const foundDish = dishes.find((dish) => dish.id === dishId);
  
 if(foundDish && foundDish !== undefined){
    res.locals.dish = foundDish;
    return next();
 }
  next({
    status: 404,
    message: `Dish id or description not found: ${req.params.dishId}`,
  });
}

function read(req, res) {
  res.json({ data: res.locals.dish })
}

function update(req, res, next) {
  const { dishId }  = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  const dish = res.locals.dish;
  const originalDish = dish.id;
 
  const { data: { id, name, description, image_url, price } = {} } = req.body;
 if(dishId !== id && id){
 next({
    status: 400,
    message: `id: ${id}`,
  });
 }
 
  dish.id = id
  dish.name = name  
  dish.description = description
  dish.image_url = image_url
  dish.price = price
 
  res.json({ data: dish });
}

module.exports = {
  create: [hasDish, create],
  list,
  read: [dishExists, read],
  update: [dishExists, hasDish, update],
  dishExists,
};

