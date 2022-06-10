const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
const dishes = require("../data/dishes-data");

function hasOrder(req, res, next) {
 const { data: { deliverTo } = {} } = req.body;
 const { data: { mobileNumber } = {} } = req.body; 
 const { data: { dishes } = {} } = req.body; 
 const orders = res.locals.orders;
  
  if (deliverTo && mobileNumber && dishes && dishes.length !== 0 && Array.isArray(dishes)) {
    return next();
  }
  next({ status: 400, message: "A deliverTo, mobileNumber, dishes, and dish quantity are required." });
}

function create(req, res, next) {
 const { data: { deliverTo } = {} } = req.body;
 const { data: { mobileNumber } = {} } = req.body; 
 const { data: { dishes } = {} } = req.body; 
 
 
  const newDish = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    dishes,
  
  };
  for (let quantity in dishes){
    const amount = dishes[quantity]
    
  if(!amount.quantity || amount.quantity === 0 || !Number.isInteger(amount.quantity)){
  return next({
    status: 400,
    message: `quantity = ${quantity}`,
  });
  }}
  orders.push(newDish);
  res.status(201).json({ data: newDish});
  } 


function list(req, res) {
   const dishId = Number(req.params.id);
   const byNote = dishId ? (order) => order.id === dishId : () => true;
  res.json({ data: orders.filter(byNote) });
};
function destroy(req, res, next) {
  const { orderId } = req.params;
  const order = res.locals.order;
  const index = orders.findIndex((order) => order.id=== orderId);
  // `splice()` returns an array of the deleted elements, even if it is one element
  
if(order.status !== "pending"){
    next({
    status: 400,
    message: "not pending",
  });  
}else{
  orders.splice(index, 1);
  res.sendStatus(204);
}
}
  
function orderExists(req, res, next) {
  const   { orderId }   = req.params;
  const { data: { dishes } = {} } = req.body;
  const foundOrder = orders.find((order) => order.id === orderId);
 
 if(foundOrder && foundOrder !== undefined){
    res.locals.order = foundOrder;
    return next();
 }
  next({
    status: 404,
    message: `Dish id or description not found: ${req.params.orderId} and ${orderId}`,
  });
}

function read(req, res, next) {
  res.json({ data: res.locals.order });
};

function update(req, res, next) {
  const { orderId }  = req.params;
 
  const foundOrder = orders.find((order) => order.id === orderId);
  const order = res.locals.order;
  const originalOrder = order.dishes;
  
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body;
for(let value in dishes){
    const amount = dishes[value]
    if(amount.quantity === 0 || !Number.isInteger(amount.quantity) || !amount.quantity || !status || status === "invalid"){ 
   res.status(400).json({ error: "quantity: 0, 1, 2 or status" });
    
   }
}
  if(id !== "" && id !== null && id !== undefined && id !== orderId){
 return next({
    status: 400,
    message: `id: ${id}`,
  });
 }

  else{
  order.deliverTo = deliverTo  
  order.mobileNumber = mobileNumber
  order.status = status
  order.dishes = dishes
  
  res.json({ data: order });
  }
}

module.exports = {
  create: [hasOrder, create],
  delete: [orderExists, destroy],
  list,
  read: [orderExists, read],
  update: [orderExists, hasOrder, update],
};

