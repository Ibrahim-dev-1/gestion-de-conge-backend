const Calendrier = require('../schema/models/calendrier');
const { calendrierTransform } = require('../utils/myFonctions');
const { findById } = require('../schema/models/calendrier');
const Agent = require('../schema/models/agent');


const Resolver = {
    // get all type Absence
    calendriers: async () => {
       try{
        const result = await Calendrier.find();
        const tableCalendrier = result.map( calendrier => {
            return calendrierTransform(calendrier);
        })
        return tableCalendrier
       }catch(err){
           throw err;
       }
    },

    // find one calendrier by dateDebut and dateFin function
    findCalendrier : async ({dateDebut, dateFin }) => {
       try{
            if(dateDebut === undefined || dateFin === undefined){
                throw new Error("les dates de  ne doivent pas etres vident")
            }

            return calendrierTransform(await Calendrier.findOne({dateDebut,dateFin}));
            
       }catch(err){
        throw err;
        }
    } ,

    // create an calendrier
    createCalendrier: async ({ input }) => {
        try{
            if(input.dateDebut === undefined || input.dateFin === undefined)
                throw new Error("Veuillez entrez une date du debut ou une date de fin pour le calendrier")
        
            const dateDebut = new Date(input.dateDebut)
            const dateFin = new Date(input.dateFin)
            
            if(Date.now() > dateDebut )
                throw new Error("la date ou le moi ou le jour Choisi doit ètre dans l'Année courrant au dans l'année futur ")

            if( dateDebut >= dateFin)
                throw new Error("La date du debut ne peut pas dépasser ou etre égale à  la date de fin ")
            
            if(await Calendrier.exists({dateDebut: dateDebut , dateFin }))
                throw new Error("Ce calendrier exist déja ")
            
            const newCalendrier = await new Calendrier({ dateDebut, dateFin, nbrJr: 31 })
            const result = await newCalendrier.save()
            return calendrierTransform(result);

       }catch(err){
           throw err;
       }
    },

    // update Calendrier fonction
    updateCalendrier: async({ id , input }) => {
        try {
            const newCalendrier = {
                nom: input.nom.trim(),
                nbrJrMax: 31
            }
            const reuslt = await Calendrier.findById(id);
            if(!reuslt){
               throw new Error("ce type d'absence n'exist pas ")
            }
            const update = await Calendrier.updateOne(newCalendrier);
            console.log(update)
            return id + " à été mise à jour avec succèss....";
        }catch(err){
            console.log(err)
            throw err;
        }
    },

    // delete Calendrier fonction
    deleteCalendrier: async ({id}) => {
        try {

            if(!await Calendrier.exists({_id: id.trim() })){
                throw new Error("ce Calendrier est inconnu");
            }

            await Calendrier.deleteOne({ _id: id.trim() })
            return "Suppression réussit ! ";
        }catch(err){
            throw err;
        }
    },

    // add agents to calendrier
    addAgents: async ({calendrierId, agents }, req) => {
        try {
            if(!req.isAuth)
                throw new Error("Vous n'est pas connectez . veuillez vous connectez")
            if(calendrierId === undefined || agents.length === 0)
                throw new Error("Vous devez renseigner l'id du calendrier et la liste des agents");
            
            const calendrier = await Calendrier.findById(calendrierId);
            if(!calendrier)
                throw new Error("Cette calendrier est inconnue ou n'a pas encore été créée");

            // mise à jour des agents avec le id du calendrier
            if(agents.length > 0){
                agents.map(function(agentElement){
                    Agent.findById(agentElement).then(function(eachAgent){
                        return eachAgent.updateOne({calendrier: calendrierId}).catch(function(err){throw err;})
                    }).catch(function(err){
                        throw err;
                    });
                   
                })
            }
            const response = await calendrier.updateOne({agents:[...calendrier._doc.agents, ...agents]});
            return "Ajout réuissit..";
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

module.exports = Resolver;