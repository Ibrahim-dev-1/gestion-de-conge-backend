const {transform} = require('../utils/myFonctions');
const Div = require('../schema/models/division');
const Agent = require('../schema/models/agent')

const Resolver = {
    // get all divisions
    divisions: async ()=> {
       try{
        const result = await Div.find();
        const tableauStatus = result.map( div => {
            return transform(div);
        })
        return tableauStatus
       }catch(err){
           console.log(err)
           throw err;
       }
    },

    // find one by nom function
    findDivision : async (args) => {
       try{
            const nom = args.nom.trim();
            if(nom.trim() === undefined){
                throw new Error("le nom ne doit pas etre vide")
            }

            return transform(await Div.findOne({nom: nom}));
            
       }catch(err){
        throw err;
    }
    } ,

    // create an division
    createDivision: async (arg) => {
        try{
            const nom = arg.nom.trim();
            if(nom === undefined)
                throw new Error("le nom ne doit pas etre vide")


            if(await Div.exists({nom}))
                throw new Error("cet division exists déja")

            const newDivision = await new Div({nom});
            const resultSave = await newDivision.save();
            return transform(resultSave);

       }catch(err){
           throw err;
       }
    },

    // update on division
    updateDivision: async({id, input}) => {
        try {
            const newDivision = {
                nom: input.nom.trim()
            }
            const reuslt = await Div.findById(id);
            if(reuslt){
                const update = await reuslt.updateOne(newDivision);
            }
            
            return id + " à été mise à jour avec succèss....";
        }catch(err){
            console.log(err)
            throw err;
        }
    },

    // delete division
    deleteDivision: async ({id}) => {
        try {

            if(!await Div.exists({_id: id.trim()}) ){
                throw new Error("cette division est inconnu");
            }

            await Div.remove({_id: id.trim() })
            return "Suppression réussit ! ";
        }catch(err){
            throw err;
        }
    }
}

module.exports = Resolver;