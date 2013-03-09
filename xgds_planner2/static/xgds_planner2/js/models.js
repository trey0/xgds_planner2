app.models = app.models || {};

(function(models){

    // Map xpJSON parameter ValueTypes to backbone-forms schema field types
    models.paramTypeHash = {
        'string': 'Text',
        'integer': 'Number',
        'number': 'Number',
        'boolean': 'Checkbox',
        'date-time': 'DateTime',
        'targetId': 'Select',
    }

    models.Plan = Backbone.RelationalModel.extend({
        relations: [
            {
                type: Backbone.HasMany,
                relatedModel: 'app.models.PathElement',
                key: 'sequence',
                collectionType: 'app.models.PathSequenceCollection',
                createModels: true,
                reverseRelation:{
                    key: 'plan',
                    includeInJSON: false,
                },
            }
        ]
    });

    /*
    ** The PathElement model represents both Station and Sequence objects.
    ** This is inconvenient, but it has to be this way until we invent
    ** a Collection that can instantiate more than one model type.
    */
    models.PathElement = Backbone.RelationalModel.extend({
        relations:[
            {
                type: Backbone.HasMany,
                relatedModel: 'app.models.Command',
                key: 'sequence',
                collectionType: 'app.models.CommandCollection',
                createModels: true,
                reverseRelation:{
                    key: 'pathElement',
                },
            },
        ],
        schema: {
            id: 'Text',
            tolerance: 'Number',
            headingDegrees: 'Number',
            headingToleranceDegrees: 'Number',
        },

        toString: function(){
            return this.get('id');
        },

        initialize: function(){
            var params = {
                'Station': app.planSchema.stationParams,
                'Segment': app.planSchema.segmentParams,
            }[this.get('type')];
            if (params) {
                var schema = {};
                _.each(params, function(param){
                    schema[param.id] = {type: app.models.paramTypeHash[param.valueType]};
                });
                this.schema = schema;
            }
            
        },

        /*
        ** Relevant to stations only...
        ** A convenience mainly to keep details about the model's structure
        ** out of the map drag handler.
        */
        setPoint: function(lon, lat) {
            var geom = this.get('geometry');
            if (! geom) { throw "PathElement has no geometry"; }
            geom.coordinates = [lon, lat];
            this.set('geometry', geom);
        },
    });

    models.PathSequenceCollection = Backbone.Collection.extend({
        model: models.PathElement,
        /*
        This collection needs special logic to maintain
        the station-segment-station adjecency.
        */ 
        appendStation: function(stationModel){
            var segment = models.segmentFactory();
            this.add([segment, stationModel]);
        },
        removeStation: function(stationModel){
            var idx = this.indexOf(stationModel);
            if (idx < 0) { alert("Station not present in collection"); }
            else if ( idx == 0 ) {
                var segment = this.at(1);
            } else {
                var segment = this.at(i-1);
            }
            this.remove([stationModel, segment]);
        },
    });

    /*
    ** The factories below contain proto objects that act as
    ** templates for creating new Station and Segment PathElement
    ** models when the user adds them from the map display.
    */

    models.stationFactory = function(options, stationToClone) {
        var proto = {
            "geometry": {
                "coordinates": [],
                "type": "Point"
            },
            "headingDegrees": 0,
            "headingToleranceDegrees": 9.740282517223996,
            "id": "",
            "isDirectional": false,
            "sequence": [],
            "tolerance": 1,
            "type": "Station"
        }
        if (stationToClone) { proto = stationToClone.toJSON(); } 
        _.defaults(options, proto);

        if (options.coordinates) {
            options.geometry.coordinates = options.coordinates;
            delete options.coordinates;
        }

        if ( !options.id ){
            //TODO: interperet id template
            options.id = _.uniqueId('station_');
        }

        return new models.PathElement(options);

    }

    models.segmentFactory = function(options, segmentToClone){
        if ( _.isUndefined(options) ) { options = {}; }
        var proto = {
            "hintedSpeed": 1,
            "id": "",
            "sequence": [],
            "type": "Segment"
        }
        if (segmentToClone) { proto = segmentToClone.toJSON(); }
        _.defaults(options, proto);
        
        if ( !options.id ){
            //TODO: interperet id template
            options.id = _.uniqueId('segment_');
        }
        return new models.PathElement(options);
    }

    
    models.Command = Backbone.RelationalModel.extend({
        initialize: function(){

            /*
            // Construct a schema compatible with backbone-forms
            // https://github.com/powmedia/backbone-forms#schema-definition
            var schema = {};
            var commandSpec = app.commandSpecs[this.get('type')];
            _.each(commandSpec.params, function(param){
                schema[param.id] = paramTypeHash[param.valueType];
            });
            this.schema = schema;
            */

        },
    });

    models.CommandCollection = Backbone.Collection.extend({
        model: models.Command,
    });

})(app.models);
