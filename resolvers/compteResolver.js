const Compte = require("../schema/models/compte");
const {compteTransform} = require("../utils/myFonctions")
const Agent = require("../schema/models/agent");
const Status = require("../schema/models/status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
    comptes: async () => {
        try{
            const result = await Compte.find();
            const tabCompte = result.map( com => {
                return compteTransform(com);
            })
            return tabCompte;
        }catch(err){
            throw err;  
        }
    },
    login: async ({email,password}) => {
        try{
            if(email === undefined)
                throw new Error("veuillez entrez votre adress email ");
            const cpt = await Compte.findOne({ email });
            if(!cpt)
                throw new Error("Cet Utilisateur n'exist pas ");
            
            const agent = await Agent.findOne({email});
            if(!agent)
               throw new Error("agent existant");
            
            const status = await Status.findById(agent._doc.status)   

            const isVerified = await bcrypt.compare(password, cpt.password);
            console.log(isVerified);

            if(!isVerified)
                throw new Error("le mot de passe entrez est incorrect");
            
            // génération du token 
            const token = jwt.sign({
                userId: agent._doc.id,
                email: cpt.email,
                isCountLock: cpt.isCountLock,
                grade: status.grade
            }, "gestiondecongebosse",{ expiresIn: "1h" });
            console.log("le token : "+ token);

            return {
                userId: agent._doc._id,
                token:token,
                expirationToken: 1
            }

        }catch(err){
            throw err;
        }
    },

    createCompte: async ({input}) => {
        try{
            const email = input.email.trim();
            const password = input.password.trim();
            const isCountLock = input.isCountLock.trim();

            if(email === undefined)
                throw new Error("l' Email ne doit pas etre vide")
            if(password === undefined)
                throw new Error("le Mot de passe ne doit pas etre vide")
            
            const agent = await Agent.findOne({ email });
            if(!agent)
                throw new Error("Votre adresse email n'est pas valide. Veuillez utiliser votre adresse email professionnel")

            if(await Compte.exists({email}))
                throw new Error("ce Compte exists déja")

            const passwordCrypter = bcrypt.hash(password, 13);
            const newCompte = await new Compte({email,password: passwordCrypter, agent});
            const resultSave = await newCompte.save();
            return compteTransform(resultSave);

       }catch(err){
           throw err;
       }
    },
    deleteCompte : async ({id}) => {
        try {
            if(!await Compte.exists({_id: id.trim()}) ){
                throw new Error("ce compte est inconnu");
            }
            await Compte.remove({_id: id})
            return "Suppression réussit ! ";
        }catch(err){
            throw err;
        }
    }
}