const db = require('../config/dbConnection');
var objectId=require('mongodb').ObjectID

module.exports={

    isTeam:(teamId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('Teams').findOne({teamId:teamId}).then((teamData)=>{
                if(teamData){
                    isTeam=true
                    resolve(isTeam)
                }else{
                    isTeam=false
                    resolve(isTeam)
                }
            })
        })
    },

    addTeam:(data)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection('Teams').insertOne(data).then((data)=>{
                resolve(data.ops[0])
            })
        })
    },

    updateTeam:(teamId,teamDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('Teams')
            .updateOne({teamId:teamId},{
                $set:{
                    currentClue:teamDetails.currentClue,
                    passedAnswers:passedAnswers,
                    atTreasure:teamDetails.atTreasure,
                    treasureTime:teamDetails.treasureTime,
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    getTeamDetails:(teamId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('Teams').findOne({teamId:teamId}).then((teamData)=>{
                resolve(teamData)
            })
        })
    },

    getAllTeamData:()=>{
        return new Promise(async(resolve,reject)=>{
           let TeamData=await db.get().collection('Teams').find().toArray()
           resolve(TeamData)
        });
    },

    getOneTeamData:(teamId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('Teams').findOne({teamId:teamId}).then((teamData)=>{
                resolve(teamData);
            })
        })
    },
    getAllCluesFromDb: async () => {
        return await db.get().collection("Clues").find().toArray();
    }


}