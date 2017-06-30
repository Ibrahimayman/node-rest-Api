var express = require('express');

var routes = function (Book) {

    var bookRouter = express.Router();

    bookRouter.route('/')
        .post(function (req, res) {
            var book = new Book(req.body);
            book.save().then((doc) => {
                res.send(doc);
            }, (e) => {
                res.status(400).send(e);
            });
        })
        .get(function (req, res) {
            var query = {};
            if (req.query.genre) {
                query.genre = req.query.genre;
            }
            Book.find(query, function (err, books) {
                if (err)
                    res.status(500).send(err);
                else
                    res.json(books);
            });
        });

    bookRouter.use('/:bookId', function (req, res, next) {
        Book.findById(req.params.bookId, function (err, book) {
            if (err)
                res.status(500).send(err);
            else if (book) { // if book exist.
                req.book = book;
                next();
            }
            else {
                res.status(404).send('no book found');
            }
        });
    });
    bookRouter.route('/:bookId')
        .get(function (req, res) {

            res.json(req.book);

        })
        .put(function (req, res) {
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.book);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id)
                delete req.body._id;

            for (var p in req.body) {
                req.book[p] = req.body[p];
            }

            req.book.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.book);
                }
            });
        })
        .delete(function (req, res) {
            req.book.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });

    bookRouter.route('/:bookId').delete(function (req, res) {
        Book.findByIdAndRemove({_id: req.params.bookId}, function (err, book) {
            if (err)
                res.status(500).send(err);
            else if (book) { // if book exist.
                req.book = book;
            }
            else {
                res.status(404).send('no book found');
            }
        });
    });


    return bookRouter;
};

module.exports = routes;