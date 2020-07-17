const divisionResolver = require('../resolvers/divisionResolver');
const statusResolver = require('../resolvers/statusResolver');
const typeCongeResolver = require('../resolvers/typeCongeResolver');
const typeAbsenceResolver = require('../resolvers/typeAbsenceResolver');
const calendrierResolver = require('../resolvers/calendrierResolver');
const agentResolver = require('../resolvers/agentResolver');
const congeResolver = require('../resolvers/congeResolver');
const autorisationAbsenceResolver = require('../resolvers/autorisationAbsenceResolver');
const compteResolver = require('../resolvers/compteResolver');


module.exports = {
    ...divisionResolver,
    ...statusResolver,
    ...typeCongeResolver,
    ...typeAbsenceResolver,
    ...calendrierResolver,
    ...agentResolver,
    ...congeResolver,
    ...autorisationAbsenceResolver,
    ...compteResolver,
}