var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000;

const URL_PROD = "https://mercado-pago-demo.herokuapp.com";

var app = express();
var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/success', function (req, res) {
    res.render('success',req.query);
});
app.get('/failure', function (req, res) {
    res.render('failure',req.query);
});
app.get('/pending', function (req, res) {
    res.render('pending',req.query);
});

app.post('/webhook', function (req, res) {
    console.log(req);
    res.sendStatus(200);
});

app.get('/detail', function (req, res) {
    var preference = {
        external_reference: "alexis_grebe_97@hotmail.com.ar",
        items: [
          {
            id: 1234,
            title: req.query.title,
            description: "Dispositivo móvil de Tienda e-commerce",
            picture_url: URL_PROD + req.query.img,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: parseFloat(req.query.price),
          }
        ],
        notification_url: `${URL_PROD}/webhook`,
        back_urls: {
            success : `${URL_PROD}/success`,
            pending : `${URL_PROD}/pending`,
            failure : `${URL_PROD}/failure`,
        },
        auto_return: "approved",
        payer : {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_63274575@testuser.com",
            phone: {
              area_code: "11",
              number: 22223333
            },
            address: {
              street_name: "Falsa",
              street_number: 123,
              zip_code: "1111"
            }
        },
        payment_methods:{
            excluded_payment_methods: [ {
                id : "amex"
            }],
            excluded_payment_types: [ {
                id : "atm"
            }],
            installments: 6
        }
      };
      
    mercadopago.preferences.create(preference)
        .then(function(response){
            // Este valor reemplazará el string "<%= global.id %>" en tu HTML
            global.id = response.body.id;
            var object ={ 
                articulo: req.query,
                id_preference: response.body.id,
                init_point: response.body.init_point,
                sandbox_init_point: response.body.sandbox_init_point 
            };
            res.render('detail', object);
        }).catch(function(error){
            console.log(error);
        });
});


app.get('/mercado-pago', function (req, res) {
   
});



app.listen(port);