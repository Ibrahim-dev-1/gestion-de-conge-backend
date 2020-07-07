const Agent = require('../schema/models/agent');
const { agentTransform } = require('../utils/myFonctions');
const Status = require('../schema/models/status');
const Division = require('../schema/models/division');
const Calendrier = require('../schema/models/calendrier');

const Resolver = {
    // get all agent
    agents: async () => {
       try{
        const result = await Agent.find();
        const tableAgent = result.map( agent => {
            return agentTransform(agent);
        })
        return tableAgent
       }catch(err){
           throw err;
       }
    },

    // find one type Absence by nom function
    findAgent: async ({ id }) => {
       try{
            if(id === undefined){
                throw new Error("le id ne doit pas etre vide")
            }

            return agentTransform(await Agent.findById(id));
            
       }catch(err){
        throw err;
        }
    } ,

    // create an Agent
    createAgent: async ({ input }) => {
        try{
        
            if(input.nom === undefined || input.prenom === undefined ||
                input.email === undefined || input.fonction === undefined ||
                input.situationMatrimoniale === undefined || input.sexe === undefined ||
                input.telephone === undefined || input.dateNaissance === undefined ||
                input.dateEmbauche === undefined ){
                throw new Error("Vous devez remplire tous les champs!");
            }
            
            if(input.statusId === undefined)
                throw new Error("Veuillez entrez l'id du status ou veuillez en créer un nouveau ...")

            if(input.divisionId === undefined)
                throw new Error("Veuillez entrez l'id de la division ou veuillez en créer une nouvelle ...")
    
            // verification des objets  
            if(!await Status.exists({_id: input.statusId}))
                throw new Error("Ce status est inconnu")
            
            // vérification de l'existance
            if(!await Division.exists({_id: input.divisionId}))
                throw new Error("Cette division est inconnu")
                
            const divisionObject = await Division.findById(input.divisionId);
            const statusObject = await Status.findById(input.statusId);
                
            if(await Agent.exists({ nom: input.nom.trim() , prenom: input.prenom }))
                throw new Error("Cet agent exist déja ")

            if(await Agent.exists({ email: input.email }))
                throw new Error("Cet email est déja utiliser par un agent! ");

            const newAgent = await new Agent({
                nom: input.nom,
                prenom: input.prenom,
                email: input.email,
                fonction: input.fonction,
                situationMatrimoniale: input.situationMatrimoniale,
                sexe: input.sexe,
                telephone: input.telephone,
                dateNaissance: input.dateNaissance,
                dateEmbauche: input.dateEmbauche,
                status: statusObject,
                division: divisionObject
            });
            const result = await newAgent.save()

            // mise à jour automatique des divisions et des status
            await divisionObject.updateOne({ agents: [...divisionObject._doc.agents, result]})
            await statusObject.updateOne({ agents: [...statusObject._doc.agents, result]})
            return  agentTransform(result);

       }catch(err){
           throw err;
       }
    },

    // update type absence fonction
    updateAgent: async({ id , input }) => {
        try {
            
            const reuslt = await Agent.findById(id);
            if(!reuslt){
               throw new Error("cet Agent n'exist pas ")
            }
            const DivisionObject = await Division.findById(input.divisionId);
            const StatusObject = await Status.findById(input.statusId);
            const update = await Agent.updateOne({
                nom: input.nom,
                prenom: input.prenom,
                email: input.email,
                fonction: input.fonction,
                situationMatrimoniale: input.situationMatrimoniale,
                sexe: input.sexe,
                telephone: input.telephone,
                dateNaissance: input.dateNaissance,
                dateEmbauche: input.dateEmbauche,
                status: StatusObject,
                division: DivisionObject
            });
            console.log(update)
            return id + " à été mise à jour avec succèss....";
        }catch(err){
            console.log(err)
            throw err;
        }
    },

    // delete type Absence fonction
    deleteAgent: async ({id}) => {
        try {

            if(!await Agent.exists({_id: id.trim() })){
                throw new Error("cet Agent est inconnu");
            }

            await Agent.deleteOne({_id: id.trim() })
            return "Suppression réussit ! ";
        }catch(err){
            throw err;
        }
    },

    // add  a agent to calendar
    setCalendrier: async ({ idAgent, idCalendrier }) => {
        try{
            if(idAgent === undefined || idCalendrier === undefined)
                throw new Error("vous devez remplire tous les champs")
            
            if(!await Agent.exists({ _id: idAgent }))
                throw new Error("Cet agent n'exist pas. Veuillez vous enrégistrer ou entrez un bon code ID")
            if(!await Calendrier.exists({ _id: idCalendrier }))
                throw new Error("cette calendrier n'exists pas . Veuillez l'enrégistrer ")
            
            

            const age = await Agent.findById(idAgent);
            const cal = await Calendrier.findById(idCalendrier);

           
            await age.updateOne({ calendrier: cal }); 
            await cal.updateOne({agents: [...cal._doc.agents, age]})

            return agentTransform(age);

            }catch(err){
            console.log(err)
            throw err;
        }
    },

}

module.exports = Resolver;