const TypeAbsence = require('../schema/models/typeAbsence');
const { typeAbsenceTransform } = require('../utils/myFonctions');


const Resolver = {
    // get all type Absence
    typeAbsences: async () => {
       try{
        const result = await TypeAbsence.find();
        const tableTypeAbsence = result.map( typeAbsence => {
            return typeAbsenceTransform(typeAbsence);
        })
        return tableTypeAbsence
       }catch(err){
           throw err;
       }
    },

    // find one type Absence by nom function
    findTypeAbsence : async ({nom}) => {
       try{
            if(nom === undefined){
                throw new Error("le nom ne doit pas etre vide")
            }

            return typeAbsenceTransform(await TypeAbsence.findOne({nom}));
            
       }catch(err){
        throw err;
        }
    } ,

    // create an typeAbsence
    createTypeAbsence: async ({ input }, req) => {
        try{
            if(!req.isAuth || !req.grade == "SUPERADMIN" || !req.grade == "GRH")
                throw new Error("Vous n'avez pas l'autorisation sur cette action! Veuillez contactez votre GRH ou l'ADMINISTRATEUR ");

        
            if(input.nom === undefined || input.nbrJrMax === undefined )
                throw new Error("le nom ou le nombre de jour maximum ne doit pas etre vide.")
                
            if(await TypeAbsence.exists({ nom: input.nom.trim() }))
                throw new Error("ce Type d'absence exists déja")

            const newTypeAbsence = await new TypeAbsence({nom: input.nom.trim(), nbrJrMax: input.nbrJrMax});
            const result = await newTypeAbsence.save()
            return typeAbsenceTransform(result);

       }catch(err){
           throw err;
       }
    },

    // update type absence fonction
    updateTypeAbsence: async({ id , input }, req) => {
        try {
            if(!req.isAuth || !req.grade == "SUPERADMIN" || !req.grade == "GRH")
                throw new Error("Vous n'avez pas l'autorisation sur cette action! Veuillez contactez votre GRH ou l'ADMINISTRATEUR ");

            const newTypeAbsence = {
                nom: input.nom.trim(),
                nbrJrMax: input.nbrJrMax
            }
            const reuslt = await TypeAbsence.findById(id);
            if(!reuslt){
               throw new Error("ce type d'absence n'exist pas ")
            }
            const update = await TypeAbsence.updateOne(newTypeAbsence);
            console.log(update)
            return id + " à été mise à jour avec succèss....";
        }catch(err){
            console.log(err)
            throw err;
        }
    },

    // delete type Absence fonction
    deleteTypeAbsence: async ({id}, req) => {
        try {

            if(!req.isAuth || !req.grade == "SUPERADMIN" || !req.grade == "GRH")
                throw new Error("Vous n'avez pas l'autorisation sur cette action! Veuillez contactez votre GRH ou l'ADMINISTRATEUR ");


            if(!await TypeAbsence.exists({_id: id.trim() })){
                throw new Error("ce Type d' Absence est inconnu");
            }

            await TypeAbsence.deleteOne({ _id: id.trim() })
            return "Suppression réussit ! ";
        }catch(err){
            throw err;
        }
    },

}

module.exports = Resolver;