const express = require('express');
const mongoose = require('mongoose');
const Books = require('../models/books');

const bookRouter = express.Router();

bookRouter.use(express.json());

bookRouter.route('/')
.get((req, res, next) => {
    let filter = {};

    if (req.query.price) {
        const maxPrice = parseFloat(req.query.price);
        if (!isNaN(maxPrice)) {
            filter.price = { $lte: maxPrice };
            console.log(`Filter applied: ${JSON.stringify(filter)}`);
        } else {
            const err = new Error("Invalid price value");
            err.status = 200;
            return next(err);
        }
    }

    Books.find(filter)
        .then(books => {
            res.json(books);
        })
        .catch(error => {
            next(error);
        });
})
.post((req, res, next) => {
    Books.create(req.body)
        .then((book) => {
            console.log('Book Created ', book);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(book);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /books');
})
.delete((req, res, next) => {
    Books.findByIdAndDelete(req.params.bookId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send('Delete Successfully');
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

bookRouter.route('/:bookId')
.get((req, res, next) => {
    Books.findById(req.params.bookId)
        .then((book) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(book);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /books/' + req.params.bookId);
})
.put((req, res, next) => {
    Books.findByIdAndUpdate(req.params.bookId, {
        $set: req.body
    }, { new: true })
        .then((book) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(book);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete((req, res, next) => {
    Books.findByIdAndDelete(req.params.bookId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send('Delete Successfully');
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

bookRouter.route('/:bookId/comments')
.get((req, res, next) => {
    Books.findById(req.params.bookId)
        .then((book) => {
            if (book != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book.comments);
            } else {
                const err = new Error('Book ' + req.params.bookId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post((req, res, next) => {
    Books.findById(req.params.bookId)
        .then((book) => {
            if (book != null) {
                book.comments.push(req.body);
                book.save()
                    .then((book) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(book);
                    }, (err) => next(err));
            } else {
                const err = new Error('Book ' + req.params.bookId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /books/' + req.params.bookId + '/comments');
})
.delete((req, res, next) => {
    Books.findById(req.params.bookId)
        .then((book) => {
            if (book != null) {
                for (let i = (book.comments.length - 1); i >= 0; i--) {
                    book.comments.id(book.comments[i]._id).remove();
                }
                book.save()
                    .then((book) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(book);
                    }, (err) => next(err));
            } else {
                const err = new Error('Book ' + req.params.bookId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

bookRouter.route('/:bookId/comments/:commentId')
.get((req, res, next) => {
    Books.findById(req.params.bookId)
        .then((book) => {
            if (book != null && book.comments.id(req.params.commentId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book.comments.id(req.params.commentId));
            } else if (book == null) {
                const err = new Error('Book ' + req.params.bookId + ' not found');
                err.status = 404;
                return next(err);
            } else {
                const err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /books/' + req.params.bookId + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Books.findById(req.params.bookId)
        .then((book) => {
            if (book != null && book.comments.id(req.params.commentId) != null) {
                if (req.body.rating) {
                    book.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment) {
                    book.comments.id(req.params.commentId).comment = req.body.comment;
                }
                if (req.body.author){
                    book.comments.id(req.params.commentId).author =req.body.author;
                }
                book.save()
                    .then((book) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(book);
                    }, (err) => next(err));
            } else if (book == null) {
                const err = new Error('Book ' + req.params.bookId + ' not found');
                err.status = 404;
                return next(err);
            } else {
                const err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            } 
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete((req, res, next) => {
    Books.findById(req.params.bookId)
        .then((book) => {
            if (book != null && book.comments.id(req.params.commentId) != null) {
                book.comments.id(req.params.commentId).remove();
                book.save()
                    .then((book) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.send('Delete Successfully')
                    }, (err) => next(err));
            } else if (book == null) {
                const err = new Error('Book ' + req.params.bookId + ' not found');
                err.status = 404;
                return next(err);
            } else {
                const err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = bookRouter;