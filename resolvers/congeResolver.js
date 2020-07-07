const Conge = require('../schema/models/conge');
const { congeTransform } = require('../utils/myFonctions');
const TypeConge = require('../schema/models/typeConge');
const Agent = require('../schema/models/agent');
const Calendrier = require('../schema/models/calendrier');

const Resolver = {
    // get all conge
    conges: async () => {
       try{
        const result = await Conge.find();
        const tableConge = result.map( conge => {
            return congeTransform(conge);
        })
        return tableConge
       }catch(err){
           throw err;
       }
    },

    // find one conge
    findConge: async ({ id }) => {
       try{
            if(id === undefined ) 
                throw new Error("Vous devez remplire le champ")
            
            return congeTransform(await Conge.findById(id));
            
       }catch(err){
        throw err;
        }
    } ,

    // create an conge
    createConge: async ( {input} ) => {
        try{
            
            if(input.dateDebut === undefined ||
                input.dateFin === undefined || 
                input.commentaire === undefined || 
                input.agentId === undefined ||
                input.typeCongeId === undefined )
                { 
                    throw new Error("vous devez remplire tous les champs")}
                
            // find agent 
            if(!await Agent.exists({_id: input.agentId}))
                throw new Error("cet agent n'exist pas ");

            if(!await TypeConge.exists({_id: input.typeCongeId }))
                throw new Error("Ce type de conge n'exist pas ")
             
            const agentObject = await Agent.findById(input.agentId);
            const typeCongeObject = await TypeConge.findById(input.typeCongeId);

            
            /********************************************** */
            // check if agent who taking conge has calendar
            
            /********************************************** */
            if(agentObject._doc.calendrier === undefined)
            {
                console.log(agentObject._doc.nom + " n'a pas de calendrier")
                throw new Error("Vous n'etes pas dans un calendrier . Veuillez contact le GRH ou l'administrateur pour vous intégrer ")
            }
            const calendrierObjet = await Calendrier.findById(agentObject._doc.calendrier)
            if(!calendrierObjet)
            throw new Error("le calendrier est inconnue")

            if(input.dateDebut > input.dateFin)
                throw new Error("Votre date du debut du congé ne doit pas depasser votre date de fin de congé")

            /** if agent has calendar , then check if is in time */
            if(new Date(calendrierObjet._doc.dateDebut) > new Date(input.dateDebut )
                || new Date(calendrierObjet._doc.dateFin) < new Date(input.dateFin) ||
                new Date().getFullYear() !== new Date(input.dateDebut).getFullYear()
            )
                {
                    throw new Error("Vous devez demander un conge entre les dates: "+ 
                    calendrierObjet._doc.dateDebut + " et " + calendrierObjet._doc.dateFin)
                }
                
            // check if this conge has been already taken
            if(await Conge.exists({ 
                dateDebut: new Date(input.dateDebut), 
                dateFin: new Date(input.dateFin) , 
                agent: agentObject._doc._id })){
                throw new Error("Vous avez déja demander un congé en cette date ")
            }
            
                // if is right,
            const congeObject = await new Conge({
                dateDebut: new Date(input.dateDebut),
                dateFin: new Date(input.dateFin),
                commentaire: input.commentaire,
                agent: agentObject,
                typeConge: typeCongeObject
            }) 
            // save congé
            const resultConge = await congeObject.save();

            // update agent and typeconge
            await agentObject.updateOne({conges: [...agentObject._doc.conges , resultConge ]})
            await typeCongeObject.updateOne({conges: [...typeCongeObject._doc.conges ,resultConge]})
            
            return congeTransform(resultConge);

            }catch(err){
                console.log(err)
           throw err;
       }
    },

    // update type absence fonction
    updateConge: async({ id , input }) => {
        try {
 
            const result = await Conge.findById(id);
            if(!result){
               throw new Error("cet conge n'exist pas ")
            }
            const update = await result.updateOne({
                dateDebut: input.dateDebut,
                dateFin: input.dateFin,
                commentaire: input.commentaire,
                typeConge: result._doc.typeConge,
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
    deleteConge: async ({id}) => {
        try {

            if(!await Conge.exists({_id: id.trim() })){
                throw new Error("ce conge est inconnu");
            }

            await Conge.deleteOne({_id: id })
            return "Suppression réussit ! ";
        }catch(err){
            throw err;
        }
    },

}

module.exports = Resolver;