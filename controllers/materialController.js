const { Material } = require("../models");

const sanitize = require("../helpers/sanitize");
const response = require("../helpers/response");

exports.addMaterial = async (req, res) => {
  try {
    const body = {
      material: req.body.material
        ? sanitize.escapeHtmlPlus(req.body.material)
        : "",
    };

    for (const key in body) {
      if (body[key] == "") {
        return response.jsonBadRequest(`Field ${key} must be filled`, res, "");
      }
    }

    const dataMaterial = await Material.create({
      material: body.material,
    });

    if (!dataMaterial) {
      return response.jsonError("Failed add Material", res);
    }

    return response.jsonBerhasil(dataMaterial, res, "Success add Material");
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

exports.getMaterial = async (req, res) => {
  try {
    const dataMaterial = await Material.findAll({
      attributes: ["id", "material"],
    });

    if (!dataMaterial || dataMaterial.length < 1) {
      return response.jsonNotFound("Data Material not found", res);
    }

    return response.jsonBerhasil(
      dataMaterial,
      res,
      "Success get data Material"
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

exports.getMaterialById = async (req, res) => {
  try {
    const idMaterial = sanitize.escapeHtmlPlus(req.params.id);

    if (isNaN(idMaterial)) {
      return response.jsonBadRequest("Id must be number", res);
    }

    const dataMaterial = await Material.findOne({
      where: { id: idMaterial },
      attributes: ["id", "material"],
    });

    if (!dataMaterial || dataMaterial.length < 1) {
      return response.jsonNotFound("Data Material not found", res);
    }

    return response.jsonBerhasil(
      dataMaterial,
      res,
      "Success get data Material"
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

exports.updateMaterial = async (req, res) => {
  try {
    const idMaterial = sanitize.escapeHtmlPlus(req.params.id);
    const body = {
      material: req.body.material
        ? sanitize.escapeHtmlPlus(req.body.material)
        : "",
    };

    for (const key in body) {
      if (body[key] == "") {
        return response.jsonBadRequest(`Field ${key} must be filled`, res, "");
      }
    }

    if (isNaN(idMaterial)) {
      return response.jsonBadRequest("Id must be number", res);
    }

    const dataMaterial = await Material.findOne({
      where: { id: idMaterial },
      attributes: ["id", "material"],
    });

    if (!dataMaterial || dataMaterial.length < 1) {
      return response.jsonNotFound("Data Material not found", res);
    }

    const updateMaterial = await Material.update(
      {
        material: body.material || dataMaterial.material,
      },
      { where: { id: idMaterial } }
    );

    if (!updateMaterial) {
      return response.jsonError("Failed update Material", res);
    }

    return response.jsonBerhasil(
      updateMaterial,
      res,
      "Success update Material"
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

exports.deleteMaterial = async (req, res) => {
  try {
    const idMaterial = sanitize.escapeHtmlPlus(req.params.id);

    if (isNaN(idMaterial)) {
      return response.jsonBadRequest("Id must be number", res);
    }

    const dataMaterial = await Material.findOne({
      where: { id: idMaterial },
      attributes: ["id", "material"],
    });

    if (!dataMaterial || dataMaterial.length < 1) {
      return response.jsonNotFound("Data Material not found", res);
    }

    const deleteData = await Material.destroy({
      where: {
        id: idMaterial,
      },
    });

    if (!deleteData) {
      return response.jsonError("Failed delete Material", res);
    }

    return response.jsonBerhasil(deleteData, res, "Success delete Material");
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
