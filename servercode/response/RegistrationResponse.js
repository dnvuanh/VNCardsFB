// ====================================================================================================
//
// Cloud Code for RegistrationResponse, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
var player = Spark.getPlayer();
var InstantID = Spark.getData().scriptData.InstantID;
var Photo = Spark.getData().scriptData.Photo;

if (InstantID)
{
    player.setScriptData("InstantID", InstantID)
}

if (Photo)
{
    player.setScriptData("Photo", Photo);
}