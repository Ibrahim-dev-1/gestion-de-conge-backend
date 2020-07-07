const TypeConge = require('../schema/models/typeConge');
const { typeCongeTransform } = require('../utils/myFonctions');


const Resolver = {
    // get all type conge
    typeConges: async () => {
       try{
        const result = await TypeConge.find();
        const tableTypeConge = result.map( typeConge => {
            return typeCongeTransform(typeConge);
        })
        return tableTypeConge
       }catch(err){
           throw err;
       }
    },

    // find one type conge by nom function
    findTypeConge : async ({ id }) => {
       try{
            if(id === undefined){
                throw new Error("le nom ne doit pas etre vide")
            }

            return typeCongeTransform(await TypeConge.findById(id));
            
       }catch(err){
        throw err;
    }
    } ,

    // create an type conge
    createTypeConge: async ({ input }) => {
        try{
        
            if(input.nom === undefined || input.nbrJrMax === undefined )
                throw new Error("le nom ou le nombre de jour maximum ne doit pas etre vide.")
                
            if(await TypeConge.exists({nom: input.nom.trim() }))
                throw new Error("ce Type de Congé exists déja")

            const newTypeConge = await new TypeConge({nom: input.nom.trim(), nbrJrMax: input.nbrJrMax});
            const result = await newTypeConge.save()
            return typeCongeTransform(result);

       }catch(err){
           throw err;
       }
    },

    // update type conge fonction
    updateTypeConge: async({ id , input }) => {
        try {
            const newTypeConge = {
                nom: input.nom.trim(),
                nbrJrMax: input.nbrJrMax
            }
            const reuslt = await TypeConge.findById(id);
            if(!reuslt){
               throw new Error("Ce type de congé n'exist pas ")
            }
            
            const update = await TypeConge.updateOne(newTypeConge);
            console.log(update)
            return id + " à été mise à jour avec succèss....";
        }catch(err){
            console.log(err)
            throw err;
        }
    },

    // delete type conge fonction
    deleteTypeConge: async ({id}) => {
        try {

            if(!await TypeConge.exists({_id: id.trim() })){
                throw new Error("ce congé est inconnu");
            }
            await TypeConge.deleteOne({ _id: id.trim() })
            return "Suppression réussit ! ";
        }catch(err){
            throw err;
        }
    },

}

module.exports = Resolver;