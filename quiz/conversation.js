var kei_max = 3;  //最大問題数
var kei2;  //第何問目なのか
var tensu;　//正解数
var rand; // 問題番号
var miss = []; //間違った問題の配列
var sec=0;
var sec2=0;
var min=0;
var flag=0;
var timer;
var tno;
var next_prop = 0;
var eigo  = [
  ["Hello. I'm Kazuki. I like red. What color do you like?","I like blue.","I like it,too. How about foods? I like strawberry. What food do you like?",
             "I like chocolate.","The same. How about tomato?","I don't like tomato."],
  ["Hello. How are you today?","I'm sleepy.","Why? What time did you go to bed last night?","I went to bed at 12.",
             "Really? What time did you get up today?","I got up at 7."],
  ["What sport do you like?","I like soccer.","You like soccer? That's nice. Why?","It's fun.","I see. Let's play soccer together.","Sure."]
];
var nihongo = [
  ["私は青が好きです","私はチョコレートが好きです","トマトは好きではないです"],
  ["眠たいです","12時に寝ました","7時に起きました"],
  ["私はサッカーが好きです","楽しいからです","もちろん"]
];
var nihongo2 = [
  ["こんにちは、私はカズキです。色は赤が好きです。あなたは何色が好きですか？","私は青が好きです","私も青が好きです。食べ物についてはどうですか？私はいちごが好きです。あなたは何の食べ物が好きですか？",
  "私はチョコレートが好きです","私も同じです。トマトはどうですか？","トマトは好きではないです"],
  ["こんにちは、調子はどうですか？","眠たいです","なんで？昨日は何時に寝たの？","12時に寝ました","ああ、今日は何時に起きたの？","7時に起きました"],
  ["何のスポーツが好きですか？","私はサッカーが好きです","サッカーが好きなんですか？それはいいですね。なぜ好きなんですか？","楽しいからです","なるほど。一緒にサッカーしましょう","もちろん"]
];

//sessionStorageで値を取得
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

//ダイアログ
function log(){
   $("#dialog2").dialog({
     width : 700,
     height : 500,
     autoOpen : true,　
     modal : true,　　//他の操作をできなくするかどうか
     show : ("fadeIn",1500),
     hide : "explode",
     buttons : {
       "START" : function(){
         $(this).dialog('close');
         setTimeout(function(){
             yomiage(eigo[rand][(2*(kei2-1))]); //最初の会話文を読み上げる。3つの会話文からランダムに選ぶ
         },500);
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
    speech.continuous = false;　　// 連続音声の音声認識を行うか
    speech.maxAlternatives = 1;　 // 認識結果候補の個数
    speech.interimResults = true; //認識の途中にも結果を返す
    //音声認識APIを開始
    speech.start();
    speech.addEventListener('result',function(e){　//重複を防ぐため
      var text = e.results[0][0].transcript; //認識された「言葉」は「results」配列内にある「transcript」に格納されている
      // for(var j =0; j < eigo2.length; j++){
      //   if(text == eigo2[j]){　//eigo2は文頭が小文字でピリオドも？もない状態。つまり、音声入力の初期値
      //     var text = eigo4[j];　//eigo4は文頭は大文字でピリオドも？もついている状態。
      //   }
      // }
    var text = text.replace(/^[a-z]/, function (val) {
         return val.toUpperCase();
    });
        $("#text").val(text);　//テキスト欄にtextの値を入力
      if(text === "Open"){
        location.href="kuizu2.html";
      }
      else if(text === "Occupation"){
        location.href="occupation2.html";
      }
      else if(text === "Dictionary"){
        window.open("https://ejje.weblio.jp/");
      }
    });
  });
}

var speed = 0.5;
$("#slider").slider({
   max:1, //最大値
   min: 0.1, //最小値
   value: speed, //初期値
   step: 0.1, //幅
   change: function( event, ui ) {
         speed = ui.value;
       }
 });

function yomiage(hassei){  //Web Speech Synthesis API
  //音声出力APIのインスタンス生成
  var out = new SpeechSynthesisUtterance();
	//音声出力APIにパラメータを設定
  out.voiceURI = 1;      // 出力する音声の種類
  out.volume = 1;        // 出力する音声のボリューム
  out.rate = speed;        // 出力する音声の速さ
  out.pitch = 1.5;         // 出力する音声のピッチ(高さ)
  out.text = hassei;     // 出力する文章
  out.lang = 'en-US';       // 出力する音声の言語
  //音声出力
  speechSynthesis.speak(out);

  out.onend =  function(){
	 $("#onsei").prop('disabled',false);
   $(".kuizu").html(nihongo[rand][kei2-1]);　//会話の応答例を表示
//   $("#sousin").prop("disabled",false);
    next_prop = 1;
  }

   var onseistop = function(){ //クロージャ
                    speechSynthesis.cancel();
                  }
                  return onseistop; //クロージャであるonseistopをグローバル関数に呼び出すため
}

  onsei();

//timerの設置
function  timer(){
  $("#text").on("keyup",function(){
    if(flag==0){
      start();
      flag=1;
    }
  });
  $("#onsei").on("click",function(){
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

//データの受け渡し
function get(){
  var tno = $("#your_time").text();
  // tno = parseInt(tno.replace(/[^0-9]/g,""));
	$("#nik_sousin").click(function(){
    var val = $("#nik").val();
    if(val==""){
      alert("ニックネームを入力してください");
    }
    else{
		$.get("kuizu.php",{
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
 // var onseistop2 = yomiage();　//onseistopの関数を呼び出す変数。
 // onseistop2();
  $("body").fadeMover();　
  $(".miss").hide();　//最後に出るミス問題表示を最初は隠しておく
  $("#cong").hide();　//ランキングに乗るための画面を最初は隠しておく
  var max = eigo.length-1; //配列の長さ(個数)から1引くことで、配列の何番目かを表すことができる。
  var min =0;
  rand = Math.floor(Math.random()*(max+1-min))+min;　//ランダムな数字を取得
  // if(window.performance){
  //   if(performance.navigation.type === 1){
  //     $("#kaiwa1").click();
  //   }
  // }

   // setTimeout(function(){
   //     yomiage(eigo[rand][(2*(kei2-1))]); //最初の会話文を読み上げる。3つの会話文からランダムに選ぶ
   // },500);
	// $(".kuizu").html(nihongo[rand][kei2-1]);　//会話の応答例を表示
 // $("#toguru").prop('disabled',true);
  $(".kuizu").html("～リスニング中～");
  $("#monkazu").text(kei2);　//第何問目なのか表示
  $("#kei").text("/"+kei_max);　//最大問題数を表示
   var settime = function(){
                $("#next").prop("disabled",false);
   }



//エンターキーで送信する機能
$("#text").on('keypress',function(e){　//テキストボックスにフォーカスしているときエンターキーで送信するようにする
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
$("#onsei").on('keypress',function(e){　//音声開始を押しているときエンターキーで送信する
  if(kei2 <= kei_max){
  if(e.which == 13){
      var dis = $("#sousin").is(":disabled");
	  var dis2 = $("#next").is(":disabled");
    if(!dis){
    $("#sousin").click();
    }
      else if(dis){
		  if(!dis2){
			  $("#next").click();
			  }
    }
  }
}
});

//問題を日本語と英語に切り替えるボタン
$("#toguru").button();　//トグルボタンの定義
$("#toguru").click(function(){　
  var a = $("#toguru").prop("checked");
  if(a){
    $(".kuizu").html(eigo[rand][(2*kei2)-1]);
  }
  else{
    $(".kuizu").html(nihongo[rand][kei2-1]);
  }
});

//もう一度会話文を読み上げる機能
$("#onemore").click(function(){
  yomiage(eigo[rand][(2*(kei2-1))]);
});

  //送信ボタンを押した後
	$("#sousin").click(function(){
      next_prop = 0;
    var onseistop2 = yomiage();　//onseistopの関数を呼び出す変数。
       onseistop2();
	   stoptimer();　//送信でタイマーストップ
       var input = $("#text").val();　//テキストの中身を取得
       // input = input.toLowerCase();//文字列の中の大文字を小文字に
       // var input2 = input.match(/[\.\?]$/);
		var eigo_kai  = eigo[rand][(2*kei2)-1].replace(/[\.\?!]$/,'');
       if( input === eigo_kai ){ //テキストの中身と答えが一致するなら
          tensu++;　//tensuの変数に１増やす
          $("#tensu").text(tensu);　//点数を表示する
          $("#batu").css("display","none");　//×を非表示
          $("#maru").css("display","block");　//〇を表示
          var maru2 = $("#maru2");  //〇の効果音
           maru2[0].currentTime = 0;　//０秒からスタート
		   maru2[0].volume = 0.2;
           maru2[0].play();　//音を鳴らす　jQueryオブジェクトは配列のような形で取得されるため、get(0)などを使用して、「一番最初の要素」を取得した上で命令をしないといけない。
		   setTimeout(settime,2000);
        //  $("#next").prop('disabled',false);　//次へを押せるようにする
          $("#sousin").prop('disabled',true);　//送信を押せなくする
        }
        else{　//答えと違っているなら
           $(".kotae").text(eigo[rand][(2*kei2)-1]);　//正しい答えを表示
           yomiage(eigo[rand][(2*kei2)-1]);　//答えを読み上げる
           $("#maru").css("display","none");　 // noneにしないと表示が被る
           $("#batu").css("display","block");　//×を表示
           var batu2 = $("#batu2");　 //☓の効果音
			batu2.get(0).currentTime = 0; 　// batu2[0].currentTime　でもよい
			batu2.get(0).volume = 0.2;
			batu2.get(0).play(); 　// batu2[0].play()　でもよい
			setTimeout(settime,2000);
          // $("#next").prop('disabled',false);　//「次へ」ボタンを押せるようにする
           $("#sousin").prop('disabled',true);　//「送信]ボタンを押せなくする。
           miss.push(eigo[rand][(2*kei2)-1]);　//間違った問題を miss の配列に入れる。
        }

        //  $("#next").prop('disabled',false);

    //     eigo2.splice(rand,1);
    //     eigo4.splice(rand,1);　//配列からその問題を削除
    //     nihongo.splice(rand,1);
  });

  //リセットボタン
  function reset(){
      $("#reset").click(function(){　//リセットボタンをクリックしたとき]
        location.reload();　//リロードを行う
    });
  }

　//次へボタンを押した後
	$("#next").click(function(){
		next_prop = 0;
       clearTimeout(settime);
  //    var onseistop2 = yomiage();　//onseistopの関数を呼び出す変数。
	//	onseistop2();
      kei2 += 1;
      // var max = eigo2.length-1;　//配列から削除したのでもっかい作成
      // var min =0;
      // rand = Math.floor(Math.random()*(max+1-min))+min;　//ランダムな数字を取得
      if(kei2-1 < kei_max){
		  timer=setInterval(restart,10);　//タイマーの再開
    //  setTimeout(function(){
          yomiage(eigo[rand][(2*(kei2-1))]); //最初の会話文を読み上げる。3つの会話文からランダムに選ぶ
		  //  },500);
    // $("#sousin").prop("disabled",true);
     $(".kuizu").html("～リスニング中～");
      //     $(".kuizu").html(nihongo[rand][kei2-1]);　//問題表示
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
         for( var m = 0; m < miss.length ; m++){　//間違った問題を表示
            $(".miss"+m).html(miss[m]);
            yomiage(miss[m]);　//間違った問題を読み上げる
         }
         $(".miss").show("explode",1500);　//間違った問題を表示
         $(".miss").draggable({　//間違った問題をドラッグ可能に
           containment: '#layerImage'　//layerImageの範囲まで移動可能
         });
         $("#reset").prop('disabled',false);　//リセットボタンを押せるようにする
         stoptimer();
         reset();　
      }
		else{
         $(".kotae").text("");　//答えの表示を非表示にする
         $("#text").val("");　//テキストの中身を空にする
         $("#onsei").prop('disabled',true);
         $("#next").prop('disabled',true);　//次へボタンを押せなくする
         $("#sousin").prop('disabled',false);　//送信ボタンを押せるようにする
         $("#batu").hide("explode",500);　//×を非表示
         $("#maru").hide("explode",500);　//〇を非表示
         onsei();
         next_prop = 0;
      }
　 });

//問題一覧
for(var i=0 ; i < eigo.length ; i++){　//問題一覧を順番に表示
  for(var g=0 ; g < eigo[i].length ; g++){
  $(".eigo").append('<p>'+eigo[i][g]+'</p>');
  $(".nihon").append('<p>'+nihongo2[i][g]+'</p>');
}
}
   $(".eigo > p")
    .mouseenter(function(){　//マウスがブロックの中に入ったら
       // $(this).css("font-size","100%");
       $(this).css("background-color","rgba(0,0,255,0.4)");
   })
    .mouseleave(function(){　//マウスがブロックの外に出たら
       // $(this).css("font-size","100%");
       $(this).css("background-color","white");
   })
    .click(function(){　//クリックしたら
      var onseistop2 = yomiage();　//onseistopの関数を呼び出す変数。
      onseistop2();
       var practice = $(this).text();
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
