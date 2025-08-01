<?php
$i=0;
$a = $_GET['name'];
$b = $_GET['time'];
if(($a != "")&&($b != "")){
$w = $a.":".$b."\n";
}
$file = fopen("rank.data","a");
fwrite($file,$w);
fclose($file);
// $file2=fopen("rank.data","r");
$data_info = file("rank.data");
foreach ( $data_info as $value){
	$pieces = explode(":",$value);
	$time[$pieces[0]] = $pieces[1];
}
asort($time,SORT_NUMERIC);
echo "<html><h1>日常英語表現Ranking</h1>";
echo "<table border=\"1\" width=\"400px\"><tr align=\"center\"><td width=\"100px\">ランキング</td><td>ニックネーム</td><td width=\"100px\">時間</td></tr>";
print_r($time);
$g=0;
$val3 = null;
$prev=null;
foreach ($time as $key => $value){
	$hosi = null;
if($g == 0 ){
	$i--;
  $val3 = $value;
	foreach($time as $key2 => $value2){
	if(floatval($prev) == floatval($value)) {
		$g++;
	}
}
}
}
	else if($g !== 0){
		if(floatval($val3) == floatval($value)){
				$i += $g;
		    $g = 0;
	}
}
	$prev = $value;
	if($i == 1){
		$hosi = "★";
	}
	echo "<tr align=\"center\"><td>".$hosi.$i."位"."</td><td>" . $key . "</td><td>" . $value . " 秒"."</td></tr>";
}
echo "</table></html>";
?>
