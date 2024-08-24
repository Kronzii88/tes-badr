const express = require("express");
const userController = require("./controllers/userController");
const materialController = require("./controllers/materialController");
const transactionController = require("./controllers/transactionController");
const router = express.Router();

/** user route */
router.post("/user", userController.addUser);
router.get("/user", userController.getUser);
router.get("/user/:id", userController.getUserById);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

/** material route */
router.post("/material", materialController.addMaterial);
router.get("/material", materialController.getMaterial);
router.get("/material/:id", materialController.getMaterialById);
router.put("/material/:id", materialController.updateMaterial);
router.delete("/material/:id", materialController.deleteMaterial);

/** transaction route */
router.post("/transaction", transactionController.addTransaction);
router.get("/transaction", transactionController.getAllTransaction);
router.get("/transaction/:id", transactionController.getTransactionById);
router.put("/transaction/:id", transactionController.editTransaction);
router.delete("/transaction/:id", transactionController.deleteTransaction);

/** main */
router.get("/", (req, res) => {
  res.status(200).json({
    metadata: {
      status: 200,
      message: "Api ready to use!",
    },
    response: {
      data: {
        name: "Backend Tes PT EDII ",
      },
    },
  });
});
router.use((req, res) => {
  res.status(404).json({
    metadata: {
      status: 404,
      message: "FAIL",
    },
    response: {
      data: {
        name: "NotFoundError",
        message: "Are you lost?",
      },
    },
  });
});
router.use((err, req, res, next) => {
  res.status(500).json({
    metadata: {
      status: 500,
      message: "ERROR",
    },
    response: {
      data: {
        name: "InternalServerError",
        message: err.message,
        stack: err.stack,
      },
    },
  });
});

module.exports = router;
