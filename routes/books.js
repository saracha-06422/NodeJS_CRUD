let express =require('express');
let router =express.Router();
let dbCon = require('../lib/db');

//display books page
router.get('/',(req, res, next) => {
    dbCon.query('SELECT * FROM books ORDER BY ID asc',(err,rows) => {
        if (err){
            req.flash('error', err);
            res.render('books',{data: ''});
        } else {
            res.render('books', {data: rows});
        }
    })
})

// display add book page
router.get('/add', (req, res ,next) => {
    res.render('books/add', {
        name: '',
        author: ''
    })
})

router.post('/add', (req, res, next)=>{
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if(name.length === 0 || author.length === 0){
        errors = true;
        req.flash('error','Please enter name and author')
        res.render('books/add',{
            name: name,
            author: author
        })
    }

    if (!errors) {
        let from_data ={
            name: name,
            author: author
        }

        dbCon.query('INSERT INTO books SET ?', from_data,(err, result)=>{
            if (err){
                req.flash('error', err);

                res.render('books/add',{
                    name: from_data.name,
                    author: from_data.author
                }) 
            }
            else {
                req.flash('success','Books Successfully added');
                res.redirect('/books');

            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', (req, res, next)=> {
    let id = req.params.id;

    dbCon.query('SELECT * FROM books WHERE id = '+ id, (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/books');
        }
        else {
            res.render('books/edit', {
                title: 'Edit books',
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author
            })
        }
    });
})

router.post('/update/:id', (req, res, next)=> {
    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;
        req.flash('error', 'Please enter name nad author')
        res.render({
            id: id,
            name: name,
            author: author
        })
    }

    if (!errors) {
        let form_data ={
            name: name,
            author: author
        }

        dbCon.query('UPDATE books SET ? WHERE id ='+id, form_data,(err, result)=>{
            if (err) {
                req.flash('error', err);
                res.render('books/edit',  {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                })
            }
            else {
                req.flash('success', 'Books successfully updated');
                res.redirect('/books');
            }
        })
    }

})

router.get('/delete/(:id)',(req, res, next)=> {
    let id = req.params.id;

    dbCon.query('DELETE FROM books WHERE id ='+id, (err, result)=>{
        if (err) {
            req.flash('error', err);
            res.redirect('/books');
        }
        else {
            req.flash('success', 'Book deleteS Successfully ID : '+id);
            res.redirect('books');
        }
    })
})

module.exports = router;