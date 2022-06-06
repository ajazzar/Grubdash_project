const router = require("express").Router();

// TODO: Implement the /dishes routes needed to make the tests pass
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./dishes.controller");
const ordersRouter = require("../orders/orders.router")
router.use("/:urlId/uses", controller.dishExists, ordersRouter);

router.route("/:dishId").get(controller.read).put(controller.update).all(methodNotAllowed);

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
module.exports = router;