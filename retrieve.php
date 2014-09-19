<?
header("content-type:application/json");
$url=parse_url(getenv("CLEARDB_DATABASE_URL"));

    $server = $url["host"];
    $username = $url["user"];
    $password = $url["pass"];
    $db = substr($url["path"],1);

    
$link=mysqli_connect($server, $username, $password);
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
mysqli_select_db($link, $db);

$query1 = "SELECT AVG(WaitTime) FROM PostOffice WHERE TIMESTAMPDIFF(MINUTE, Submitted, NOW()) < 15";
$result1 = mysqli_query($link, $query1);
if(!$result1){
    mysqli_error($link);
}
$return1 = mysqli_fetch_row($result1);

$query2 = "SELECT * FROM PostOffice WHERE TIMESTAMPDIFF(DAY, Submitted, NOW()) <= 2 ORDER BY UnixTime DESC LIMIT 7";
$result2=mysqli_query($link, $query2);
if(!$result2){
    mysqli_error($link);
}
$return2= mysqli_fetch_all($result2, MYSQLI_ASSOC);

$returnarray = array_merge($return1, $return2);

echo json_encode($returnarray);

mysqli_close($link);
?>