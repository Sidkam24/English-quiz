<?php
$i=0;
$a = $_GET['name'];
$b = $_GET['time'];
$monkazu = $_GET['mon'];
$score = $_GET['score'];
if(($a != "")&&($b != "")){
$w = $a.":".$b.":".$monkazu.":".$score."\n";
}
$file = fopen("rank.data","a");
fwrite($file,$w);
fclose($file);
// $file2=fopen("rank.data","r");
$data_info = file("rank.data");
foreach ( $data_info as $value){
	$pieces = explode(":",$value);
	$time[$pieces[0]] = $pieces[1];
	$mon[$pieces[0]] = $pieces[2];
	$sco[$pieces[0]] = $pieces[3];
	asort($sco,SORT_NUMERIC);
	$data_merge = array_merge_recursive($sco,$mon,$time); //$scoを基準にしないとスコア順にならない。
}

echo "<html><h1>日常英語表現Ranking</h1>";
echo "<table border=\"1\"><tr align=\"center\"><td width=\"100px\">ランキング</td><td width=\"200px\">ニックネーム</td><td width=\"100px\">時間</td>
      <td width=\"100px\">問題数</td><td width=\"100px\">スコア</td></tr>";

$pre=-1;
$interval = 0;
$prev=null;
$g = 0;
$val3 = null;
echo "スコアの小さい方がランキングが上位である。<br>";
echo "※　スコア　=　(時間)　×　(問題数)　で表すものとする。<br>";
// print_r($data_merge);
foreach ($data_merge as $key => $value){
	$hosi = null;
 if($g == 0){
        $i++;
        if(floatval($prev) == floatval($value[0])) {
            $i--;
            $val3 = $value[0];
            foreach($data_merge as $key2 => $value2){
                if(floatval($value[0]) == floatval($value2[0])){
                    $g++;

                }
            }
        }
    }
    else if($g !== 0) {
        if(floatval($val3) !== floatval($value[0])){
            $i += $g;
            $g = 0;
        }
    }
	$prev = $value[0];
	if($i == 1){
		$hosi = "★";
		}
	echo "<tr align=\"center\"><td>".$hosi.$i."位"."</td><td>" . $key . "</td><td>" . $value[2] . " 秒"."</td><td>" . $value[1] . "問" . "</td><td>" . $value[0] . "</td></tr>";
	//スコアを基準にしたため、スコアと時間表示を逆にすることで帳尻合わせできる。　
}
echo "</table></html>";
?>
