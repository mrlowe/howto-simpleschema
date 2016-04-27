Schemas = {};

// transform simple schema data into validators for jquery validation
Schemas.generateValidators = function(schema) {
    var v = {
        rules: {},
        messages: {}
    };

    var s = schema._schema;
    Object.keys(s).forEach(function(key){
        if(key.includes(".$")) {
            return;
        }

        v.rules[key] = {};
        v.rules[key]['required'] = true;
        if ('optional' in s[key]) {
            v.rules[key]['required'] = false;
        }
    });

    var m = schema._messages;
    Object.keys(m).forEach(function(key){
        var arg = key.split(' ');
        if (arg.length == 2) {
            v.messages[arg[1]] = m[key];
        }
    });

    return v;
};

// marshal an object for insertion into the db
Schemas.generateObjectFromForm = function(form, schema) {
    var o = {};
    var s = schema._schema;

    Object.keys(s).forEach(function(key) {
        if(key.includes(".$")) {
            return;
        }

        $('[name=' + key +']').each( function(index, elt) {

            switch(typeof s[key].type()) {
                case 'boolean':
                    o[key] = (elt.value === 'Yes' || elt.value === '1');
                    break;
                default:
                    o[key] = elt.value;
            }

        });
    });
    return o;
};


// collection2 collection with a schema, hooray!
Companies = new Meteor.Collection('companies');
Schemas.Company = new SimpleSchema({
    name: {
        type: String,
        label: 'Name'
    },
    isBreeder: {
        type: Boolean,
        label: 'Is Breeder',
        defaultValue: false
    },
    isReleaseSite: {
        type: Boolean,
        label: 'Is Release Site',
        defaultValue: false
    },
    isMLD: {
        type: Boolean,
        label: 'Is MLD',
        defaultValue: false
    },
    isColdStorage: {
        type: Boolean,
        label: 'Is Cold Storage',
        defaultValue: false
    },
    facilityIds: {
        type: Array,
        label: 'Facility IDs',
        optional: true,
        defaultValue: []
    },
    'facilityIds.$': {
        type: String
    },
    deerIds: {
        type: Array,
        label: 'Deer IDs',
        optional: true,
        defaultValue: []
    },
    'deerIds.$': {
        type: String
    }
});
Schemas.Company.messages({
    // form of the key is <validation-rule-type> <field-name>, eg 'required name'
    //'required name' : 'O GOD NUUUU THIS IS REQUIRRRRRED'
});
Companies.attachSchema(Schemas.Company);
