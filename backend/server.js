
const express = require("express");
const path = require("path");
var passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const secret = "aaaaaa";
const withAuth = require('./middleware');

/**
 * App Variables
 */

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
}))

const port = process.env.PORT || "8000";

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost/pjdb';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var Users = require('./models/client');
var Client = require('./models/client.js');
var Commande = require('./models/commande.js');
var Article = require('./models/article')
var Depot = require('./models/depot')



app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get('/showclients', function (req, res) {

  res.set('Access-Control-Allow-Origin', '*');
  Client.find({}, (err, clients) =>
    res.send(clients.reduce((clientMap, item) => {
      clientMap[item.id] = item
      return clientMap
    }, {})
    )
  );
}
);

app.post('/register', function (req, res) {

  Client.findOne({ NomClient: req.body.username }, function (erre, resu) {
    if (!resu) {
      Client.create({
        NomClient: req.body.username,
        Password: req.body.password,
        Taux_Remise: '0'
      }, function (erreu, resul) {
        if (erreu) {        console.log(erreu)
        }
        else {
          console.log("saved")
          res.send('ok')
        }
      })
    }
    else if (resu) {
      console.log("client existe deja !!")
      res.status(501).send("alreadyexists")
    }
  })
});

app.post('/login', function (req, res) {
  const { username, password } = req.body;
  console.log(username)
  Users.findOne({ 'NomClient': username }, function (err, user) {
    if (err) {
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect username or password'
        });
    } else {
      bcrypt.compare(password, user.Password, function (err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
            });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect username or password'
            });
        } else {
          const payload = { ClientName: username };
          const token = jwt.sign(payload, secret, {
            expiresIn: '5h' //This time is just for developping phase.
          });
          res.json({
            success: true,
            message: 'Authentication successful!',
            username: username,
            token: token
          });
        };
      });
    }
  });
});


app.post('/passer-commande', function (req, res) { 
    
    const _total = req.body.total
    const article2 = req.body.commandes
  
    var token = req.body.current_token.token || req.query.token;
      if (!token) {return res.status(401).json({ message: 'Must pass token' });}
  
      jwt.verify(token, secret, function (err, user) {
          if (err) throw err;
  
          article2.sort(function(a, b) { //trier les commandes par depotId
            var id1 = a.depotId.toUpperCase(); // ignore upper and lowercase
            var id2 = b.depotId.toUpperCase(); // ignore upper and lowercase
            if (id1 < id2) {
              return -1;
            }
            if (id1 > id2) {
              return 1;
            }        
            return 0;
          });
         
          const groupBy = key => array =>  //group la commande par depot id
           array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
           objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
           return objectsByKeyValue;
             }, {});
           
  
          const groupByBrand = groupBy('depotId')     
          const carsByBrand = groupByBrand(article2)
  
             for(const truc in carsByBrand){  
        
              const depot_array = carsByBrand[truc] //c'est le depot correspondant au commande fait par l'utilisateur
              console.log('un truc: ',depot_array.length) 
              
              Depot.findOne({_id:truc}, function(err, depot_found){
                  if(err) return handleError(err);
  
                  if(!depot_found){
                    console.log('depot not found')
                    res.status(401).json({ message: 'depot not found' });
                    
                  }else{
                    for(let i=0; i<depot_found.articleStock.length; i++){
                        depot_array.forEach(article_commande =>{
                          if(article_commande.id== depot_found.articleStock[i].articleId)
                            depot_found.articleStock[i].qty -= article_commande.qty;
  
                        })
                    }
                    depot_found.save()
                  } 
              })           
          }  
  
          Users.findOne({ 'NomClient': user.ClientName}, function (err, client_found) {
            if (err) return handleError(err);
            let shortDate = new Date();
            shortDate = shortDate.toLocaleDateString("en-US")
            console.log(shortDate)
            var newCommande = new Commande({                 
                datecommande: shortDate,
                client: new mongoose.Types.ObjectId(client_found._id),
                articles: article2,
                total: _total
            });
            
            newCommande.save((err) => { if (err) return handleError(err); });
            client_found.commande.push(newCommande.id)
            client_found.save(((err) => { if (err) return handleError(err); }));     
           });         
          res.json({res:'Panier reçu par le backend'})
          res.end()
      })   
  });
  


app.post('/commande-list', function (req, res) {
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(401).json({ message: 'Must pass token' });
  }

  jwt.verify(token, secret, function (err, user) {
    if (err) throw err;

    Users.findOne({ 'NomClient': user.ClientName }
    ).populate('commande').exec(function (err, client) {
      if (err) return handleError(err);
      res.json(client.commande)
      res.end()
    });
  })
})

app.post("/addDepot", function (req, res) {
  var token = req.body.token;
  if (!token) { return res.status(401).json({ message: 'Must pass token' }); }
  jwt.verify(token, secret, function (err, user) {
    if (err) throw err;
    else {
      Depot.findOne({ name: req.body.nom }, function (erre, resu) {
        if (resu) {
          console.log('the depot is already in the database. Permission denied')
          res.status(401)
            .json({
              error: 'The depot already exists in the database. Please choose another name instead'
            });
          res.end()
        }
        else {
          Depot.create({ name: req.body.nom }, function (erreu, resul) {
            if (erreu) throw erreu;
            else {
              console.log(resul)
              res.json({res:'ok'})
            }
          })
        }
      })

    }

  })
})

app.post("/addItem", function (req, res) {

  const { nom: req_nom, prix: req_prix, qty: req_qty, dep_selected } = req.body
  console.log('request body:', req.body)
  var token = req.body.token || req.query.token;
  if (!token) { return res.status(401).json({ message: 'Must pass token' }); }

  jwt.verify(token, secret, function (err, user) {
    if (err) throw err;

    Article.findOne({ 'nom': req_nom }, function (err, article_found) {
      if (err) return handleError(err)

      if (!article_found) {
        console.log('there is not article with that name, you can create a new one')



        Depot.findOne({ 'name': dep_selected }, function (err, depot_found) {
          if (err) return handleError(err)
          if (!depot_found) {
            res.status(401).json({ error: 'depo not found!' });
            console.log('depo not found!', depot_found)
          } else {
            var newArticle = new Article({ prixHT: req_prix, nom: req_nom })
            newArticle.depot = new mongoose.Types.ObjectId(depot_found.id)
            newArticle.save((err) => { if (err) return handleError(err); });
            depot_found.articleStock.push({ articleId: new mongoose.Types.ObjectId(newArticle.id), qty: req_qty })
            depot_found.save()
            console.log('depo found and updated!', depot_found)
            res.json({ "res": "ok" })
            res.end()
          }
        })

      } else {
        console.log('the article is already in the database. Permission denied')
        res.status(401)
          .json({
            error: 'The article already exists in the database. Please edit it instead'
          });
        res.end()
      }
    })
  })
})

app.get('/articles', function (req, res) {

  Article.find({}, function (err, articles_found) {
    if (err) return handleError(err)

    if (!articles_found || articles_found.length === 0) {
      console.error('articles NOT found!')
      res.status(401).json({ error: 'articles NOT found!' })
      res.end()
    } else {
      console.log('articles found!', articles_found)
      res.json(articles_found)
    }
  })
})

app.get('/articles/:depo_id', function (req, res) {

  const depo_id = req.params.depo_id
  Article.find({ depot: depo_id }, function (err, article_set) {
    if (err) return handleError(err)

    if (!article_set) {
      console.error('Set of articles not found')
      res.status(401).json({ error: 'Set of articles not found!' })
    } else {
      //console.log('Set of articles sent to front', article_set)
      res.json(article_set)
    }
  })

})



app.get('/depots-names', function (req, res) {

  Depot.find({}, function (err, depo_array) {
    if (err) return handleError(err);

    if (!depo_array) {
      console.error('No depots found!')
      res.status(401).json({ error: 'No depots found!' });

    } else {
      const depo_names = depo_array.map(element => element.name)
      res.json(depo_names)
      res.end()
    }
  })
})


app.get('/depots', function (req, res) {

  Depot.find({}, function (err, depo_array) {
    if (err) return handleError(err);

    if (!depo_array) {
      console.error('No depots found!')
      res.status(401).json({ error: 'No depots found!' });

    } else {
      console.log('Depots sent to frontend: ', depo_array)
      res.json(depo_array)
      res.end()
    }
  })

})




app.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
});

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

