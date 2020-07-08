const Thing = require("../models/Things");
const fs = require("fs");

// créer une sauce
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  console.log("req.file ==>", req.body);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
  });
  if (req.file) {
    thing.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ error });
    });
};

// modifier une sauce
exports.modifyThing = (req, res, next) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Thing.updateOne(
    { _id: req.params.id },
    { ...thingObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// supprimer une sauce
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// retrouver une sauce par son ID
exports.getOneThing = function (req, res, next) {
  Thing.findOne({ _id: req.params.id })
    .then((things) => {
      return res.status(200).json(things);
    })
    .catch((error) => res.status(400).json({ error }));
};

// retrouver le tableau de sauces
exports.getThing = function (req, res, next) {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};

// Liker une sauce
exports.likeThing = function (req, res, next) {
  console.log(req.body.like, req.body.usersLiked);
  console.log(req.body.dislike, req.body.usersDisliked);
  let likeInc;
  let usersSet;
  if (req.body.like) {
    likeInc = { likes: req.body.like };
    usersSet = { usersLiked: req.body.usersLiked };
  } else {
    likeInc = { dislikes: req.body.dislike };
    usersSet = { usersDisliked: req.body.usersDisliked };
  }
  Thing.updateOne(
    { _id: req.params.id },
    { $inc: likeInc, $set: usersSet },
    (err, sucess) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ err });
      } else {
        return res.status(200).json(sucess);
      }
    }
  );
};
