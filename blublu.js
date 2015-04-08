Dolar = new Mongo.Collection('dolar');
DolarProcess = new Mongo.Collection('dolarprocess');

if (Meteor.isClient) {
  Meteor.subscribe("dolar");
  Meteor.subscribe("dolarprocess");

  Session.set("time", new Date());

  Template.default.helpers({
    "dolar": function(){
      return Dolar.findOne({}, {sort:{createdAt:-1}});
    },
    "dolarVenta": function(){
      return Dolar.findOne({}, {sort:{createdAt:-1}}).dolarBluVenta.toFixed(2);
    },
    "dolarCompra": function(){
      return Dolar.findOne({}, {sort:{createdAt:-1}}).dolarBluCompra.toFixed(2);
    },
    "lastUpdateTime": function(){
      return false
    },
    "currentTime": function(){
      var d = Session.get("time");
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }
  });
  Template.default.events({
    'click .update': function(e){
      console.log(".> cicked");
      Meteor.call("updateDolar");
      console.log(".> wwcicked");
    }
  });
  Template.default.rendered = function () {

    $('.info-container').css({'height':$('.main-container').height() - $('.navbar').height()});

    var $div = $('.price');
    var height = $div.height();
    $div.css({
      'font-size': (height/1.4) + 'px',
      'line-height': height + 'px'
    })

    var $div = $('.price-title');
    var height = $div.height();
    $div.css({
      'font-size': (height/2) + 'px',
      'line-height': height + 'px'
    })

  };

  Template.admin.helpers({
    "dolar": function(){
      return Dolar.findOne({}, {sort:{createdAt:-1}});
    },
    "processActive": function(){
      return DolarProcess.findOne({}, {sort:{lastRun:1}}).active;
    }
  });
  Template.admin.events({
    'click .toggleProcess': function(e){
      Meteor.call("toggleProcess");
    },
    'click .test': function(e){
      Meteor.call("test");
    }
  });

  Meteor.setInterval(function(){
    Session.set("time", new Date());
  }, 1000);

}


if(Meteor.isServer){
  Meteor.publish("dolar", function(){
    return Dolar.find();
  });
  Meteor.publish("dolarprocess", function(){
    return DolarProcess.find();
  });

}



if(Meteor.isCordova){
    Push.addListener('startup', function(notification) {
        // Called when message recieved on startup (cold+warm)
        // alert("startup: " + JSON.stringify(notification))
    });

    Push.addListener('message', function(notification) {
        // Called on every message
        // alert("message: " + JSON.stringify(notification))
    });

    Push.addListener('register', function(evt) {
        // Platform specific event - not really used
        // alert("register: " + JSON.stringify(evt))
    });
    Push.addListener('alert', function(notification) {
        // Called when message got a message in forground
        // alert("alert: " + JSON.stringify(notification))
    });


if(Meteor.isCordova){
    if(admob){
        admob.createBannerView({publisherId: "ca-app-pub-2865121021066072/8597344482"});
      }
    alert(AdMob);
}


/*
    admobid = {
      banner: 'ca-app-pub-2865121021066072/8597344482'
    };

    alert(AdMob);

    if(AdMob){
        AdMob.createBanner( {
          adId: admobid.banner,
          position: AdMob.AD_POSITION.BOTTOM_CENTER,
          autoShow: true
        });
      }*/

};


Meteor.startup(function () {
  Router.route('/', function () {
    this.render('Default');
  });

  Router.route('/admin', function () {
    this.render('admin');
  });

  if(Meteor.isServer){
    if(!Dolar.findOne({}, {sort:{createdAt:-1}})){
      Dolar.insert({
        dolarBluVenta: 0,
        dolarBluCompra: 0,
        createdAt: new Date()
      });
    }
    if(_.isString( Dolar.findOne({}, {sort:{createdAt:-1}}).dolarBluVenta )){
      Dolar.insert({
        dolarBluVenta: 0,
        dolarBluCompra: 0,
        createdAt: new Date()
      });
    }

    Meteor.call("startDolarProcess");
  }

  if(Meteor.isCordova){
    window.onpopstate = function () {
      if (history.state && history.state.initial === true){
        navigator.app.exitApp();
      }
    };

    document.addEventListener("backbutton", function(){
      if(document.location.pathname == "/"){
          navigator.app.exitApp();
      }else{
          history.go(-1);
      };
    });

  };


});


Meteor.methods({

  updateDolar: function () {
    console.log(" --> updateDolar");

    Meteor.http.get('http://contenidos.lanacion.com.ar/json/dolar', {
      headers:{
        "Host": "contenidos.lanacion.com.ar",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:35.0) Gecko/20100101 Firefox/35.0",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.5"
      }
    },
    function(error, result){
      if(error){
        console.log(" -------------> error <------------- ", error);
      }
      if(result){
        console.log(result.content);

        var dol = JSON.parse(result.content.split(/dolarjsonpCallback\(|\);/)[1]);

        var dolVenta = parseFloat(dol.InformalVentaValue.replace(",", "."));
        var dolCompra = parseFloat(dol.InformalCompraValue.replace(",", "."));

        var lastDolar = Dolar.findOne({}, {sort:{createdAt:-1}});
        if(lastDolar.dolarBluVenta != dolVenta || lastDolar.dolarBluCompra != dolCompra){

          Dolar.insert({
            dolarBluVenta: dolVenta,
            dolarBluCompra: dolCompra,
            createdAt: new Date()
          });

          var message = ""

          var compraDiff = Math.round((dolCompra - lastDolar.dolarBluCompra) * 100) / 100 ;
          var ventaDiff = Math.round((dolVenta - lastDolar.dolarBluVenta) * 100) / 100 ;

          if( compraDiff > 0){
            // went up
            message += "compra sube " + compraDiff;
          }else if( compraDiff < 0 ){
            message += "compra baja " + compraDiff*(-1);
          }

          if( ventaDiff > 0){
            // went up
            message += " venta sube " + ventaDiff;
          }else f( ventaDiff < 0 ){
            message += " venta baja " + ventaDiff*(-1);
          }

          var temp = Push.send({
              from: 'push',
              title: message,
              text: message,
              query: {},
              payload: {"compra":dolCompra,"venta":dolVenta}
          });
          console.log(" ====PUSH===")
        }

      }
    }
    )
  },

  updateDolarProcess: function () {
    console.log(" --> updateDolarProcess");

    d = DolarProcess.findOne({},{sort:{createdAt:1}})

    Meteor.call("updateDolar");

    if(!d.killSignall){
      DolarProcess.update(
        {_id: d._id},
        {
        $set: {
          active: true,
          lastRun: new Date()
        }
      });

      Meteor.setTimeout(
        function(){
          Meteor.call("updateDolarProcess");
        }, 30000
      )
    }else{
      d = DolarProcess.findOne({}, {sort:{lastRun:1}})
      console.log(d);
      DolarProcess.update(
        {_id: d._id},
        {
          $set: {
            active: false
          }
        }
      );
      console.log(" -> process killed")
    }

  },

  startDolarProcess: function () {
    if(!DolarProcess.findOne({},{sort:{lastRun:1}})){
      DolarProcess.insert({
        active: false,
        lastRun: new Date()
      });
    }

    console.log(" --> startDolarProcess");
    if(!Meteor.call("checkProcessIsActive")){
      Meteor.call("updateDolarProcess");
      console.log(" --> successful startDolarProcess ")
    }

  },

  checkProcessIsActive: function() {
    var d = DolarProcess.findOne({}, {sort:{lastRun:1}})
    console.log("checkProcessIsActive" , new Date() - d.lastRun, (new Date() - d.lastRun) <= 30000)
    if(new Date() - d.lastRun > 30000){
      DolarProcess.update({_id: d._id}, {$set:{active: false}});
      return false;
    } else {
      return true;
    }
  },

  toggleProcess: function(){
    var d = DolarProcess.findOne({}, {sort:{lastRun:1}});
    var procac = Meteor.call("checkProcessIsActive");
    if(procac){
      DolarProcess.update({_id: d._id}, {$set:{killSignall: true}})
      console.log(" ----------killSignall -------------")
    }else{
      console.log(".> toggleProcess cicked");
      DolarProcess.update({_id: d._id}, {$set:{killSignall: false}})
      Meteor.call("startDolarProcess");
    }
  },

  test: function(){
    /*
    console.log( " ====== PUSH ====== ");
    var temp = Push.send({
            from: 'push',
            title: 'compra sube 0,05 venta sube 0,02',
            text: ' ',
            query: {},
            payload: {"compra":12.95,"venta":13.18}
        });
    console.log( " ====== PUSH <<<<<< ", temp);
    */
  }


});
