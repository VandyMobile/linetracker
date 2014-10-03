<?
$waittime=$_POST["waittime"];
if($waittime >= 0 or $waittime <= 90)
{
    $unixtime=time();
    ini_set('display_errors', 1);
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

    $query = "INSERT INTO PostOffice VALUES ($unixtime, null, $waittime)";
    $result=mysqli_query($link, $query);
    if(!$result){
        mysqli_error($link);
    }else{
        echo "Done.";
    }
    mysqli_close($link);
}
?>