<?php


/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

/**
 * Step 2: Instantiate a Slim application
 *
 * This example instantiates a Slim application using
 * its default settings. However, you will usually configure
 * your Slim application now by passing an associative array
 * of setting names and values into the application constructor.
 */
$app = new \Slim\Slim();

/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, `Slim::patch`, and `Slim::delete`
 * is an anonymous function.
 */

$app->post('/save',  'saveMeeting');
$app->get('/get/:userId/:meetingId',  'getMeeting');
$app->get('/get/:userId',  'getMeetings');
$app->get('/get',  function () {
    echo "We need a user ID";
});
//$app->delete('/event/:userId/:meetingId',  'deleteMeeting');
    $app->get('/event/delete/:userId/:meetingId',  'deleteMeeting');
//$app->put('/event/:userId/:meetingId/:meetSeconds',  'updateMeeting');
    $app->get('/event/update/:userId/:meetingId/:meetSeconds',  'updateMeeting');
//$app->put('/event/favourite/:userId/:meetingId/:favourite',  'updateFavourite');
    $app->get('/event/favourite/:userId/:meetingId/:favourite',  'updateFavourite');


$app->get('/', function () {
        echo "Esta p&aacute;gina no existe. Es la parte back de la app Meeting cost";
    });

function getMeetings($userId) {
    //sleep(6);
    $sql = "SELECT * FROM meetings WHERE owner='".$userId."' ORDER BY meetDate DESC";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);

        $allRecords = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        $db = getConnection();
        $sql = "SELECT * FROM rateperiods";
        $stmt = $db->query($sql);
        $periods = $stmt->fetchAll(PDO::FETCH_OBJ);

        if( count($allRecords) > 0 ) {
            echo '{"meetings": ' . json_encode($allRecords) . ', "ratePeriods": ' . json_encode($periods) . '}';
        } else {
            echo '{"error":{"code": "userWithNoMeeting", "text": "You don\'t have meetings yet"}}';
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updateMeeting($userId, $meetingId, $meetSeconds) {
    //sleep(6);

    $currentMoment = date("Y")."-".date("m")."-".date("d")." ".date("H").":".date("i").":".date("s");
    $sql = "UPDATE meetings SET meetSeconds=:meetSeconds, meetDate=:currentMoment  WHERE owner=:userId and id=:meetingId";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("meetSeconds", $meetSeconds);
        $stmt->bindParam("userId", $userId);
        $stmt->bindParam("meetingId", $meetingId);
        $stmt->bindParam("currentMoment", $currentMoment);
        $stmt->execute();
        $db = null;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updateFavourite($userId, $meetingId, $favourite) {
    //sleep(6);
    $sql = "UPDATE meetings SET favourite=:favourite  WHERE owner=:userId and id=:meetingId";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("favourite", $favourite);
        $stmt->bindParam("userId", $userId);
        $stmt->bindParam("meetingId", $meetingId);
        $stmt->execute();
        $db = null;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getMeeting($userId, $meetingId) {
    //sleep(6);
    $sql = "SELECT * FROM meetings WHERE owner='".$userId."' and id='".$meetingId."'";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);

        $allRecords = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        $db = getConnection();
        $sql = "SELECT * FROM rateperiods";
        $stmt = $db->query($sql);
        $periods = $stmt->fetchAll(PDO::FETCH_OBJ);

        if( count($allRecords) > 0 ) {
            echo '{"meetings": ' . json_encode($allRecords) . ', "ratePeriods": ' . json_encode($periods) . '}';
        } else {
            echo '{"error":{"code": "meetingNoExists", "text": "This meeting doesn\'t exist"}}';
        }


    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function deleteMeeting($userId, $meetingId) {
    //sleep(6);
    $sql = "DELETE FROM meetings WHERE owner='".$userId."' and id='".$meetingId."'";
    try {
        $db = getConnection();
        //$stmt = $db->query($sql);
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db = null;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function saveMeeting() {
    //sleep(6);
    $app = new \Slim\Slim();

    $request = $app->request();
    //$postArray = $request->post();
    $postObject = json_decode($request->getBody());

    if ( !isset($postObject->id) ) {
        $postObject->id = '';
    }
    if ( !isset($postObject->attenders) || !isset($postObject->status) || !isset($postObject->owner) || !isset($postObject->averageRate) || !isset($postObject->ratePeriod) || !isset($postObject->estimatedSeconds) || !isset($postObject->meetSeconds) ) {
        echo '{"error":{"code": "EmptyFields", "text": "Some fields are empty"}}';
        exit();
    }
    $sql = "SELECT * FROM meetings WHERE id='".$postObject->id."'";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);

        $allRecords = $stmt->fetchAll(PDO::FETCH_OBJ);

        if( count($allRecords) > 0 ) {
            echo '{"error":{"code": "meetingAlreadyExists", "text": "This meeting cann\'t be created because it already exists", "result": '.json_encode($allRecords).'}}';
        } else {
            $currentMoment = date("Y")."-".date("m")."-".date("d")." ".date("H").":".date("i").":".date("s");

            $sql = $db->prepare("INSERT INTO meetings (id, owner, meetDate, attenders, status, averageRate, ratePeriod, estimatedSeconds, meetSeconds) VALUES (:id, :owner, :meetDate, :attenders, :status, :averageRate, :ratePeriod, :estimatedSeconds, :meetSeconds)");
                $sql->bindValue(':id', $postObject->id);
                $sql->bindValue(':owner', $postObject->owner);
                $sql->bindValue(':meetDate', $currentMoment);
                $sql->bindValue(':attenders', $postObject->attenders);
                $sql->bindValue(':status', $postObject->status);
                $sql->bindValue(':averageRate', $postObject->averageRate);
                $sql->bindValue(':ratePeriod', $postObject->ratePeriod);
                $sql->bindValue(':estimatedSeconds', $postObject->estimatedSeconds);
                $sql->bindValue(':meetSeconds', $postObject->meetSeconds);
            $sql->execute();

            echo '{"success":{"code": "newMeetingSaved", "text": "Meeting was successful saved"}}';
        }

        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function getConnection() {

    $myDBhost="localhost";
    $dbuser="meetcostuser";

    //$myDBhost = "95.85.47.138";
    //$dbuser = "meetcostuser";

    $dbpass = "Bf8xcFzLTMxympHH";
    $dbname = "meetcost";
    $dbh = new PDO("mysql:host=$myDBhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

$app->run();
?>