const Conge = require('../schema/models/conge');
const { congeTransform, agentTransform } = require('../utils/myFonctions');
const TypeConge = require('../schema/models/typeConge');
const Agent = require('../schema/models/agent');
const Calendrier = require('../schema/models/calendrier');

const Resolver = {
    // get all conge
    conges: async ({}, req) => {
       try{
            if(!req.isAuth || req.grade !== "GRH" && req.grade !== "SUPERADMIN")
                throw new Error("Vous n'est pas authorizer . Veuillez contactez le GRH ou l'Administrateur")
           
            if(req.grade === "GRH") {
                const r = await Conge.find({isChefAuthorized: true });
                if(r.length > 0){

                    return r.map( conge => {
                        return congeTransform(conge);
                    })
                }
                return [];
            }

            const result = await Conge.find();
            if(result.length > 0){
                return result.map( conge => {
                    return congeTransform(conge);
                })
            }
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
    createConge: async ( {input} , req) => {
        try{
            
            if(!req.isAuth)
                throw new Error("Veuillez vous connectez avant de continuez ");

            if(input.dateDebut === undefined ||
                input.dateFin === undefined || 
                input.commentaire === undefined || 
                input.typeCongeId === undefined )
                { 
                    throw new Error("vous devez remplire tous les champs")}
                
            // find agent 
            if(!await Agent.exists({email: req.email }))
                throw new Error("cet agent n'exist pas ");

            if(!await TypeConge.exists({_id: input.typeCongeId }))
                throw new Error("Ce type de conge n'exist pas ")
             
            const agentObject = await Agent.findOne({email: req.email});
            const typeCongeObject = await TypeConge.findById(input.typeCongeId);

            
            /********************************************** */
            // check if agent who taking conge has calendar
            
            /********************************************** */
            if(agentObject._doc.calendrier === undefined)
            {
                throw new Error("Vous n'etes pas dans un calendrier . Veuillez contact le GRH ou l'administrateur pour vous intégrer ")
            }
            const calendrierObjet = await Calendrier.findById(agentObject._doc.calendrier)
            if(!calendrierObjet)
            throw new Error("le calendrier est inconnue")

            if(input.dateDebut > input.dateFin)
                throw new Error("Votre date du debut du congé ne doit pas depasser votre date de fin de congé")

            /** if agent has calendar , then check if is in time */
            if(new Date(calendrierObjet._doc.dateDebut) > new Date(input.dateDebut ))
                throw new Error("Votre date du debut n'est pas dans le calendrier fournis! : Vous devez demander un congé entre : " + calendrierObjet._doc.dateDebut + " et " + calendrierObjet._doc.dateFin);
                
            if(new Date(calendrierObjet._doc.dateFin) < new Date(input.dateFin))
                throw new Error("Votre date de fin n'est pas dans le calendrier fournis! : Vous devez demander un congé entre : " + calendrierObjet._doc.dateDebut + " et " + calendrierObjet._doc.dateFin);

            if(new Date().getFullYear() !== new Date(input.dateDebut).getFullYear() )
                throw new Error("Votre date du Debut n'est pas dans l'année courrante !: Vous devez demander un congé entre : " + calendrierObjet._doc.dateDebut + " et " + calendrierObjet._doc.dateFin);

            if(new Date().getMonth() > new Date(calendrierObjet._doc.dateFin).getMonth() )
                throw new Error("Votre mois n'est pas valid par rapport au calendrier forunis!: Vous devez demander un congé entre : " + calendrierObjet._doc.dateDebut + " et " + calendrierObjet._doc.dateFin);

                
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
                isChefAuthorized: false,
                status: "en Attente",
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
                throw err;
            }
    },
    setChefAuthorization: async ({id,authorized}) => {
        try {
            if(id === undefined)
                throw new Error("Veuillez fournir l'id du conge")
            if(authorized === undefined)
                throw new Error("Veillez fournir la valeur de l'authorization");
            
            const conge = await Conge.findById(id);
            if(!conge)
                throw new Error("Impossible de trouver ce conge ");
            await conge.updateOne({ isChefAuthorized: authorized });
            return "Authorization défini ";

        } catch (error) {
            throw error;
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
            return id + " à été mise à jour avec succèss....";
        }catch(err){
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

    // set status to conge 
    setStatus: async ({id,name}) => {
        try {
            if(name === undefined)
                throw new Error("Veuillez fournir un status au conge");
            if(id === undefined)
                throw new Error("Veuillez renseigner le conge que vous voulez modifier")

            const conge = await Conge.findById(id);
            if(!conge)
                throw new Error("ce conge n'exist pas ");
            
            await conge.updateOne({status: name }); 

            return "le status de la demande à été modifier avec success";

        } catch (error) {
            throw error;
        }
    },

    // find demande form chef division division
    findDemandeForEachAgentByDivision: async ({},req) => {
        try {
            if(!req.isAuth || req.grade !== "CHEF DIVISION" && req.grade !== "GRH" && req.grade !== "SUPER ADMIN")
                throw new Error("Vous n'etes pas autoriser à effectuer cette action" );

            let tableauDemandeConge = [];
            if(req.email === undefined)
                throw new Error("Veuillez s'il vous plait renseigner l'email du chef de division ");
            
            const agentDiv =  await Agent.findOne({email: req.email});
            if(!agentDiv)
                throw new Error("Impossible de trouver cet agent ");
            const listagentsDivision = await Agent.find({division: agentDiv.division._id });
            if(!listagentsDivision)
                throw new Error("Pas d'agent dans cette division");

            const demandesConges = await Conge.find({
                agent: {$in: listagentsDivision },
                isChefAuthorized: false,
            }) 
            console.log(demandesConges);
            if(demandesConges.length > 0){
                tableauDemandeConge = demandesConges.map(function(demande){
                    return congeTransform(demande);
                })
            }          
            return tableauDemandeConge;
        } catch (error) {
            throw error;
        }
    },

}

module.exports = Resolver;