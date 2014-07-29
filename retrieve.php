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

$query = "SELECT * FROM PostOffice WHERE TIMESTAMPDIFF(WEEK, Submitted, NOW()) <= 1 LIMIT 10";
$result=mysqli_query($link, $query);
if(!$result){
    mysqli_error($link);
}

$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode($data);

mysqli_close($link);
?>