//kuizu.jsと同じようで少し違う
var kei_max = 5;  //最大問題数
var kei2;  //第何問目なのか
var tensu;　//正解数
var rand; // 問題番号
var miss = []; //間違った問題の配列
var sec=0;
var min=0;
var flag=0;
var timer;
var eigo = ["water","bath","radio","think","agree","ugly","birthday","girl","right","light"];
var nihongo = ["<ruby>水<rp>(</rp><rt>みず</rt><rp>)</rp></ruby>","<ruby>風呂<rp>(</rp><rt>ふろ</rt><rp>)</rp></ruby>","ラジオ","<ruby>思<rp>(</rp><rt>おも</rt><rp>)</rp></ruby>う・<ruby>考<rp>(</rp><rt>かんが</rt><rp>)</rp></ruby>える",
　　　　　　　　"<ruby>賛成<rp>(</rp><rt>さんせい</rt><rp>)</rp></ruby>する","<ruby>醜<rp>(</rp><rt>みにく</rt><rp>)</rp></ruby>い","<ruby>誕生日<rp>(</rp><rt>たんじょうび</rt><rp>)</rp></ruby>",
　　　　　　　　"<ruby>女<rp>(</rp><rt>おんな</rt><rp>)</rp></ruby>の<ruby>子<rp>(</rp><rt>こ</rt><rp>)</rp></ruby>",
　　　　　　　　"<ruby>右<rp>(</rp><rt>みぎ</rt><rp>)</rp></ruby>・<ruby>正<rp>(</rp><rt>ただ</rt><rp>)</rp></ruby>しい・<ruby>権利<rp>(</rp><rt>けんり</rt><rp>)</rp></ruby>",
　　　　　　　　"<ruby>光<rp>(</rp><rt>ひかり</rt><rp>)</rp></ruby>"];

$(function(){
  //点数や問題数などを記憶
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

//ダイアログの設定
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
    speech.lang = "en-US";　　　　　  // 音声認識を行う言語
    speech.continuous = false;　　// 連続音節の音声認識を行うか
    speech.maxAlternatives = 1;　 // 認識結果候補の個数
	speech.interimResults = true; //認識の途中にも結果を返す
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
  out.pitch = 1.5;         // 出力する音声のピッチ(高さ)
  out.text = hassei;     // 出力する文章
  out.lang = 'en-US';       // 出力する音声の言語
  //音声出力
  speechSynthesis.speak(out);
  var onseistop = function(){ //クロージャ
                   speechSynthesis.cancel();
                 }
  return onseistop; //クロージャであるonseistopをグローバル関数に呼び出すため
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
      $("#clock").html("0.00");
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

function restart(){
      sec++;
      if(sec>99){
        sec=0;
        min=min+1;
      }
        sec_number=("0"+sec).slice(-2);
        min_number=min;
    $("#clock").html(min_number+"."+sec_number);
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
  		$.get("pronunciation.php",{
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

$("#text").on('keypress',function(e){
  if(kei2 <= kei_max){
  if(e.which == 13){
    var dis = $("#sousin").is(":disabled");
    if(!dis){
    $("#sousin").click();
    }
    else if(dis){
      $("#next").click();
    }
  }
}
});

$("#onsei").on('keypress',function(e){
  if(kei2 <= kei_max){
  if(e.which == 13){
    var dis = $("#sousin").is(":disabled");
    if(!dis){
    $("#sousin").click();
    }
    else if(dis){
      $("#next").click();
    }
  }
}
});

  //送信ボタンを押した後
	$("#sousin").click(function(){
    var onseistop2 = yomiage();　//onseistopの関数を呼び出す変数。
    onseistop2();
		stoptimer();

      //正誤判定はすべて文頭を小文字に変換し、「.」「?」を省いた状態でする
       var input = $("#text").val();　//テキストの中身を取得
       input = input.toLowerCase();//文字列の中の大文字を小文字に
       var input2 = input.match(/[\.\?]$/);
       if(input2){
         input = input.replace(/[\.\?!]$/,'');
       }

       if( input === eigo[rand]){ //テキストの中身と答えが一致するなら
          tensu++;
          $("#tensu").text(tensu);
          $("#batu").css("display","none")
          $("#maru").css("display","block");
          var maru2 = $("#maru2");  //〇の効果音
           maru2[0].currentTime = 0;
		    maru2[0].volume = 0.2;
          maru2[0].play();
          $("#next").prop('disabled',false);　//次へを押せるようにする
          $("#sousin").prop('disabled',true);　//送信を押せなくする
        }
        else{　//答えと違っているなら
           $(".kotae").text(eigo[rand]);
           $("#maru").css("display","none");　 // noneにしないと表示が被る
           $("#batu").css("display","block");
           var batu2 = $("#batu2");　 //☓の効果音
			batu2.get(0).currentTime = 0;　// batu2[0].currentTime　でもよい
			batu2.get(0).volume = 0.2;
           batu2.get(0).play(); 　// batu2[0].play()　でもよい
           $("#next").prop('disabled',false);
           $("#sousin").prop('disabled',true);
           yomiage(eigo[rand]);
           miss.push(eigo[rand]);
        }
        eigo.splice(rand,1);
      //配列からその問題を削除
        nihongo.splice(rand,1);
  });

  //リセットボタン
  function reset(){
    $("#reset").click(function(){
        location.reload();
    });
  }

　//次へボタンを押した後
  $("#next").click(function(){
    var onseistop2 = yomiage();　//onseistopの関数を呼び出す変数。
    onseistop2();
      kei2 += 1;
      var max = eigo.length-1;
      var min =0;
      rand = Math.floor(Math.random()*(max+1-min))+min;　//ランダムな数字を取得
      if(kei2-1 < kei_max){
		  timer=setInterval(restart,10);
         $(".kuizu").html(nihongo[rand]);　//問題表示
         $("#monkazu").text(kei2);　//第何問目なのかを表示
      }
      if(tensu === kei_max){
         alert("満点です！");
         $("#next").prop('disabled',true);　//次へボタンを押せなくする
         $("#reset").prop('disabled',false);
         $("#cong").show(1000);
         stoptimer();
         var your_time = $("#clock").text();
         $("#your_time").text(your_time);
         get();
         reset();
      }
      else if(kei2-1 === kei_max){
        var your_time = $("#clock").text();
        alert(kei2-1+" "+"問中"+" "+tensu+" "+"問正解しました!\n"+"あなたのタイムは　"+your_time);
         $("#next").prop('disabled',true);　//次へボタンを押せなくする
         for( var m = 0; m < miss.length ; m++){
            $(".miss"+m).html(miss[m]);
            yomiage(miss[m]);
         }
         $(".miss").show("explode",1500);　//間違った問題を表示
         $(".miss").draggable({
           containment: '#layerImage'
         });
         $("#reset").prop('disabled',false);　//リセットボタンを押せるようにする
         stoptimer();
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
           var practice = eigo[j];
         }
       }
       var onseistop2 = yomiage();　//onseistopの関数を呼び出す変数。
       onseistop2();
       $("#"+practice).addClass("pra");
       $(".pra").show(800);
       yomiage(practice);
   });

   //メニューの実装
  $("#acmenu dt").on("click", function() {
   $("#acmenu dd").slideToggle();
  });
  $("#acmenu2 dt").on("click", function() {
   $("#acmenu2 dd").slideToggle();
  });
  $("#acmenu3 dt").on("click", function() {
   $("#acmenu3 dd").slideToggle();
  });
   $("dl dt")
   .mouseenter(function(){
      $(this).css("background-color","rgba(0,0,255,0.4)");
  })
   .mouseleave(function(){
      $(this).css("background-color","rgb(72,100,119)");
   })
 $("dd")
   .mouseenter(function(){
      $(this).css("background-color","rgba(0,0,255,0.4)");
  })
   .mouseleave(function(){
      $(this).css("background-color","#033560");
  })
 });
