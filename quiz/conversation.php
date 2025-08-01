<?php
$i=0;
$a = $_GET['name'];
$b = $_GET['time'];
if(($a != "")&&($b != "")){
$w = $a.":".$b."\n";
}
$file = fopen("rank_con.data","a");
fwrite($file,$w);
fclose($file);
// $file2=fopen("rank.data","r");
$data_info = file("rank_con.data");
foreach ( $data_info as $value){
	$pieces = explode(":",$value);
	$time[$pieces[0]] = $pieces[1];
}
asort($time,SORT_NUMERIC);
echo "<html><h1>会話表現Ranking</h1>";
echo "<table border=\"1\" width=\"400px\"><tr align=\"center\"><td width=\"100px\">ランキング</td><td>ニックネーム</td><td width=\"100px\">時間</td></tr>";

$pre=-1;
$interval = 0;
$prev=null;
$val3 = null;
$g = 0;
// print_r($time);
foreach ($time as $key => $value){
	// $g=count($time);
	// if($value[$i] == $value[$i+1]){
	//   $i=$i-1;
	//  }
	$hosi = null;
	if($g == 0){
		$i++;
		if(floatval($prev) == floatval($value)) {
            $i--;
			$val3 = $value;
			foreach($time as $key2 => $value2){
				if(floatval($value) == floatval($value2)){
					$g++;

				}
			}
		}
	}
	else if($g !== 0) {
		if(floatval($val3) !== floatval($value)){
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
