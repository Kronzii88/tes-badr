const { User } = require("../models");

const sanitize = require("../helpers/sanitize");
const response = require("../helpers/response");

exports.addUser = async (req, res) => {
  try {
    const body = {
      username: req.body.username
        ? sanitize.escapeHtmlPlus(req.body.username)
        : "",
    };

    for (const key in body) {
      if (body[key] == "") {
        return response.jsonBadRequest(`Field ${key} must be filled`, res, "");
      }
    }

    const dataUser = await User.create({
      username: body.username,
    });

    if (!dataUser) {
      return response.jsonError("Failed add user", res);
    }

    return response.jsonBerhasil(dataUser, res, "Success add user");
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

exports.getUser = async (req, res) => {
  try {
    const dataUser = await User.findAll({ attributes: ["id", "username"] });

    if (!dataUser || dataUser.length < 1) {
      return response.jsonNotFound("Data user not found", res);
    }

    return response.jsonBerhasil(dataUser, res, "Success get data user");
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

exports.getUserById = async (req, res) => {
  try {
    const idUser = sanitize.escapeHtmlPlus(req.params.id);

    if (isNaN(idUser)) {
      return response.jsonBadRequest("Id must be number", res);
    }

    const dataUser = await User.findOne({
      where: { id: idUser },
      attributes: ["id", "username"],
    });

    if (!dataUser || dataUser.length < 1) {
      return response.jsonNotFound("Data user not found", res);
    }

    return response.jsonBerhasil(dataUser, res, "Success get data user");
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

exports.updateUser = async (req, res) => {
  try {
    const idUser = sanitize.escapeHtmlPlus(req.params.id);
    const body = {
      username: req.body.username
        ? sanitize.escapeHtmlPlus(req.body.username)
        : "",
    };

    for (const key in body) {
      if (body[key] == "") {
        return response.jsonBadRequest(`Field ${key} must be filled`, res, "");
      }
    }

    if (isNaN(idUser)) {
      return response.jsonBadRequest("Id must be number", res);
    }

    const dataUser = await User.findOne({
      where: { id: idUser },
      attributes: ["id", "username"],
    });

    if (!dataUser || dataUser.length < 1) {
      return response.jsonNotFound("Data user not found", res);
    }

    const updateUser = await User.update(
      {
        username: body.username || dataUser.username,
      },
      { where: { id: idUser } }
    );

    if (!updateUser) {
      return response.jsonError("Failed update user", res);
    }

    return response.jsonBerhasil(updateUser, res, "Success update user");
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

exports.deleteUser = async (req, res) => {
  try {
    const idUser = sanitize.escapeHtmlPlus(req.params.id);

    if (isNaN(idUser)) {
      return response.jsonBadRequest("Id must be number", res);
    }

    const dataUser = await User.findOne({
      where: { id: idUser },
      attributes: ["id", "username"],
    });

    if (!dataUser || dataUser.length < 1) {
      return response.jsonNotFound("Data user not found", res);
    }

    const deleteData = await User.destroy({
      where: {
        id: idUser,
      },
    });

    if (!deleteData) {
      return response.jsonError("Failed delete user", res);
    }

    return response.jsonBerhasil(deleteData, res, "Success delete user");
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
