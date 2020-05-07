const express = require('express');
const db = require('./userDb')
const postdb = require('../posts/postDb')
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  db.insert(req.body)
  .then(result => {
    res.status(201).send()
  })
  .catch(err => {
    res.status(500).json({ err: 'Error connecting to the database' })
  })
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
  const post = req.body
  post.userId = Number(req.params.id)
  postdb.insert(post)
  .then(result => {
    res.status(201).send()
  })
  .catch((err) => {
    res.status(500).json({error: 'Error connecting to the database'})
  });

});

router.get('/', (req, res) => {
  // do your magic!
  db.get()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({ err: 'Error connecting to the database' })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  db.getUserPosts(Number(req.params.id))
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    res.status(500).json({ err: 'Error connecting to the database' })
});
});

router.delete('/:id', (req, res) => {
  // do your magic!
  db.remove(Number(req.params.id))
  .then(result => {
    if (result === 1) {
      res.status(204).send()
    } else {
      res.status(500).json({ error: "error deleting record" })
    }
  })
  .catch((err) => {
    res.status(500).json({ error: "error connecting to database" });
  });
});

router.put('/:id', (req, res) => {
  // do your magic!
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

//custom middleware

function validateUserId(req, res, next) {
  db.getById(Number(req.params.id))
    .then((result) => {
      if (result) {
        req.user = result;
        next();
      } else {
        res.status(400).json({ message: "Invalid user id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Error connecting to database" });
    });
}


function validateUser(req, res, next) {
  // do your magic!
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: "missing user data" })
    }
    if (!req.body.name) {
      return res.status(400).json({ message: "missing required name field" })
    }
    next();
}

function validatePost(req, res, next) {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: "missing post data" })
    }
    if (!req.body.text) {
      return res.status(400).json({ message: "missing required text field" })
    }
    next();
}


module.exports = router;
