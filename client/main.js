import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.companyCreate.events({
    'submit .main-form': function(event) {

        event.preventDefault();

        var obj = Schemas.generateObjectFromForm(event.target, Schemas.Company);
        console.log(obj);

        // split out id strings
        var tmpFacilityIds = [];
        _.each(obj.facilityIds.split('\n'), function(v) {
            tmpFacilityIds.push(v.trim());
        });

        obj.facilityIds = tmpFacilityIds;

        var tmpDeerIds = [];
        _.each(obj.deerIds.split('\n'), function(v) {
            tmpDeerIds.push(v.trim());
        });

        obj.deerIds = tmpDeerIds;
/*
        Meteor.call('addCompany',
            obj,
            function(err, result) {
                if (err) {
                    console.error('Error: ' + err.reason);
                } else {
                    history.back();
                }
            });
*/

        Companies.insert(obj, function(err, result) {
            if (err) {
                console.error(err);
                console.error(result);
            } else {
                history.back();
            }
        });
    }
});

Template.companyCreate.onRendered(function() {
    $('.main-form').validate(Schemas.generateValidators(Schemas.Company));
});


//https://github.com/aldeed/meteor-autoform#callbackshooks
AutoForm.debug();

// the first key has to be the ID of the form
var postHooks = {
    'insertCompany': {
        before: {
            insert: function(doc) {
                return doc;
            }
        },
        after: {
            insert: function(error, result) {
                var addAnother = (this.event.target.addAnother &&
                    (this.event.target.addAnother.value === '1')) ? true : false;
                if(error) {
                    console.error(error);
                } else if (!addAnother) {
                    // the add-another option either lets us stay on the same form
                    // or backs us up to the previous form. ideally you'd have a
                    // flash here indicating success before it backs up or clears
                    // the form
                    history.back();
                } else {
                    this.resetForm();
                }
            }
        }
    }
};
AutoForm.hooks(postHooks);

/*
var postHooks = {
        before: {
            insert: function(doc) {
                delete doc.resetFlag;
                doc.fakeFlag = true;
                console.error(doc);
                return doc;
            }
        },
        after: {
            insert: function(error, result) {
                console.info(result);
            }
        },
        onSuccess: function(formType, result) {
            console.log('successsss!');
            console.log(this.insertDoc);
            if(this.insertDoc.isBreeder) { // simulate the reset flag
                history.back();
            }
        },
        onError: function(formType, error) {
            console.error('woops');
            console.error(error);
        }
};
//AutoForm.hooks({'insertCompany': postHooks}); this works
AutoForm.addHooks(['insertCompany'], postHooks); //this also works*/


// take the arguments for this template and stuff them into an args Object
// for another template, including some useful defaults
Template.bsQuickField.helpers({
    allArguments: function() {
        var obj = {
            'template': "bootstrap3-horizontal",
            'label-class': "col-xs-5",
            'input-col-class': "col-xs-7"
        };
        var _this = this;
        Object.keys(_this).forEach( function(key) {
            obj[key] = _this[key];
        });
        return obj;
    }
})
