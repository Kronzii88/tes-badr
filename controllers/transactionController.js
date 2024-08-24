const { User, Material, Transaction } = require("../models");

const sanitize = require("../helpers/sanitize");
const response = require("../helpers/response");

const moment = require("moment");
moment.locale("id");

exports.addTransaction = async (req, res) => {
  try {
    const body = {
      vendor: sanitize.escapeHtmlPlus(req.body.vendor) ?? "",
      customer: sanitize.escapeHtmlPlus(req.body.customer) ?? "",
      material: sanitize.escapeHtmlPlus(req.body.material) ?? "",
      transcation_date: moment(req.body.transcation_date).format() ?? "",
    };

    for (const key in body) {
      if (body[key] == "") {
        return response.jsonBadRequest(`Field ${key} must be filled`, res, "");
      }
    }

    if (isNaN(body.vendor) || isNaN(body.customer) || isNaN(body.material)) {
      return response.jsonBadRequest(
        "vendor, customer, material must be number",
        res
      );
    }

    const dataVendor = await User.findOne({ where: { id: body.vendor } });
    if (!dataVendor) {
      return response.jsonNotFound("Vendor not found", res);
    }

    const dataCustomer = await User.findOne({
      where: { id: body.customer },
    });
    if (!dataCustomer) {
      return response.jsonNotFound("Customer not found", res);
    }
    const dataMaterial = await Material.findOne({
      where: { id: body.material },
    });
    if (!dataMaterial) {
      return response.jsonNotFound("Material not found", res);
    }

    const insertTransacation = await Transaction.create({
      vendor: body.vendor,
      customer: body.customer,
      material: body.material,
      transcation_date: body.transcation_date,
    });
    if (!insertTransacation) {
      return response.jsonError("Failed insert transaction", res);
    }

    return response.jsonBerhasil(
      insertTransacation,
      res,
      "Success insert transaction"
    );
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      metadata: {
        status: 500,
        message: "FAILED",
      },
      response: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};

exports.getAllTransaction = async (req, res) => {
  try {
    const dataTransaction = await Transaction.findAll({
      attributes: ["id", "vendor", "customer", "material", "transaction_date"],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
          as: "ven",
        },
        {
          model: User,
          attributes: ["id", "username"],
          as: "cust",
        },
        {
          model: Material,
          attributes: ["id", "material"],
          as: "mat",
        },
      ],
    });

    if (!dataTransaction) {
      return response.jsonNotFound("Data transaction not found", res);
    }

    let dataResponse = [];
    dataTransaction.forEach((val) => {
      dataGet = {
        id: val.id,
        vendor: val.ven.username,
        customer: val.cust.username,
        material: val.mat.material,
        transaction_date: val.transaction_date,
      };
      dataResponse.push(dataGet);
    });
    return response.jsonBerhasil(
      dataResponse,
      res,
      "Success get data transaction"
    );
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      metadata: {
        status: 500,
        message: "FAILED",
      },
      response: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const idTransaction = sanitize.escapeHtmlPlus(req.params.id);

    if (isNaN(idTransaction)) {
      return response.jsonBadRequest("id must be number", res);
    }

    const dataTransaction = await Transaction.findOne({
      attributes: ["id", "vendor", "customer", "material", "transaction_date"],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
          as: "ven",
        },
        {
          model: User,
          attributes: ["id", "username"],
          as: "cust",
        },
        {
          model: Material,
          attributes: ["id", "material"],
          as: "mat",
        },
      ],
      where: { id: idTransaction },
    });

    if (!dataTransaction) {
      return response.jsonNotFound("Data transaction not found", res);
    }

    const dataResponse = {
      id: dataTransaction.id,
      vendor: dataTransaction.ven.username,
      customer: dataTransaction.cust.username,
      transaction_date: dataTransaction.transaction_date,
    };

    return response.jsonBerhasil(dataResponse, res, "Data transaction found");
  } catch (err) {
    res.status(500).json({
      metadata: {
        status: 500,
        message: "FAILED",
      },
      response: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};
exports.editTransaction = async (req, res) => {
  try {
    const idTransaction = sanitize.escapeHtmlPlus(req.params.id);
    const body = {
      vendor: sanitize.escapeHtmlPlus(req.body.vendor) ?? "",
      customer: sanitize.escapeHtmlPlus(req.body.customer) ?? "",
      material: sanitize.escapeHtmlPlus(req.body.material) ?? "",
      transcation_date: moment(req.body.transcation_date).format() ?? "",
    };

    for (const key in body) {
      if (body[key] == "") {
        return response.jsonBadRequest(`Field ${key} must be filled`, res, "");
      }
    }

    if (
      isNaN(idTransaction) ||
      isNaN(body.vendor) ||
      isNaN(body.customer) ||
      isNaN(body.material)
    ) {
      return response.jsonBadRequest(
        "id, vendor, customer, material must be number",
        res
      );
    }

    const dataVendor = await User.findOne({ where: { id: body.vendor } });
    if (!dataVendor) {
      return response.jsonNotFound("Vendor not found", res);
    }

    const dataCustomer = await User.findOne({
      where: { id: body.customer },
    });
    if (!dataCustomer) {
      return response.jsonNotFound("Customer not found", res);
    }
    const dataMaterial = await Material.findOne({
      where: { id: body.material },
    });
    if (!dataMaterial) {
      return response.jsonNotFound("Material not found", res);
    }
    const dataTransaction = await Transaction.findOne({
      where: { id: idTransaction },
    });
    if (!dataTransaction) {
      return response.jsonNotFound("Transaction not found", res);
    }

    const updateTransaction = await Transaction.update(
      {
        vendor: body.vendor || dataTransaction.vendor,
        customer: body.customer || dataTransaction.customer,
        material: body.material || dataTransaction.material,
        transcation_date:
          body.transcation_date || dataTransaction.transcation_date,
      },
      { where: { id: idTransaction } }
    );
    if (!updateTransaction) {
      return response.jsonError("Failed update transaction", res);
    }

    return response.jsonBerhasil(
      updateTransaction,
      res,
      "Success update transaction"
    );
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      metadata: {
        status: 500,
        message: "FAILED",
      },
      response: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const idTransaction = sanitize.escapeHtmlPlus(req.params.id);

    if (isNaN(idTransaction)) {
      return response.jsonBadRequest("id must be number", res);
    }

    const dataTransaction = await Transaction.findOne({
      where: { id: idTransaction },
    });
    if (!dataTransaction) {
      return response.jsonNotFound("Transaction not found", res);
    }

    const deleteTransacation = await Transaction.destroy({
      where: { id: idTransaction },
    });
    if (!deleteTransacation) {
      return response.jsonError("Failed delete transaction", res);
    }

    return response.jsonBerhasil(
      deleteTransacation,
      res,
      "Success delete transaction"
    );
  } catch (err) {
    res.status(500).json({
      metadata: {
        status: 500,
        message: "FAILED",
      },
      response: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};
