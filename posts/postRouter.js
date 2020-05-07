const express = require("express");

const router = express.Router();
const db = require("./postDb");
const userdb = require("../users/userDb")

router.get('/', (req, res) => {
  db.get()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "error connecting to database" });
    });
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', (req, res) => {
  db.remove(Number(req.params.id))
  .then(result => {
    if (result === 1) {
      res.status(204).send()
    } else {
      res.status(500).json({ error: "error deleting post" })
    }
  })
  .catch((err) => {
    res.status(500).json({ error: "error connecting to database" });
  });
});

router.put('/:id', validatePostId, (req, res) => {
  db.update(Number(req.params.id), req.body)
  .then(result => {
    if (result === 1) {
      res.status(204).send()
    } else {
      res.status(500).json({ error: "error updating record" })
    }
  })
  .catch((err) => {
    res.status(500).json({ error: "error connecting to database" });
  });
});

// custom middleware

function validatePostId(req, res, next) {
  db.getById(req.id)
  .then((result) => {
    if (result) {
      req.post = result;
      next();
    } else {
      res.status(400).json({ message: "invalid post id" });
    }
  })
  .catch((err) => {
    res.status(500).json({ error: "error connecting to database" });
  });
}

module.exports = router;