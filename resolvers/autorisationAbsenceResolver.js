const AutorisationAbsence = require('../schema/models/autorizationAbsence');
const { autorisationAbsenceTransform } = require('../utils/myFonctions');
const TypeAbsence = require('../schema/models/typeAbsence');
const Agent = require('../schema/models/agent');

const Resolver = {
    // get all AutorisationAbsence
    autorisationAbsences: async () => {
       try{
        const result = await AutorisationAbsence.find();
        const tableAutorisationAbsence = result.map( autorisationAbsence => {
            return autorisationAbsenceTransform(autorisationAbsence);
        })
        return tableAutorisationAbsence
       }catch(err){
           throw err;
       }
    },

    // find one AutorisationAbsence
    findAutorisationAbsence: async ({ id }) => {
       try{
            if(id === undefined ) 
                throw new Error("Vous devez remplire le champ")
            
            return autorisationAbsenceTransform(await AutorisationAbsence.findById(id));
            
       }catch(err){
        throw err;
        }
    } ,

    // create an AutorisationAbsence
    createAutorisationAbsence: async ({ input }) => {
        try{
            let myCommentaire = input.commentaire;
            
            if(input.commentaire === undefined)
                myCommentaire = "pas de commentaire"

            if(input.dateDebut === undefined ||
                input.dateFin === undefined || 
                input.agentId === undefined ||
                input.typeAutorisationAbsenceId === undefined )
                { throw new Error("vous devez remplire tous les champs")}
                
            // find agent 
            if(!await Agent.exists({_id: input.agentId}))
                throw new Error("cet agent n'exist pas ");

            if(!await TypeAutorisationAbsence.exists({_id: input.typeAutorisationAbsenceId }))
                throw new Error("Ce type de AutorisationAbsence n'exist pas ")
             
            const agentObject = await Agent.findById(input.agentId);
            const typeAbsenceObject = await TypeAbsence.findById(input.typeAbsence);

            
            if(input.dateDebut > input.dateFin)
                throw new Error("Votre date du debut du congé ne doit pas depasser votre date de fin de congé")
                
            // check if this AutorisationAbsence has been already taken
            if(await AutorisationAbsence.exists({ 
                dateDebut: new Date(input.dateDebut), 
                dateFin: new Date(input.dateFin) , 
                agent: agentObject._doc._id })){
                throw new Error("Vous avez déja demander une autorisation d'absence en cette date ")
            }
            
                // if is right,
            const AutorisationAbsenceObject = await new AutorisationAbsence({
                dateDebut: new Date(input.dateDebut),
                dateFin: new Date(input.dateFin),
                commentaire: myCommentaire,
                agent: agentObject,
                typeAutorisationAbsence: typeAbsenceObject

            }) 
            // save congé
            const resultAutorisationAbsence = await AutorisationAbsenceObject.save();

            // update agent and typeAutorisationAbsence
            await agentObject.updateOne({autorisationAbsences: [...agentObject._doc.autorisationAbsences , resultAutorisationAbsence ]})
            await typeAbsenceObject.updateOne({ autorisationAbsences: [...typeAbsenceObject._doc.autorisationAbsences ,resultAutorisationAbsence]})
            
            return AutorisationAbsenceTransform(resultAutorisationAbsence);

            }catch(err){
                console.log(err)
           throw err;
       }
    },

    // update type absence fonction
    updateAutorisationAbsence: async({ id , input }) => {
        try {
 
            const result = await AutorisationAbsence.findById(id);
            if(!result){
               throw new Error("cet AutorisationAbsence n'exist pas ")
            }
            const update = await result.updateOne({
                dateDebut: input.dateDebut,
                dateFin: input.dateFin,
                commentaire: input.commentaire,
                typeAbsence: result._doc.typeAbsence,
                agent: result._doc.agent,
            });
            console.log(update)
            return id + " à été mise à jour avec succèss....";
        }catch(err){
            console.log(err)
            throw err;
        }
    },

    // delete type Absence fonction
    deleteAutorisationAbsence: async ({id}) => {
        try {

            if(!await AutorisationAbsence.exists({_id: id.trim() })){
                throw new Error("ce AutorisationAbsence est inconnu");
            }

            await AutorisationAbsence.deleteOne({_id: id })
            return "Suppression réussit ! ";
        }catch(err){
            throw err;
        }
    },

}

module.exports = Resolver;