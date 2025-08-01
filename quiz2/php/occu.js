//kuizu.jsと同じようで少し違う
var kei_max = 3;  //最大問題数
var kei2;  //第何問目なのか
var tensu;　//正解数
var rand; // 問題番号
var miss = []; //間違った問題の配列
var sec=0;
var min=0;
var flag=0;
var timer;
var eigo = ["vet","soccer player","bus driver","teacher","doctor","artist","singer","farmer","baseball player","baker","dentist","florist","police officer","firefighter"];
var eigo2 = ["vet","soccerplayer","busdriver","teacher","doctor","artist","singer","farmer","baseballplayer","baker","dentist","florist","policeofficer","firefighter"];
var nihongo = ["<ruby>獣医<rp>(</rp><rt>じゅうい</rt><rp>)</rp></ruby>","サッカー<ruby>選手<rp>(</rp><rt>せんしゅ</rt><rp>)</rp></ruby>","バス<ruby>運転手<rp>(</rp><rt>うんてんしゅ</rt><rp>)</rp></ruby>","<ruby>教師<rp>(</rp><rt>きょうし</rt><rp>)</rp></ruby>",
　　　　　　　　"<ruby>医者<rp>(</rp><rt>いしゃ</rt><rp>)</rp></ruby>","<ruby>芸術家<rp>(</rp><rt>げいじゅつか</rt><rp>)</rp></ruby>","<ruby>歌手<rp>(</rp><rt>かしゅ</rt><rp>)</rp></ruby>",
　　　　　　　　"<ruby>農家<rp>(</rp><rt>のうか</rt><rp>)</rp></ruby>","<ruby>野球選手<rp>(</rp><rt>やきゅうせんしゅ</rt><rp>)</rp></ruby>","パン<ruby>屋<rp>(</rp><rt>や</rt><rp>)</rp></ruby>",
　　　　　　　　"<ruby>歯医者<rp>(</rp><rt>はいしゃ</rt><rp>)</rp></ruby>","<ruby>花屋<rp>(</rp><rt>はなや</rt><rp>)</rp></ruby>","<ruby>警察官<rp>(</rp><rt>けいさつかん</rt><rp>)</rp></ruby>",
　　　　　　　　"<ruby>消防士<rp>(</rp><rt>しょうぼうし</rt><rp>)</rp></ruby>"];

$(function(){
  if(window.sessionStorage.getItem('examno')) {
      kei2 = parseInt(window.sessionStorage.getItem('examno')); 　//sessionStorageでは数値ではなく文字で返すためparseIntで数値化する
      tensu = parseInt(window.sessionStorage.getItem('correctansno'));
  }
  else {
      kei2 = 1;
      window.sessionStorage.setItem('examno',kei2);
      tensu = 0;
      window.sessionStorage.setItem('correctansno',tensu);
  }

function log(){
   $("#dialog").dialog({
     width : 700,
     height : 500,
     autoOpen : true,
     modal : true,
     show : ("fadeIn",1500),
     hide : "explode",
     buttons : {
       "START" : function(){
         $(this).dialog('close');
       }
     }
   });
}
log();

function onsei(){  //Web Speech Recognition API
  //音声認識APIのインスタンス生成
  $("#onsei").click(function(){
    var speech = new webkitSpeechRecognition();
    //音声認識APIにパラメータを設定
    speech.lang = "en";　　　　　  // 音声認識を行う言語
    speech.continuous = false;　　// 連続音節の音声認識を行うか
    speech.maxAlternatives = 1;　 // 認識結果候補の個数
    //音声認識APIを開始
    speech.start();
    speech.addEventListener('result',function(e){
      var text = e.results[0][0].transcript;
      $("#text").val(text);
      if(text === "open"){
        location.href="kuizu2.html";
      }
      else if(text === "occupation"){
        location.href="occupation2.html";
      }
      else if(text === "dictionary"){
        window.open("https://ejje.weblio.jp/");
      }
    });
  });
}

function yomiage(hassei){  //Web Speech Synthesis API
  //音声出力APIのインスタンス生成
  var out = new SpeechSynthesisUtterance();
  //音声出力APIにパラメータを設定
  out.voiceURI = 1;      // 出力する音声の種類
  out.volume = 1;        // 出力する音声のボリューム
  out.rate = 0.7;        // 出力する音声の速さ
  out.pitch = 2;         // 出力する音声のピッチ(高さ)
  out.text = hassei;     // 出力する文章
  out.lang = 'en';       // 出力する音声の言語
  //音声出力
  speechSynthesis.speak(out);
}

  onsei();

  //timerの設置
  function  timer(){
    $("#text").on("keyup",function(e){
      if(flag==0){
        start();
        flag=1;
      }
    });
    $("#onsei").on("click",function(e){
      if(flag==0){
        start();
        flag=1;
      }
    });
    $("#sousin").on("click",function(){
      if(flag==0){
        start();
        flag=1;
      }
    });
    function start(){
      sec=0;
      min=0;
      $("#clock").html("00:00");
      timer=setInterval(countup,10);
    }
    function countup(){
      sec++;
      if(sec>99){
        sec=0;
        min=min+1;
      }
    	sec_number=("0"+sec).slice(-2);
    	min_number=min;
    $("#clock").html(min_number+"."+sec_number);
    }
  }
  timer();

  function stoptimer(){
    clearInterval(timer);
  }

  function get(){
    var tno = $("#your_time").text();
    // tno = parseInt(tno.replace(/[^0-9]/g,""));
  	$("#nik_sousin").click(function(){
      var val = $("#nik").val();
      if(val==""){
        alert("ニックネームを入力してください");
      }
      else{
  		$.get("occupation.php",{
  		    name : val,
  			  time : tno
  		},function(){
  			alert("送信しました");
        $("#nik").val("");
        $("#cong").hide(1000);
  		});
    }
  	});
  }

  $('body').fadeMover();
  $("#cong").hide();
  $(".miss").hide();
  var max = eigo.length-1;
  var min =0;
  rand = Math.floor(Math.random()*(max+1-min))+min;　//ランダムな数字を取得
  $(".kuizu").html(nihongo[rand]);　//クイズを表示
  $("#monkazu").text(kei2);　//第何問目なのか表示
  $("#kei").text("/"+kei_max);
  //送信ボタンを押した後
  $("#sousin").click(function(){
       var input = $("#text").val();　//テキストの中身を取得
       if( input === eigo[rand]){ //テキストの中身と答えが一致するなら
          tensu++;
          $("#tensu").text(tensu);
          $("#batu").css("display","none")
          $("#maru").css("display","block");
          var maru2 = $("#maru2");  //〇の効果音
          maru2[0].currentTime = 0;
          maru2[0].play();
          $("#next").prop('disabled',false);　//次へを押せるようにする
          $("#sousin").prop('disabled',true);　//送信を押せなくする
        }
        else{　//答えと違っているなら
           $(".kotae").text(eigo[rand]);
           $("#maru").css("display","none");　 // noneにしないと表示が被る
           $("#batu").css("display","block");
           var batu2 = $("#batu2");　 //☓の効果音
           batu2.get(0).currentTime = 0; 　// batu2[0].currentTime　でもよい
           batu2.get(0).play(); 　// batu2[0].play()　でもよい
           $("#next").prop('disabled',false);
           $("#sousin").prop('disabled',true);
           yomiage(eigo[rand]);
           miss.push(eigo[rand]);
        }
        if(eigo.length === 1){
          eigo = ["vet","soccer player","bus driver","teacher","doctor","artist","singer","farmer","baseball player","baker","dentist","florist","police officer","firefighter"];
          eigo2 = ["vet","soccerplayer","busdriver","teacher","doctor","artist","singer","farmer","baseballplayer","baker","dentist","florist","policeofficer","firefighter"];
          nihongo = ["<ruby>獣医<rp>(</rp><rt>じゅうい</rt><rp>)</rp></ruby>","サッカー<ruby>選手<rp>(</rp><rt>せんしゅ</rt><rp>)</rp></ruby>","バス<ruby>運転手<rp>(</rp><rt>うんてんしゅ</rt><rp>)</rp></ruby>","<ruby>教師<rp>(</rp><rt>きょうし</rt><rp>)</rp></ruby>",
          　　　　　　　　"<ruby>医者<rp>(</rp><rt>いしゃ</rt><rp>)</rp></ruby>","<ruby>芸術家<rp>(</rp><rt>げいじゅつか</rt><rp>)</rp></ruby>","<ruby>歌手<rp>(</rp><rt>かしゅ</rt><rp>)</rp></ruby>",
          　　　　　　　　"<ruby>農家<rp>(</rp><rt>のうか</rt><rp>)</rp></ruby>","<ruby>野球選手<rp>(</rp><rt>やきゅうせんしゅ</rt><rp>)</rp></ruby>","パン<ruby>屋<rp>(</rp><rt>や</rt><rp>)</rp></ruby>",
          　　　　　　　　"<ruby>歯医者<rp>(</rp><rt>はいしゃ</rt><rp>)</rp></ruby>","<ruby>花屋<rp>(</rp><rt>はなや</rt><rp>)</rp></ruby>","<ruby>警察官<rp>(</rp><rt>けいさつかん</rt><rp>)</rp></ruby>",
          　　　　　　　　"<ruby>消防士<rp>(</rp><rt>しょうぼうし</rt><rp>)</rp></ruby>"];
        }
        else{
        eigo.splice(rand,1);
      //配列からその問題を削除
        nihongo.splice(rand,1);
      }
  });

  //リセットボタン
  function reset(){
    $("#reset").click(function(){
        location.reload();
    });
  }

　//次へボタンを押した後
  $("#next").click(function(){
      kei2 += 1;
      var max = eigo.length-1;
      var min =0;
      rand = Math.floor(Math.random()*(max+1-min))+min;　//ランダムな数字を取得
      if(tensu !== kei_max){
         $(".kuizu").html(nihongo[rand]);　//問題表示
         $("#monkazu").text(kei2);　//第何問目なのかを表示
      }
      // if(tensu === kei_max){
      //    alert("満点です！");
      //    $("#next").prop('disabled',true);　//次へボタンを押せなくする
      //    $("#reset").prop('disabled',false);
      //    $("#cong").show(1000);
      //    stoptimer();
      //    var your_time = $("#clock").text();
      //    $("#your_time").text(your_time);
      //    get();
      //    reset();
      // }
       if(tensu === kei_max){
        var your_time = $("#clock").text();
        alert(kei2-1+" "+"問中"+" "+tensu+" "+"問正解しました!\n"+"あなたのタイムは　"+your_time+"秒");
         $("#next").prop('disabled',true);　//次へボタンを押せなくする
         var miss2 = miss.filter(function (x, i, self) { //配列内の重複を削除
         return self.indexOf(x) === i;
     });
         for( var m = 0; m < miss2.length ; m++){　//間違った問題を表示
            $(".missno").before("<p class='miss"+m+"'></p>");
            $(".miss"+m).html(miss2[m]);
            yomiage(miss2[m]);　//間違った問題を読み上げる
         }
         if(miss.length >= 1){
         $(".miss").show("explode",1500);　//間違った問題を表示
         $(".miss").draggable({　//間違った問題をドラッグ可能に
           containment: '#layerImage'　//layerImageの範囲まで移動可能
         });
       }
         $("#reset").prop('disabled',false);　//リセットボタンを押せるようにする
         $("#cong").show(1000);
         stoptimer();
         $("#your_time").text(your_time);
         get();
         reset();
      }
      else{
         $(".kotae").text("");　//答えの表示を非表示にする
         $("#text").val("");　//テキストの中身を空にする
         $("#next").prop('disabled',true);　//次へボタンを押せなくする
         $("#sousin").prop('disabled',false);　//送信ボタンを押せるようにする
         $("#batu").hide("explode",500);
         $("#maru").hide("explode",500);
         onsei();
      }
　 });
for(var i=0 ; i < eigo.length ; i++){
  $(".eigo").append('<p>'+eigo[i]+'</p>');
  $(".nihon").append('<p>'+nihongo[i]+'</p>');
}
   $(".eigo > p")
    .mouseenter(function(){
       $(this).css("font-size","120%");
       $(this).css("background-color","rgba(0,0,255,0.4)");
   })
    .mouseleave(function(){
       $(this).css("font-size","100%");
       $(this).css("background-color","white");
   })
    .click(function(){
       $(".pra").hide(800);
       $(".pra").removeClass("pra");
       var practice = $(this).text();
       for(var j =0; j < eigo.length; j++){
         if(practice == eigo[j]){
           var practice = eigo2[j];
         }
       }
       $("#"+practice).addClass("pra");
       $(".pra").show(800);
       yomiage(practice);
   });
 $("#acmenu dt").on("click", function() {
  $("#acmenu dd").slideToggle();
 });
 $("#acmenu2 dt").on("click", function() {
  $("#acmenu2 dd").slideToggle();
 });
 $("#acmenu3 dt").on("click", function() {
  $("#acmenu3 dd").slideToggle();
 });
 $("dd,dt")
  .mouseenter(function(){
     $(this).css("background-color","rgba(0,0,255,0.4)");
 })
  .mouseleave(function(){
     $(this).css("background-color","#033560");
 })
});
