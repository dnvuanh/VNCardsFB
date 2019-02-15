var challengeId = Spark.getPlayer().getScriptData("ChallengeId");
if(challengeId !== null) {
    Spark.getChallenge(challengeId).removePlayer(Spark.getPlayer().getPlayerId());
    Spark.getPlayer().removeScriptData("ChallengeId");
    Spark.setScriptData("Exit challenge", 0);
}