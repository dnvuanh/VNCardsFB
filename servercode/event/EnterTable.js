var tableId = Spark.getData().TableID;
var gameId = Spark.getData().GameID;

//Find Challenge
var findChallengeRequest = new SparkRequests.FindChallengeRequest();
findChallengeRequest.accessType = "PUBLIC";
findChallengeRequest.shortCode = gameId;
findChallengeRequest.eligibility = { "segments" : { 
                                        "TableId" : tableId 
                                    }};
var findChallengeResponse = findChallengeRequest.Send();

if(findChallengeResponse.challengeInstances && findChallengeResponse.challengeInstances !== null){
    var challengeId = findChallengeResponse.challengeInstances[0].challengeId;
    Spark.setScriptData("Challenge FOUND", challengeId);

    //join to this challenge
    var joinChallengeRequest = new SparkRequests.JoinChallengeRequest();
    joinChallengeRequest.challengeInstanceId = challengeId;
    joinChallengeRequest.eligibility = { "segments" : {"TableId" : tableId}};
    var joinChallengeRespone = joinChallengeRequest.Send();
    Spark.getPlayer().setScriptData("ChallengeId", challengeId);
}
else if(Spark.getPlayer().getScriptData("ChallengeId") === null){
    Spark.setScriptData("No challenge was found! Create new Challenge", 0);
    var createChallengeRequest = new SparkRequests.CreateChallengeRequest();
    createChallengeRequest.accessType = "PUBLIC";
    createChallengeRequest.challengeShortCode = gameId;
    createChallengeRequest.eligibilityCriteria = { "segments" : {"TableId" : tableId}};
    createChallengeRequest.maxAttempts = 5;
    createChallengeRequest.minPlayers = 2;
    createChallengeRequest.maxPlayers = 4;
    var now = new Date();
    now.setHours(now.getHours() + 1);
    //no need -- createChallengeRequest.startTime = now.toISOString().substr(0,16) + "Z";
    createChallengeRequest.endTime = now.toISOString().substr(0,16) + "Z"; 
    createChallengeRequest.expiryTime = now.toISOString().substr(0,16) + "Z";
    var createChallengeResponse = createChallengeRequest.Send();
//    Spark.setScriptData("createChallengeRequest", createChallengeRequest);
    Spark.setScriptData("createChallengeResponse", createChallengeResponse);
    var challengeId = createChallengeResponse.challengeInstanceId;
    Spark.getPlayer().setScriptData("ChallengeId", challengeId);
}