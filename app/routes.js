var path = require('path');
var Histories = require('./models/history');
// var MoneyType = require('../config/constants');

function getHistory(res){
  Histories.find(function(err, money){
    if(err){
      res.send(err);
    }
    res.json(money);
  })
}

function getMoneySpecific(res, config){
  var nbTotal = 0;
  Histories.count(function(arr, money){
    nbTotal = money;
  });
  Histories.find(function(err, money){
    // console.log("money", money);
    if(err){
      res.send(err);
    }
    var send = {
      data: money,
      nbTotal : nbTotal
    }
    res.json(send);
  }).skip(config.from).limit(config.limit);
}

// Money.find().limit(5).skip(5);

module.exports = function (app) {

    // GET ALL
    app.get('/api/money', function (req, res) {
        getMoney(res);
    });

    // POST GET WITH QUERY PARAMS
    app.post('/api/money', function (req, res) {

      getMoneySpecific(res, req.body);
    });

    // POST CREATE
    app.post('/api/money/create', function (req, res) {

      console.log("body", req.body);
      return Histories.create(req.body, function(err, money){
        //console.log("create money res", req.body, res);
        if(err){
          res.send(err);
        }
        getMoney(res);
      });
    });

    // count all, filter by money_type
    app.get('api/money/countAll/:money_type',function(req,res){
      const money_type = req.params.money_type;

      try{
        Histories.find({
          type:money_type
        },function(err,res){
          if(err){
            return res.send(err);
          }
          return res.json(res)
        });
      }catch(ex){
        console.error("Database Error");
        return res.send("Database Error");
      }
    });

    // UPDATE
    app.post('/api/money/:money_id', function(req, res){
      // Money.update(req.body)
    });

    // delete a to
    app.delete('/api/money/:money_id', function (req, res) {
        Histories.remove({
            _id: req.params.money_id
        }, function (err, todo) {
            if (err){
              res.send(err);
            }
            getMoney(res);
        });
    });
    // Count money
    app.get('/api/money/count/:type_money', function(req, res){
        var type = req.params.type_money;
        var agg = Histories.aggregate();
        agg.match({type});
        agg.project({
          total: {
            $sum: {$multiply: ['$quantity', '$amount']}
          }
        });

        agg.exec((err, data)=>{
          if(err){
            res.json(error);

          } else {
            res.json(data[0].total)
          }
      	});
    });

		// Get type of money
    app.get('/api/devise/:devise', function(req, res){
				const devise = req.params.devise;
				var response = null;
        if(devise === 'EUR'){
					response = MoneyType.Money.EUR;
				}
				if(response != null){
					res.json(response);
				} else {
					res.json({erroCode: 404, error : 'Cannot find devise : ' + devise});
				}
    });
    // application -------------------------------------------------------------
    app.get('/*', function (req, res) {
      res.sendFile(path.resolve(__dirname + '/../public/index.html')); // load the single view file (angular will handle the page changes on the front-end)
    });
};
