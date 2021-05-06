const url = 'https://kaliumapi.appditto.com/api';

function getBananoUSD(){
  $.getJSON('https://api.coingecko.com/api/v3/coins/banano', function(data) {
    banusd = data.market_data.current_price.usd;
    $("#banusd").text(banusd + " BAN/USD");
    $("#accountBalance").text("$" + (potassiumPower * banusd).toFixed(2));
  });
}

function normalizeBan(amount){
  return (amount / 100000000000000000000000000000).toFixed(2);
}

function getAcctBalance(acct){
  window.bananocoinBananojs.bananodeApi.getAccountBalanceRaw(acct).then(function(result) {
    potassiumPower = normalizeBan(result);
    $("#potassiumPower").text(potassiumPower);
    getBananoUSD();
    $('#potassium-power').show();
  });
}

function getTransactions(account, numberOfTransactions){
  $("#transactions")[0].innerHTML = "";
  window.bananocoinBananojs.getAccountHistory(account, numberOfTransactions).then(function(results){
    transactions = results.history;
    console.log(transactions);
    for(i in transactions){
      transaction_string = "";
      if(transactions[i].type == "receive"){
      transaction_string = '<li class="list-group-item transactions d-flex justify-content-between lh-condensed">\
          <div>\
            <h6 class="my-0">Received</h6>\
            <small class="text-muted"><a target="_blank" href="https://creeper.banano.cc/explorer/block/' + transactions[i].hash + '">' + createShortAccountString(transactions[i].account) + '</a></small>\
          </div>\
          <span class="text-success">' + normalizeBan(transactions[i].amount) + ' BAN</span>\
        </li>';
      }else{
        transaction_string = '<li class="list-group-item transactions d-flex justify-content-between lh-condensed">\
          <div>\
            <h6 class="my-0">Sent</h6>\
            <small class="text-muted"><a target="_blank" href="https://creeper.banano.cc/explorer/block/' + transactions[i].hash + '">' + createShortAccountString(transactions[i].account) + '</a></small>\
          </div>\
          <span class="text-danger">' + normalizeBan(transactions[i].amount) + ' BAN</span>\
        </li>';
      }
      $("#transactions").append(transaction_string);

    }
    $('#transactions-list').show();
  });
}

function createShortAccountString(fromAcct){
  return fromAcct.substring(0,11) + "..." + fromAcct.substring(fromAcct.length-6,fromAcct.length);
}

function setMonKey(account){
  monkeyUrl = "https://monkey.banano.cc/api/v1/monkey/"+account+"?svc=banano.cc&amp;background=false";
  $('#generated-monKey').attr('src', monkeyUrl);
  $('#generated-monKey').attr('title', account);
  $('#generated-monKey').show();

  $('#monkey-img').attr('src', monkeyUrl);
  $('#monkey-img').attr('title', account);
}

function loadAccountData(){
  $('#mining').hide();
  $('#transactions-list').hide();
  $('#potassium-power').hide();
  $("#introduction").hide();
  $("#account-row").hide();
  $('#nft-viewer').hide();
  var account =  window.localStorage.account;
  var minerId =  window.localStorage.minerId;
  var waxId = window.localStorage.waxId;
  var potassiumPower = 0;
  var accountBalance = 0;
  var banusd = 0;
  if(account != "" && account != undefined){
    $("#account-row").css('display', 'flex');
    getAcctBalance(account);
    getTransactions(account,15);
    setMonKey(account);
    getMinerData();
    getNFTWaxWallet();
    $("#banano-address").val(account);
    $("#miner-id").val(minerId);
    $("#wax-id").val(waxId);
  }else{
    $("#introduction").show();
  }
}

function getMinerData(){
  $('#mining').hide();
  var minerId =  window.localStorage.minerId;
  if(minerId != "" || minerId != undefined){
    $.getJSON('https://bananominer.com/user_name/'+minerId, function(data) {
      row_string = ""
      payments = data.payments
      var last_wu = 0;
      var last_points = 0;
      $('#mining-rows')[0].innerHTML = "";
      payments.slice().reverse()
      .forEach(function(item) {
            console.log(item);

        row_string = '<tr> \
                        <th scope="row">'+ new Date(item.created_at).toLocaleString().replace(',','') +'</th> \
                        <td><a href="https://creeper.banano.cc/explorer/block/'+ item.block_hash +'" target="_blank">'+ item.amount +'</a></td> \
                        <td>'+ (parseInt(item.work_units)-last_wu) +'</td> \
                        <td>'+ (parseInt(item.score)-last_points)  +'</td> \
                      </tr>'
        $('#mining-rows').prepend(row_string);
        last_wu = parseInt(item.work_units);
        last_points = parseInt(item.score);
      });
      $('#mining').css('display', 'flex');
    });
  }
}

function getBananoNews(){
  $.getJSON('https://www.reddit.com/r/banano/hot/.json?count=5', function(data) {
    console.log(data);
    console.log(data.data.children[0].data.thumbnail);
    console.log(data.data.children[0].data.title);
    console.log(data.data.children[0].data.author);

    for(i in data.data.children){
    newsClip = '<li class="list-group-item transactions d-flex justify-content-between lh-condensed">\
      <div class="card flex-row flex-wrap w-100"> \
         <div class="card-header col-sm-4"> \
             <img src="'+ data.data.children[i].data.thumbnail +'" alt="" style="width:100%; max-height:150px;">\
         </div>\
         <div class="card-block col-sm-8">\
             <h4 class="card-title"><a href="https://www.reddit.com'+data.data.children[i].data.permalink+'" target="_blank" >'+ data.data.children[i].data.title +'</a></h4>\
             <p class="text-muted">'+ data.data.children[i].data.author +'</p>\
         </div>\
     </div> </li>';

     $('#news').append(newsClip);
     if(i == 4){
       getPublish0xNews();
       break;
     }
   }

  });

}

function getPublish0xNews(){
  newsClip = '<li class="list-group-item transactions d-flex justify-content-between lh-condensed">\
    <div class="card flex-row flex-wrap w-100"> \
       <div class="card-header col-sm-4"> \
           <img src="https://static.wixstatic.com/media/d70c24_2ada9b22464c43a584e1412810833b4f~mv2.png/v1/fit/w_560%2Ch_315%2Cal_c/file.png" alt="" style="width:100%; max-height:150px;">\
       </div>\
       <div class="card-block col-sm-8">\
           <h4 class="card-title"><a href="https://www.publish0x.com/banano/banano-is-now-on-coinex-exchange-2-million-ban-airdrop-xomeyvy?a=X7axvLNBdy" target="_blank" >BANANO is now on CoinEx Exchange (2 Million BAN Airdrop)</a></h4>\
           <p class="text-muted">26 Apr 2021</p>\
       </div>\
   </div> </li> \
   <li class="list-group-item transactions d-flex justify-content-between lh-condensed">\
     <div class="card flex-row flex-wrap w-100"> \
        <div class="card-header col-sm-4"> \
            <img src="https://static.wixstatic.com/media/d70c24_2ada9b22464c43a584e1412810833b4f~mv2.png/v1/fit/w_560%2Ch_315%2Cal_c/file.png" alt="" style="width:100%; max-height:150px;">\
        </div>\
        <div class="card-block col-sm-8">\
            <h4 class="card-title"><a href="https://www.publish0x.com/banano/exchange-listing-banano-to-be-listed-on-coinex-xlyrvzn?a=X7axvLNBdy" target="_blank" >Exchange Listing: BANANO To Be Listed on Coinex!</a></h4>\
            <p class="text-muted">26 Apr 2021</p>\
        </div>\
    </div> </li> \
    <li class="list-group-item transactions d-flex justify-content-between lh-condensed">\
      <div class="card flex-row flex-wrap w-100"> \
         <div class="card-header col-sm-4"> \
             <img src="https://static.wixstatic.com/media/d70c24_2ada9b22464c43a584e1412810833b4f~mv2.png/v1/fit/w_560%2Ch_315%2Cal_c/file.png" alt="" style="width:100%; max-height:150px;">\
         </div>\
         <div class="card-block col-sm-8">\
             <h4 class="card-title"><a href="https://www.publish0x.com/banano/free-banano-nfts-cryptomonkeys-update-19-month-7-recap-and-m-xvwoyje?a=X7axvLNBdy" target="_blank" >Free BANANO NFTs: cryptomonKeys Update #19: Month 7 Recap & monKeymining Update</a></h4>\
             <p class="text-muted">21 Apr 2021</p>\
         </div>\
     </div> </li> \
   ';

   $('#news').append(newsClip);
}

function getNFTWaxWallet(){
  waxId = window.localStorage.waxId;
  if(waxId != "" && waxId != undefined){
    $.getJSON('https://wax.api.atomicassets.io/atomicmarket/v1/assets?owner='+ waxId +'&page=1&limit=100&order=desc&sort=asset_id', function(data) {
      console.log(data);
      $("#nft-holder")[0].innerHTML = "";
      $("#nft-indicators")[0].innerHTML = "";
      nfts = data.data;
      for(i in nfts){
        img = "https://ipfs.atomichub.io/ipfs/"+nfts[i].data.img;
        name = nfts[i].data.name;
        collection = nfts[i].collection.collection_name;

        if(i==0){
          indicator = '<li data-target="#nftIndicators" data-slide-to="'+i+'" class="active"></li>';
          active_ind = 'active';
        }else{
          indicator = '<li data-target="#nftIndicators" data-slide-to="'+i+'"></li>';
          active_ind = '';
        }

        nft_slide = '<div class="carousel-item '+ active_ind +'" id="nft-slide">\
          <div class="nft-carousel-header">\
            <img class=" w-100" src="'+img+'" alt=""/>\
          </div>\
        </div>';

        $('#nft-indicators').append(indicator);
        $('#nft-holder').append(nft_slide);
      }
      $('#nft-viewer').show();
    });
  }
}


window.bananocoinBananojs.setBananodeApiUrl(url);
loadAccountData();
getBananoNews();
