<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Music of the past in the future!">
    <meta name="author" content="Kieran Sroka">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    <link rel="stylesheet" href="styles.css">
    <title>Music Online</title>
    <?php
        //Checks what button has been pressed
        if (isset($_GET['viewAll'])){
            require('includes/dbconx.php');
            $sql = mysqli_query($con, "SELECT * FROM MUSIC ORDER BY artist");
        }else{
        $musicQuery = $_GET['musicQuery']; //store form data

        //check if variable data sent is NULL or empty - no value has been sent

        if(isset($musicQuery) && !empty($musicQuery)){
            //connect to databse if data has been sent

            require('includes/dbconx.php');

            //escape all special characters in search string - remove special characters and clean up string

            $searchq = mysqli_real_escape_string($con, $musicQuery);

            //sql statement that pulls data from all columns in database other than id or play. Then atempts to sort by "best match"

            $sql = mysqli_query($con, "SELECT * FROM music WHERE CONCAT_WS(' ', `artist`, `album`, `year`, `genre`) LIKE '%$searchq%' OR `recordLabel` LIKE '>%$searchq%' ORDER BY
            CASE
              WHEN artist LIKE '$searchq%' THEN 1
              WHEN artist LIKE '%$searchq' THEN 3
              WHEN artist like '$searchq' THEN 0
              ELSE 2
            END");
            //if no data is sent then display a user message and provide a link back to search page
        }
            else{
                echo("<p class='text-center'>Please enter the name of an artist, an album name, the year a song was released or a record label and try again!</p> ");

                //die() function prevents any further PHP processing and terminates the dbase connection

                die ('<p class="text-center"><a href="index.html">Search Again</a></p>');
            }
        }
    ?>
</head>

<body>
    <!--Start of header-->
    <header>
        <!--Navbar-->
        <nav class="navbar navbar-expand-lg navbar-dark pe-5 sticky-top" id="main-nav">
            <!--Nav logo-->
            <a class="navbar-brand" href="index.html"><img id="logo" src="images/logo.svg" alt="Music Online Logo"></a>
            <button class="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <h1 class="text-white h-6 pe-1">Music Online</h1>
                <ul class="navbar-nav ms-auto">
                    <!--Nav links - right-->
                    <li class="nav-item ps-2" id="first-nav-link">
                        <a class="nav-link active" aria-current="page" href="index.html">HOME</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#w95-home">SEARCH</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <main>
        <!-- Jumbo at top of page -->
        <div class="jumbotron jumbotron-fluid" id="#home">
            <!-- Logo with traingle at top -->
            <div id="main-logo"></div>
        </div>
        <!-- Lower part of page -->
        <div id="w95-home">
            <!-- Pink overlay -->
            <div id="overlay"></div>
            <!-- Container with windows icons and IE window -->
            <div class="container ms-0 me-0" id="icon-contain">
                <!-- Row with my comp, paint, and IE box -->
                <div class="row pt-4">
                    <!-- My comp -->
                    <div class="col text-center fixed-icon-col">
                        <img class="icons-95" src="images/mycomp.png" alt="my computer icon">
                        <p class="icons-95-txt">My Computer</p>
                    </div>
                    <!-- Paint -->
                    <div class="col ps-5 text-center fixed-icon-col">
                        <img class="icons-95" src="images/paint.png" alt="paint icon">
                        <p class="icons-95-txt ps-1">Paint</p>
                    </div>
                    <!-- ~~~~~~IE box start~~~~~ -->

                    <div class="col" id="ie-col">
                        <div id="ie-box">
                            <!-- Top bar on IE box -->
                            <div class="row align-items-center" id="ie-top">
                                <div class="col col-sm-8">
                                    <p class="mb-0">Internet Explorer</p>
                                </div>
                                <div class="col col-sm-4 text-end">
                                    <img src="images/ie-top-btns.png" id="min-icons" alt="">
                                </div>
                            </div>
                            <!-- File bar on IE box -->
                            <div class="row pt-1 align-items-center" id="ie-file">
                                <div class="col">
                                    <ul class="list-group list-group-horizontal" id="ie-file-list">
                                        <li class="pe-3">File</li>
                                        <li class="pe-3">Edit</li>
                                        <li class="pe-3">View</li>
                                        <li class="pe-3">Go</li>
                                        <li class="pe-3">Favourites</li>
                                        <li id="help-icon">Help</li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Bar with back button on IE box -->
                            <div class="row pt-1" id="ie-back">
                                <div class="col text-center fixed-size-sm">
                                    <img src="images/back.png" class="back-icons" alt="">
                                    <p>Back</p>
                                </div>
                                <div class="col text-center fixed-size-sm">
                                    <img src="images/forward.png" class="back-icons" alt="">
                                    <p>Forward</p>
                                </div>
                                <div class="col text-center fixed-size-sm">
                                    <img src="images/stop.png" class="back-icons" alt="">
                                    <p>Stop</p>
                                </div>
                                <div class="col text-center fixed-size-sm">
                                    <img src="images/refresh.png" class="back-icons" alt="">
                                    <p>Refresh</p>
                                </div>
                                <div class="col text-center fixed-size-sm" id="ie-home-icon">
                                    <img src="images/home.png" class="back-icons" alt="">
                                    <p>Home</p>
                                </div>
                            </div>
                            <!-- Bar with address on IE box -->
                            <div class="row pt-2 flex-nowrap" id="ie-address">
                                <div class="col pt-1 address-fixed">
                                    <p>Address</p>
                                </div>
                                <div class="col" id="address-bar">
                                    <div class="row">
                                        <div class="col-11 pt-1 pe-0" id="address-bar-col">
                                            <p class="mb-0">http://www.musiconline.com</p>
                                        </div>
                                        <div class="col-1 ps-0 text-end pe-0">
                                            <img src="images/arrow.png" id="arrow-icon" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="col ps-0 text-end address-fixed" id="address-links">
                                    <p><img src="images/littlebar.png" class="pe-1" id="address-sep" alt="">Links</p>
                                </div>
                            </div>
                            <!-- Main area of IE box -->
                            <div class="row text-center" id="ie-main">
                                <div class="col">
                                    <img src="images/explore-music.svg" id="explore-music-online-img"
                                        alt="Explore Music Online, Search, Discover, Listen"><br>

                                    <div class="row">
                                        <div class="col d-flex justify-content-center">
                                            <?php
                                                //Checks if results were matched to search query, if not displays message to user
                                                if(mysqli_num_rows($sql) == 0){
                                                echo ("<p>No Matches Found</p>");
                                                die("<p><a href='index.html' class='ps-2'>Search Again</a></p>");
                                             }
                                             //Creates table to display results
                                             echo'<table class="table table-striped" id="music-table"><thead><tr>
                                                <th>Artist</th>
                                                <th>Album</th>
                                                <th class="me-3">Year</th>
                                                <th>Genre</th>
                                                <th>Label</th>
                                                <th>Play Song</th>
                                                </tr></thead><tbody>';

                                             while($row = mysqli_fetch_array($sql)){
                                                echo '<tr>';
                                                echo '<td>'.$row['artist'].'</td>'; 
                                                echo '<td>'.$row['album'].'</td>';
                                                echo '<td>'.$row['year'].'</td>';
                                                echo '<td>'.$row['genre'].'</td>';
                                                echo '<td>';
                                                echo "<a target='_blank' href=".'"https://'.$row['recordLabel'];
                                                echo '</td>';
                                                echo "<td>";
                                                echo'<button type="button" name="play-button" class="playBtn" id="'.$row['play'].'">Play</button>';
                                                echo "</td>";
                                                echo"</tr>";
                                               
                                        }
                                            echo '</tbody></table>';
                                           echo'';
                                            mysqli_close($con);
                                            ?>

                                        </div>
                                    </div>
                                    <!-- Search again button -->
                                </div><a href="index.html" class="mt-2 mb-2">Search Again</a>
                            </div>
                            <!-- Bottom bar on IE box -->
                            <div class="row" id="ie-bottom">
                                <div class="col ie-bottom-bars">
                                </div>
                                <div class="col-1 ie-bottom-bars" id="btm-bar-2">
                                </div>
                                <div class="col-1 ie-bottom-bars" id="btm-bar-3">
                                </div>
                                <div class="col-5 ie-bottom-bars">
                                    <p id="ie-bottom-txt"><img src="images/ie95.png" id="ie-bottom-logo" alt="">
                                        Internet Zone</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Neighbourhood Icon -->
                <div class="row pt-4">
                    <div class="col-1 text-center fixed-icon-col">
                        <img class="icons-95" src="images/networkneighborhood.png" alt="network neighborhood icon">
                        <p class="icons-95-txt">NetworkNeighborhood</p>
                    </div>
                </div>
                <!-- Mail Icon -->
                <div class="row pt-4">
                    <div class="col-1  text-center fixed-icon-col">
                        <img class="icons-95" src="images/mail.png" alt="mail icon">
                        <p class="icons-95-txt">Mail</p>
                    </div>
                </div>
                <!-- Recycle Icon -->
                <div class="row pt-4">
                    <div class="col-1  text-center fixed-icon-col">
                        <img class="icons-95" src="images/recycle.png" alt="recycle bin icon">
                        <p class="icons-95-txt">Recycle Bin</p>
                    </div>
                </div>
                <!-- IE Icon -->
                <div class="row pt-4">
                    <div class="col-1  text-center fixed-icon-col">
                        <img class="icons-95" src="images/ie95.png" alt="internet explorer icon">
                        <p class="icons-95-txt">Internet Explorer</p>
                    </div>
                </div>
                <!-- Briefcase logo -->
                <div class="row pt-4">
                    <div class="col-1  text-center fixed-icon-col">
                        <img class="icons-95" src="images/briefcase.png" alt="briefcase icon">
                        <p class="icons-95-txt">Briefcase</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </main>
    <!-- Start of footer -->
    <footer id="myFooter">
        <!-- Footer overlay -->
        <div id="foot-overlay"></div>
        <div class="container-fluid h-100">
            <div class="row h-100 align-items-start pt-1 flex-nowrap">
                <div class="col fixed-size">

                    <div class="btn-group dropup">
                        <!-- Dropup button -->
                        <button type="button" id="start" class="text-start pe-0" data-bs-toggle="dropdown"
                            aria-expanded="false"><img id="footer-logo" class="me-2 pb-2" alt="Music Online Logo"
                                src="images/logo.png">Start</button>
                        <div class="dropdown-menu text-center">
                            <ul class="ps-0">
                                <!-- Dropup button content -->
                                <li>Welcome to</li>
                                <li>V A P O R W A V E</li>
                                <li><img id="vapSun" src="images/vaporwave.png" alt=""></li>
                            </ul>
                            <button id="shutDown" class="ps-0 position-absolute bottom-0 start-0 ps-3">
                                <img class="menu-icons me-1" src="images/turnoff.png" alt="Shut Down Button">Sh<u>u</u>t
                                Down...
                            </button>
                        </div>
                    </div>


                    <!-- Facebook and twitter icons -->
                    <img src="images/otherlittlebar.png" class="foot-bars" alt="">
                    <img src="images/littlebar.png" class="foot-bars" alt="">
                    <a href="#"><img src="images/facebook.png" class="foot-bars"
                            alt="Link to music online facebook"></a>
                    <a href="#"><img src="images/twitter.png" class="foot-bars" alt="Link to music online twitter"></a>
                    <img src="images/littlebar.png" class="foot-bars" alt="">
                    <img src="images/otherlittlebar.png " class="foot-bars" alt="">

                </div>
                <div class="col text-end">
                    <div class="row align-items-center">
                        <div class="col">
                            <div class="row align-items-center">
                                <!-- Audio controls -->
                                <div class="col d-flex justify-content-start ps-0" id="audio">
                                </div>
                                <div class="col text-end pe-0" id="end-col">
                                    <img src="images/otherlittlebar.png" class="foot-bars" id="foot-end-bar" alt="">
                                </div>
                            </div>
                        </div>
                        <!-- Time in bottom right -->
                        <div class="col fixed-size-sm text-start ps-3">
                            <p class="mb-0 ps-1 pt-1" id="time"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"
        integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js"
        integrity="sha384-Atwg2Pkwv9vp0ygtn1JAojH0nYbwNJLPhwyoVbhoPwBhjQPR5VtM2+xf0Uwh9KtT" crossorigin="anonymous">
    </script>
    <script type="text/javascript" src="script.js"></script>
</body>

</html>