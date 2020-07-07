const Status = require('../schema/models/status');
const { statusTransform } = require('../utils/myFonctions');


const Resolver = {
    // get all status
    status: async () => {
       try{
        const result = await Status.find();
        const tableauStatus = result.map( status => {
            return statusTransform(status);
        })
        return tableauStatus
       }catch(err){
           throw err;
       }
    },

    // find one by nom function
    findStatus : async (args) => {
       try{
            const grade = args.grade.trim();
            if(grade === undefined){
                throw new Error("le grade ne doit pas etre vide")
            }

            return statusTransform(await Status.findOne({grade: grade}));
            
       }catch(err){
        throw err;
    }
    } ,

    // create an status
    createStatus: async ({ grade }) => {
        try{
        
            if(grade === undefined)
                throw new Error("le grade ne doit pas etre vide")
            const g = grade.toUpperCase().trim();
                
            if(await Status.exists({grade: g}))
                throw new Error("ce status exists déja")

            const newStatus = await new Status({grade: g});
            const result = await newStatus.save()
            return statusTransform(result);

       }catch(err){
           throw err;
       }
    },

    // update status fonction
    updateStatus: async({id, grade}) => {
        try {
            const newStatus = {
                grade: grade.trim()
            }
            const reuslt = await Status.findById(id);
            if(reuslt){
                const update = await reuslt.updateOne(newStatus);
                console.log(update)
            }
            
            return id + " à été mise à jour avec succèss....";
        }catch(err){
            console.log(err)
            throw err;
        }
    },

    // delete status fonction
    deleteStatus: async ({id}) => {
        try {

            if(!await Status.exists({_id: id.trim() })){
                throw new Error("ce status est inconnu");
            }

            await Status.deleteOne({ _id: id.trim() })
            return "Suppression réussit ! ";
        }catch(err){
            throw err;
        }
    },

    // An function to init status
    initStatus: async () => {
        try{
            const init = [
                {id: 1, grade: "AGENT"},
                {id: 2, grade: "CHEF DIVISION"},
                {id: 3, grade: "GRH"},
            ]
            
            init.map(async (init) =>{
               if(!await Status.exists({grade: init.grade})){
                 const s = await new Status({ grade: init.grade })
                 await s.save();
               }
            })
            
            return "Status initialisé avec success...";
        }catch(err){
            throw err;
        }
    }
}

module.exports = Resolver;