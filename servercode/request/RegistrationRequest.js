// ====================================================================================================
//
// Cloud Code for RegistrationRequest, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
var InstantID = Spark.getData().scriptData.InstantID;
var Photo = Spark.getData().scriptData.Photo;

Spark.setScriptData("InstantID", InstantID);
Spark.setScriptData("Photo", Photo);
