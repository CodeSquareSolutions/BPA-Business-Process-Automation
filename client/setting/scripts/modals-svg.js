//get modal.json
//limit drag for hasManyThrough relation
(function() {
    
      Snap.plugin( function( Snap, Element, Paper, global ) {
    
        Element.prototype.limitDragHasMany = function( params ) {
                this.data('minx', params.minx ); this.data('miny', params.miny );
                this.data('ibb', this.getBBox() ); this.data('ot', this.transform().local );
                this.data('relateTo' , params.relateTo);this.data('relateFrom' , params.relateFrom);
                this.data('linkModel' , params.linkModel); var minHieght = this.data('linkModel').getBBox();
                this.data('lengthRel' , params.lengthRel) ;this.data('textLinkModel' , params.textLinkModel);
                this.data('lineFromMainModel' , params.lineFromMainModel);this.data('lineFromRelationModel' , params.lineFromRelationModel);
                this.data('maxx', params.maxx ); this.data('maxy', params.maxy );
                this.data('x', params.x );    this.data('y', params.y );
                this.data('arrowFromMainModel' , params.arrowFromMainModel);this.data('arrowFromRelationModel' , params.arrowFromRelationModel);
                this.data('createFormChkBox' , params.createFormChkBox) ; this.data('createFormTick' , params.createFormTick);
                this.data('textMainModel' , params.textMainModel); this.data('textRelationModel' , params.textRelationModel);                    
                this.data('tickLinkModelSelectBox'  , params.tickLinkModelSelectBox);this.data('crudOptionsLinkBox' , params.crudOptionsLinkBox);
                this.data('modelHeight' , minHieght.height);
                this.drag( limitMoveDragHasMany, limitStartDragHasMany,limitStopDragHasMany );
                return this;    
        };

        // this code is old and clunky now, and transform possibly in wrong order, so only use for simple cases
        function limitMoveDragHasMany( dx, dy ) {
                var tdx, tdy;
                var sInvMatrix = this.transform().globalMatrix.invert();
                sInvMatrix.e = sInvMatrix.f = 0; 
                tdx = sInvMatrix.x( dx,dy ); tdy = sInvMatrix.y( dx,dy );

                this.data('x', +this.data('ox') + tdx);
                this.data('y', +this.data('oy') + tdy);
                if( this.data('x') > this.data('maxx') - this.data('ibb').width  ) 
                        { this.data('x', this.data('maxx') - this.data('ibb').width  ) };
                if( this.data('y') > this.data('maxy') - this.data('ibb').height ) 
                        { this.data('y', this.data('maxy') - this.data('ibb').height ) };
                if( this.data('x') < this.data('minx') ) { this.data('x', this.data('minx') ) };
                if( this.data('y') < this.data('miny') ) { this.data('y', this.data('miny') ) };
                this.transform( this.data('ot') + "t" + [ this.data('x'), this.data('y') ]  );

                //check dragOver and dragOut...
                var relateTo_bbox = this.data("relateTo").getBBox();
                var relateFrom_bbox = this.data("relateFrom").getBBox();
                var linkModel_bbox = this.getBBox();

                if ((linkModel_bbox.y+20 < relateFrom_bbox.y2 && linkModel_bbox.x < relateFrom_bbox.x2- 15) || (linkModel_bbox.x2 > relateTo_bbox.x+15 && linkModel_bbox.y > relateTo_bbox.y-20)){
                    this.data('linkModel').attr({height : 30 , width : relateFrom_bbox.width - 10});                        
                    this.data('createFormChkBox').attr({display : "none"});this.data('createFormTick').attr({display : "none"});
                    this.data('tickLinkModelSelectBox').attr({display : "none"});this.data('crudOptionsLinkBox').attr({display : "none"});
                    this.data('linkModel').addClass("dragOverError");
                    this.data('lineFromMainModel').attr({display : "none"});
                    this.data('arrowFromMainModel').attr({display : "none"}); 
                    this.data('lineFromRelationModel').attr({display : "none"});
                    this.data('arrowFromRelationModel').attr({display : "none"});
    
                    if (linkModel_bbox.y+20 < relateFrom_bbox.y2 && linkModel_bbox.x < relateFrom_bbox.x2- 15){
                        this.data('relateFrom').attr({ height : this.data('modelHeight') + this.data('lengthRel') * 20});
                        this.data('relateFrom').addClass("dragOverError");
                    }
                    else{
                        this.data('relateTo').attr({ height: this.data('modelHeight') + 30 });
                        this.data('relateTo').addClass("dragOverError");
                    }
                    if ((linkModel_bbox.x > relateFrom_bbox.x && linkModel_bbox.y > relateFrom_bbox.y + 15 && linkModel_bbox.x2 < relateFrom_bbox.x2 && linkModel_bbox.y2 < relateFrom_bbox.y2) || (linkModel_bbox.x > relateTo_bbox.x && linkModel_bbox.y > relateTo_bbox.y+ 15 && linkModel_bbox.x2 < relateTo_bbox.x2 && linkModel_bbox.y2 < relateTo_bbox.y2)){                          
                        this.data('relateFrom').removeClass("dragOverError");
                        this.data('relateTo').removeClass("dragOverError");
                        this.data('linkModel').removeClass("dragOverError");                            
                        this.data('linkModel').addClass("dragOver");


                        //check the schema is already pushed...
                        var alreadyInserted = false;
                        for (var count =0 ;count < relationSchema.length; count++){
                            if (relationSchema[count].modelName.toLowerCase() == (this.data('textMainModel').node.textContent.slice(0 ,-1)).toLowerCase() || relationSchema[count].modelName.toLowerCase() == (this.data('textRelationModel').node.textContent.slice(0 ,-1)).toLowerCase()){
                                for (var check = 0 ;check < relationSchema[count].relations.length ; check++){
                                    if (relationSchema[count].relations[check].modelName.toLowerCase() == (this.data('textLinkModel').node.textContent.slice(0 , -1)).toLowerCase()){
                                        alreadyInserted = true;
                                    }
                                }
                            }
                        }
    
                        if (linkModel_bbox.x > relateFrom_bbox.x && linkModel_bbox.y > relateFrom_bbox.y + 15 && linkModel_bbox.x2 < relateFrom_bbox.x2 && linkModel_bbox.y2 < relateFrom_bbox.y2) {
                            this.data('relateFrom').addClass("dragOver");
                            if (alreadyInserted == false){
                                for (var count =0 ;count < relationSchema.length; count++){
                                    if (relationSchema[count].modelName.toLowerCase() == (this.data('textMainModel').node.textContent.slice(0 ,-1)).toLowerCase()){
                                        relationSchema[count].relations.push({
                                            modelName : (this.data('textLinkModel').node.textContent.slice(0 ,-1)).toLowerCase(),
                                            "createOperation" : false,
                                            "readOperation" : false,
                                            "updateOperation" : false,
                                            "deleateOperation" : false                                        
                                        })
                                    }
                                }
                            }
                        }
                        else {
                            this.data('relateTo').addClass("dragOver");
                            if (alreadyInserted == false){
                                for (var count =0 ;count < relationSchema.length; count++){
                                    if (relationSchema[count].modelName.toLowerCase() == (this.data('textRelationModel').node.textContent.slice(0 ,-1)).toLowerCase()){
                                        relationSchema[count].relations.push({
                                            modelName : (this.data('textLinkModel').node.textContent.slice(0 ,-1)).toLowerCase(),
                                            "createOperation" : false,
                                            "readOperation" : false,
                                            "updateOperation" : false,
                                            "deleateOperation" : false                                        
                                        })
                                    }
                                }
                            }
                        }//end of schema insertion...
                    }
                }
                else if (((linkModel_bbox.y2 < relateFrom_bbox.y || linkModel_bbox.y > relateFrom_bbox.y2 || linkModel_bbox.x > relateFrom_bbox.x2)&& linkModel_bbox.x2 < relateTo_bbox.x)|| ((linkModel_bbox.y2 < relateTo_bbox.y+5 || linkModel_bbox.y > relateTo_bbox.y2-5 || linkModel_bbox.x2 < relateTo_bbox.x+5 )&& linkModel_bbox.x > relateFrom_bbox.x2)){
                    this.data('linkModel').attr({ height : this.data('modelHeight') , width : relateFrom_bbox.width}); 
                    this.data('relateFrom').removeClass("dragOverError");
                    this.data('relateTo').removeClass("dragOverError");
                    this.data('linkModel').removeClass("dragOverError");
                    this.data('relateFrom').removeClass("dragOver");
                    this.data('relateTo').removeClass("dragOver");
                    this.data('linkModel').removeClass("dragOver");
                    this.data('lineFromMainModel').attr({display : "block"});
                    this.data('arrowFromMainModel').attr({display : "block"}); 
                    this.data('lineFromRelationModel').attr({display : "block"});
                    this.data('arrowFromRelationModel').attr({display : "block"});
                    this.data('createFormChkBox').attr({display : "block"});
//                  this.data('createFormTick').attr({display : "block"});

                    if (window["checked_"+(this.data('textLinkModel').node.textContent.slice(0 ,-1)).toLowerCase()+"_hasManyThrough"+(this.data('textMainModel').node.textContent.slice(0 ,-1)).toLowerCase()] == true){
                        this.data('tickLinkModelSelectBox').attr({display : "block"});
                        this.data('crudOptionsLinkBox').attr({display : "block"});
                    }
                    
                    //pop relation from relationSchema object...
                    for (var count = 0;count < relationSchema.length ; count++){
                        if (relationSchema[count].modelName.toLowerCase() == (this.data('textMainModel').node.textContent.slice(0 ,-1)).toLowerCase() || relationSchema[count].modelName.toLowerCase() == (this.data('textRelationModel').node.textContent.slice(0 ,-1)).toLowerCase()){
                            for (var check = 0 ;check < relationSchema[count].relations.length ; check++){
                                if (relationSchema[count].relations[check].modelName.toLowerCase() == (this.data('textLinkModel').node.textContent.slice(0 , -1)).toLowerCase()){
                                    relationSchema[count].relations.splice(check , 1);
                                }
                            }
                        }
                    }
                }
                //alterate the line that attach to models...
                var lineFromMainModel_bbox = this.data('lineFromMainModel').getBBox();
                var lineFromRelationModel_bbox = this.data('lineFromRelationModel').getBBox();
                var arrowFromMainModel_bbox = this.data('arrowFromMainModel').getBBox();
                var arrowFromRelationModel_bbox = this.data('arrowFromRelationModel').getBBox();
                if (linkModel_bbox.x < relateFrom_bbox.x2+33){
                    this.data('lineFromMainModel').attr({display : "none"});
                    this.data('arrowFromMainModel').attr({display : "none"});                
                }
                else if(linkModel_bbox.x2 > relateTo_bbox.x-33){
                    this.data('lineFromRelationModel').attr({display : "none"});
                    this.data('arrowFromRelationModel').attr({display : "none"}); 
                }
                //alter lines
                var lineFromMainModelPath = "M " + relateFrom_bbox.x2 + " " + (relateFrom_bbox.y+50) + "H " + (relateFrom_bbox.x2 + 20)+"V " + (linkModel_bbox.y+50) + "H " + linkModel_bbox.x;
                this.data('lineFromMainModel').attr({
                    d : lineFromMainModelPath,
                    fill: "white",
                    stroke: "#1f2c39",
                    strokeWidth: 1
                })
                var lineFromRelationModelPath = "M " + relateTo_bbox.x + " " + (relateTo_bbox.y+50) + "H " + (relateTo_bbox.x-20) + "V " + (linkModel_bbox.y+50) + "H " + linkModel_bbox.x2;
                this.data('lineFromRelationModel').attr({
                    d : lineFromRelationModelPath,
                    fill: "white",
                    stroke: "#1f2c39",
                    strokeWidth: 1
                })
    
                //alter polygon {Arrow at end of line toward related model}
                var arrowFromMainModelPoints =  [(linkModel_bbox.x) , (linkModel_bbox.y + 50) , (linkModel_bbox.x -10) , (linkModel_bbox.y + 50 -10) ,(linkModel_bbox.x -10) , (linkModel_bbox.y + 50 + 10)]
                this.data('arrowFromMainModel').attr({
                    points :arrowFromMainModelPoints,
                    fill: "#1f2c39",
                    stroke: "#1f2c39",
                    strokeWidth: 1,
                });
                var arrowFromRelationModelPoints =  [(linkModel_bbox.x2) , (linkModel_bbox.y + 50) , (linkModel_bbox.x2 +10) , (linkModel_bbox.y + 50 -10) ,(linkModel_bbox.x2 +10) , (linkModel_bbox.y + 50 + 10)]
                this.data('arrowFromRelationModel').attr({
                    points :arrowFromRelationModelPoints,
                    fill: "#1f2c39",
                    stroke: "#1f2c39",
                    strokeWidth: 1,
                });
    
        };

        function limitStartDragHasMany( x, y, ev ) {
                this.data('ox', this.data('x')); this.data('oy', this.data('y'));
        };
        function limitStopDragHasMany(ev ) {
            var relateTo_bbox = this.data("relateTo").getBBox();
            var relateFrom_bbox = this.data("relateFrom").getBBox();
            var linkModel_bbox = this.getBBox();
            //remove all classes from rect...
            if ( this.data('linkModel').hasClass('dragOver') || this.data('relateFrom').hasClass('dragOver') || this.data('relateTo').hasClass('dragOver')){
                this.data('relateFrom').removeClass('dragOver');
                this.data('relateTo').removeClass('dragOver')                                        
                this.data('linkModel').removeClass('dragOver')                    
            }
        };
    });
})();
    
//limit drag for hasAndBelongsToMany relation
(function() {
    
      Snap.plugin( function( Snap, Element, Paper, global ) {
    
        Element.prototype.limitDrag = function( params ) {
            this.data('minx', params.minx ); this.data('miny', params.miny );
            this.data('maxx', params.maxx ); this.data('maxy', params.maxy );
            this.data('x', params.x );    this.data('y', params.y );
            this.data('ibb', this.getBBox() );this.data('ot', this.transform().local );
            this.data('relateTo' , params.relateTo);this.data('relateFrom' , params.relateFrom);
            this.data('linkModel' , params.linkModel); var minHieght = this.data('linkModel').getBBox();
            this.data('lengthRel' , params.lengthRel) ;this.data('textLinkModel' , params.textLinkModel);
            this.data('lineFromMainModel' , params.lineFromMainModel);this.data('lineFromRelationModel' , params.lineFromRelationModel);
            this.data('arrowFromMainModel' , params.arrowFromMainModel);this.data('arrowFromRelationModel' , params.arrowFromRelationModel);                    
            this.data('textMainModel' , params.textMainModel); this.data('textRelationModel' , params.textRelationModel);
            this.data('modelHeight' , minHieght.height);
            this.drag( limitMoveDrag, limitStartDrag , limitStopDrag);
            return this;    
        };
    
        // this code is old and clunky now, and transform possibly in wrong order, so only use for simple cases
        function limitMoveDrag( dx, dy ) {
            var tdx, tdy;
            var sInvMatrix = this.transform().globalMatrix.invert();
            sInvMatrix.e = sInvMatrix.f = 0; 
            tdx = sInvMatrix.x( dx,dy ); tdy = sInvMatrix.y( dx,dy );

            this.data('x', +this.data('ox') + tdx);
            this.data('y', +this.data('oy') + tdy);
            if( this.data('x') > this.data('maxx') - this.data('ibb').width  ) 
                    { this.data('x', this.data('maxx') - this.data('ibb').width  ) };
            if( this.data('y') > this.data('maxy') - this.data('ibb').height ) 
                    { this.data('y', this.data('maxy') - this.data('ibb').height ) };
            if( this.data('x') < this.data('minx') ) { this.data('x', this.data('minx') ) };
                if( this.data('y') < this.data('miny') ) { this.data('y', this.data('miny') ) };
            this.transform( this.data('ot') + "t" + [ this.data('x'), this.data('y') ]  );
            //check dragOver and dragOut...
            var relateTo_bbox = this.data("relateTo").getBBox();
            var relateFrom_bbox = this.data("relateFrom").getBBox();
            var linkModel_bbox = this.getBBox();

            if ((linkModel_bbox.y+20 < relateFrom_bbox.y2 && linkModel_bbox.x < relateFrom_bbox.x2- 15) || (linkModel_bbox.x2 > relateTo_bbox.x+15 && linkModel_bbox.y > relateTo_bbox.y-20)){
                this.data('linkModel').attr({height : 30 , width : relateFrom_bbox.width - 10});
                this.data('linkModel').addClass("dragOverError");
                this.data('lineFromMainModel').attr({display : "none"});
                this.data('arrowFromMainModel').attr({display : "none"}); 
                this.data('lineFromRelationModel').attr({display : "none"});
                this.data('arrowFromRelationModel').attr({display : "none"});

                if (linkModel_bbox.y+20 < relateFrom_bbox.y2 && linkModel_bbox.x < relateFrom_bbox.x2- 15){
                    this.data('relateFrom').attr({ height : this.data('modelHeight') + this.data('lengthRel') * 20});
                    this.data('relateFrom').addClass("dragOverError");
                }
                else{
                    this.data('relateTo').attr({ height: this.data('modelHeight') + 30 });
                    this.data('relateTo').addClass("dragOverError");
                }
                if ((linkModel_bbox.x > relateFrom_bbox.x && linkModel_bbox.y > relateFrom_bbox.y + 15 && linkModel_bbox.x2 < relateFrom_bbox.x2 && linkModel_bbox.y2 < relateFrom_bbox.y2) || (linkModel_bbox.x > relateTo_bbox.x && linkModel_bbox.y > relateTo_bbox.y+ 15 && linkModel_bbox.x2 < relateTo_bbox.x2 && linkModel_bbox.y2 < relateTo_bbox.y2)){                          
                    this.data('relateFrom').removeClass("dragOverError");
                    this.data('relateTo').removeClass("dragOverError");
                    this.data('linkModel').removeClass("dragOverError");                            
                    this.data('linkModel').addClass("dragOver");
                    //check the schema is already pushed...
                    var alreadyInserted = false;
                    for (var count =0 ;count < relationSchema.length; count++){
                        if (relationSchema[count].modelName.toLowerCase() == (this.data('textMainModel').node.textContent.slice(0 ,-1)).toLowerCase() || relationSchema[count].modelName.toLowerCase() == (this.data('textRelationModel').node.textContent.slice(0 ,-1)).toLowerCase()){
                            for (var check = 0 ;check < relationSchema[count].relations.length ; check++){
                                if (relationSchema[count].relations[check].modelName.toLowerCase() == (this.data('textLinkModel').node.textContent.slice(0 , -1)).toLowerCase()){
                                    alreadyInserted = true;
                                }
                            }
                        }
                    }

                    if (linkModel_bbox.x > relateFrom_bbox.x && linkModel_bbox.y > relateFrom_bbox.y + 15 && linkModel_bbox.x2 < relateFrom_bbox.x2 && linkModel_bbox.y2 < relateFrom_bbox.y2) {
                        this.data('relateFrom').addClass("dragOver");
                        if (alreadyInserted == false){
                            for (var count =0 ;count < relationSchema.length; count++){
                                if (relationSchema[count].modelName.toLowerCase() == (this.data('textMainModel').node.textContent.slice(0 ,-1)).toLowerCase()){
                                    relationSchema[count].relations.push({
                                        modelName : (this.data('textLinkModel').node.textContent.slice(0 ,-1)).toLowerCase(),
                                        "createOperation" : false,
                                        "readOperation" : false,
                                        "updateOperation" : false,
                                        "deleateOperation" : false                                        
                                    })
                                }
                            }
                        }
                    }
                    else {
                        this.data('relateTo').addClass("dragOver");
                        if (alreadyInserted == false){
                            for (var count =0 ;count < relationSchema.length; count++){
                                if (relationSchema[count].modelName.toLowerCase() == (this.data('textRelationModel').node.textContent.slice(0 ,-1)).toLowerCase()){
                                    relationSchema[count].relations.push({
                                        modelName : (this.data('textLinkModel').node.textContent.slice(0 ,-1)).toLowerCase(),
                                        "createOperation" : false,
                                        "readOperation" : false,
                                        "updateOperation" : false,
                                        "deleateOperation" : false                                        
                                    })
                                }
                            }
                        }
                    }//end of schema insertion...
                }
            }
            else if (((linkModel_bbox.y2 < relateFrom_bbox.y || linkModel_bbox.y > relateFrom_bbox.y2 || linkModel_bbox.x > relateFrom_bbox.x2)&& linkModel_bbox.x2 < relateTo_bbox.x)|| ((linkModel_bbox.y2 < relateTo_bbox.y+5 || linkModel_bbox.y > relateTo_bbox.y2-5 || linkModel_bbox.x2 < relateTo_bbox.x+5 )&& linkModel_bbox.x > relateFrom_bbox.x2)){
                this.data('linkModel').attr({ height : this.data('modelHeight') , width : relateFrom_bbox.width}); 
                this.data('relateFrom').removeClass("dragOverError");
                this.data('relateTo').removeClass("dragOverError");
                this.data('linkModel').removeClass("dragOverError");
                this.data('relateFrom').removeClass("dragOver");
                this.data('relateTo').removeClass("dragOver");
                this.data('linkModel').removeClass("dragOver");
                this.data('lineFromMainModel').attr({display : "block"});
                this.data('arrowFromMainModel').attr({display : "block"}); 
                this.data('lineFromRelationModel').attr({display : "block"});
                this.data('arrowFromRelationModel').attr({display : "block"});

                //pop relation from relationSchema object...
                for (var count = 0;count < relationSchema.length ; count++){
                    if (relationSchema[count].modelName.toLowerCase() == (this.data('textMainModel').node.textContent.slice(0 ,-1)).toLowerCase() || relationSchema[count].modelName.toLowerCase() == (this.data('textRelationModel').node.textContent.slice(0 ,-1)).toLowerCase()){
                        for (var check = 0 ;check < relationSchema[count].relations.length ; check++){
                            if (relationSchema[count].relations[check].modelName.toLowerCase() == (this.data('textLinkModel').node.textContent.slice(0 , -1)).toLowerCase()){
                                relationSchema[count].relations.splice(check , 1);
                            }
                        }
                    }
                }
            }

            //alterate the line that attach to models...
            var lineFromMainModel_bbox = this.data('lineFromMainModel').getBBox();
            var lineFromRelationModel_bbox = this.data('lineFromRelationModel').getBBox();
            var arrowFromMainModel_bbox = this.data('arrowFromMainModel').getBBox();
            var arrowFromRelationModel_bbox = this.data('arrowFromRelationModel').getBBox();
            if (linkModel_bbox.x < relateFrom_bbox.x2+33){
                this.data('lineFromMainModel').attr({display : "none"});
                this.data('arrowFromMainModel').attr({display : "none"});                
            }
            else if(linkModel_bbox.x2 > relateTo_bbox.x-33){
                this.data('lineFromRelationModel').attr({display : "none"});
                this.data('arrowFromRelationModel').attr({display : "none"}); 
            }

            //alter lines
            var lineFromMainModelPath = "M " + relateFrom_bbox.x2 + " " + (relateFrom_bbox.y+50) + "H " + (relateFrom_bbox.x2 + 20)+"V " + (linkModel_bbox.y+50) + "H " + linkModel_bbox.x;
            this.data('lineFromMainModel').attr({
                d : lineFromMainModelPath,
                fill: "white",
                stroke: "#1f2c39",
                strokeWidth: 1
            })
            var lineFromRelationModelPath = "M " + relateTo_bbox.x + " " + (relateTo_bbox.y+50) + "H " + (relateTo_bbox.x-20) + "V " + (linkModel_bbox.y+50) + "H " + linkModel_bbox.x2;
            this.data('lineFromRelationModel').attr({
                d : lineFromRelationModelPath,
                fill: "white",
                stroke: "#1f2c39",
                strokeWidth: 1
            })

            //alter polygon {Arrow at end of line toward related model}
            var arrowFromMainModelPoints =  [(linkModel_bbox.x) , (linkModel_bbox.y + 50) , (linkModel_bbox.x -10) , (linkModel_bbox.y + 50 -10) ,(linkModel_bbox.x -10) , (linkModel_bbox.y + 50 + 10)]
            this.data('arrowFromMainModel').attr({
                points :arrowFromMainModelPoints,
                fill: "#1f2c39",
                stroke: "#1f2c39",
                strokeWidth: 1,
            });
            var arrowFromRelationModelPoints =  [(linkModel_bbox.x2) , (linkModel_bbox.y + 50) , (linkModel_bbox.x2 +10) , (linkModel_bbox.y + 50 -10) ,(linkModel_bbox.x2 +10) , (linkModel_bbox.y + 50 + 10)]
            this.data('arrowFromRelationModel').attr({
                points :arrowFromRelationModelPoints,
                fill: "#1f2c39",
                stroke: "#1f2c39",
                strokeWidth: 1,
            });
        }
        function limitStartDrag( x, y, ev ) {
            this.data('ox', this.data('x')); this.data('oy', this.data('y'));            
        };

        function limitStopDrag( x, y){            
            var relateTo_bbox = this.data("relateTo").getBBox();
            var relateFrom_bbox = this.data("relateFrom").getBBox();
            var linkModel_bbox = this.getBBox();
            /*if (linkModel_bbox.x > relateFrom_bbox.x && linkModel_bbox.x2 < relateFrom_bbox.x2 && linkModel_bbox.y > relateFrom_bbox.y+20 && linkModel_bbox.y2 < relateFrom_bbox.y2){
                this.data('linkModel').attr({
                    transform: "t" + [ 0 ,this.data('iteration')*20]
                });  
            }*/
            //remove all classes from rect...
            if ( this.data('linkModel').hasClass('dragOver') || this.data('relateFrom').hasClass('dragOver') || this.data('relateTo').hasClass('dragOver')){
                this.data('relateFrom').removeClass('dragOver');
                this.data('relateTo').removeClass('dragOver')                                        
                this.data('linkModel').removeClass('dragOver')                    
            }
        }
    });
})();
// create relationSchema for models...
var relationSchema = new Array();
var belongsToCounter = 0 , hasManyCounter =0 , hasOneCounter =0 , hasManyThroughCounter = 0;
var model_schema = [{"name":"applicant","base":"PersistedModel","idInjection":true,"options":{"validateUpsert":true},"properties":{"applicantname":{"type":"string"}},"validations":[],"relations":{"leave":{"type":"hasMany","model":"leave","foreignKey":""}},"acls":[{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"findById"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"find"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"create"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"replaceOrCreate"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"updateOrCreate"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"updateById"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"deleteById"}],"methods":{}},{"name":"ceo","base":"PersistedModel","idInjection":true,"options":{"validateUpsert":true},"properties":{"name":{"type":"string"}},"validations":[],"relations":{},"acls":[{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"findById"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"find"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"create"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"replaceOrCreate"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"updateOrCreate"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"updateById"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"deleteById"}],"methods":{}},{"name":"leave","base":"PersistedModel","idInjection":true,"options":{"validateUpsert":true},"properties":{"subject":{"type":"string"},"approvedbysupervisor":{"type":"boolean"},"approvedbyceo":{"type":"boolean"},"status":{"type":"string"}},"validations":[],"relations":{"applicant":{"type":"belongsTo","model":"applicant","foreignKey":""}},"acls":[{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"findById"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"find"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"create"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"replaceOrCreate"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"updateOrCreate"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"updateById"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"deleteById"}],"methods":{}},{"name":"supervisor","base":"PersistedModel","idInjection":true,"options":{"validateUpsert":true},"properties":{"name":{"type":"string"}},"validations":[],"relations":{},"acls":[{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"findById"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"find"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"create"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"replaceOrCreate"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"updateOrCreate"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"updateById"},{"principalType":"ROLE","principalId":"admin","permission":"ALLOW","property":"deleteById"}],"methods":{}},{"name":"test","base":"PersistedModel","idInjection":true,"options":{"validateUpsert":true},"properties":{"testname":{"type":"string"}},"validations":[],"relations":{},"acls":[],"methods":{}}];



//push main model object inside relationSchema array...
relationSchema.push({
    "modelName" : "applicant",
    "properties" : [
    {
        "field" : "applicantname" , 
        "type" : "string",
        "required" : "false"
    },
    
    ],
    "operations" : {
    "createOperation" : false,
    "readOperation" : false,
    "updateOperation" : false,
    "deleateOperation" : false
    },
    "relations" : [],
    "ACL" :[]
});

//get access to id
var applicant = Snap("#applicant");

//modal rectangle...
var drag_title_applicant = Snap.parse('<title>Drag and Drop here related model if exist for generate relation inside form, Double click to show details</title>');

var block_applicant = applicant.rect(20, 20, 150, 100, 5, 5);
block_applicant.attr({
    fill: "rgb(236, 240, 241)",
    stroke: "#1f2c39",
    strokeWidth: 1,
    'stroke-dasharray': 5
});
block_applicant.append(drag_title_applicant);


//get modal properties...JSON.stringify(data)
var applicantProperties = {"applicantname":{"type":"string"}};

//attach double click event on modal which trigger and display properties panel...
block_applicant.dblclick(function(){
    displayPropPanel('applicant');
});

//modal text populate inside modal rect...
var text_applicant = applicant.text(0, 0, "APPLICANT!");
text_applicant.attr({
    x: block_applicant.node.x.animVal.value + 10,
    y: block_applicant.node.y.animVal.value + 20,
    'font-size': 13
});
// line separates modal head and body...
var line_applicant = applicant.line(0, 0, 0, 0);
line_applicant.attr({
    x1: block_applicant.node.x.animVal.value,
    y1: Number(text_applicant.node.attributes.y.nodeValue) + 5,
    x2: block_applicant.node.x.animVal.value + block_applicant.node.width.animVal.value,
    y2: Number(text_applicant.node.attributes.y.nodeValue) + 5,
    stroke: "#1f2c39",
    strokeWidth: 1,
    strokeLinecap: "round"
});

// change coordinates of line and mode1_rect according to text
/*block_applicant.attr({
    width: Number(text_applicant.node.attributes.x.value) + (Number(text_applicant.node.textContent.length) * 10 + 30)
});
line_applicant.attr({
    x2: (block_applicant.node.width.animVal.value + block_applicant.node.x.animVal.value)
})*/

//tooltip on checkbox...
var select_title_applicant = Snap.parse('<title>Click here to select model for CRUD Operations , if unchecked Crud form are not created</title>');

//select box checked when modal form is created
var select_applicant = applicant.rect(0, 0, 15, 15, 2, 2);
select_applicant.attr({
    x: (block_applicant.node.width.animVal.value + block_applicant.node.x.animVal.value - 10),
    y: (block_applicant.node.y.animVal.value - 10),
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 2
});
select_applicant.append(select_title_applicant);

//check symbol inside select box...
var tick_path_applicant = "M " + (select_applicant.node.x.animVal.value + 3) + " " + (select_applicant.node.y.animVal.value + 5) + "L " + (select_applicant.node.x.animVal.value + 7) + " " + (select_applicant.node.y.animVal.value + 10) + "L " + (select_applicant.node.x.animVal.value + select_applicant.node.width.animVal.value) + " " + (select_applicant.node.y.animVal.value - 3);
var tick_applicant = applicant.path(tick_path_applicant)
tick_applicant.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

//check and uncheck function on checkbox...
var checked_applicant = false;
var selectCheckBox_applicant = function () {
    if (!checked_applicant) {
        //  crud_opt_group.removeClass('animated bounceOutUp')
        crud_opt_group_applicant.attr({
            'display': 'block'
        })

        tick_applicant.attr({ display : "block"});
        // crud_opt_group_applicant.addClass('animated bounceInUp');
        checked_applicant = true;
    } else if (checked_applicant) {
        crud_opt_group_applicant.attr({
            'display': 'none'
        })
        tick_applicant.attr({ display : "none"});
        // crud_opt_group.removeClass('animated bounceInUp');
        // crud_opt_group.addClass('animated bounceOutUp')
        checked_applicant = false;
    }
};
select_applicant.click(selectCheckBox_applicant);
tick_applicant.click(selectCheckBox_applicant);

//Crud Rect...
var crud_opt_applicant = applicant.rect(0, 0, 80, 90, 5, 5);
crud_opt_applicant.attr({
    x: (select_applicant.node.x.animVal.value + 15),
    y: (select_applicant.node.y.animVal.value + 20),
    fill: "white",
    stroke: "#1f2c39",
    'stroke-dasharray': 10
})

//Crud options inside Crud_opt rect...
var create_applicant = applicant.text(0, 0, "-   create");
create_applicant.attr({
    x: (crud_opt_applicant.node.x.animVal.value + 5),
    y: (crud_opt_applicant.node.y.animVal.value + 20),
    'font-size': 15
});
var listing_applicant = applicant.text(0, 0, "-   Listing");
listing_applicant.attr({
    x: (crud_opt_applicant.node.x.animVal.value + 5),
    y: (crud_opt_applicant.node.y.animVal.value + 40),
    'font-size': 15
});
var update_applicant = applicant.text(0, 0, "-   update");
update_applicant.attr({
    x: (crud_opt_applicant.node.x.animVal.value + 5),
    y: (crud_opt_applicant.node.y.animVal.value + 60),
    'font-size': 15
});
var deleate_applicant = applicant.text(0, 0, "-   delete");
deleate_applicant.attr({
    x: (crud_opt_applicant.node.x.animVal.value + 5),
    y: (crud_opt_applicant.node.y.animVal.value + 80),
    'font-size': 15
});

//check and uncheck Crud options functions...
var createCheckBoxClicked_applicant = false;
var createCheckBoxClick_applicant = function () {
    if (!createCheckBoxClicked_applicant) {
        create_tick_applicant.attr({
            display: "block"
        });
        createCheckBoxClicked_applicant = true;
        relationSchema[0].operations.createOperation = true;
    } else if (createCheckBoxClicked_applicant) {
        create_tick_applicant.attr({
            display: "none"
        });
        createCheckBoxClicked_applicant = false;
        relationSchema[0].operations.createOperation = false;
    }
}
//listing check all three remaining options include listing , delete , edit
var listingCheckBoxClicked_applicant = false;
var listingCheckBoxClick_applicant = function () {
    if (!listingCheckBoxClicked_applicant) {
        listing_tick_applicant.attr({
            display: "block"
        });
        update_tick_applicant.attr({
            display: "block"
        });
        deleate_tick_applicant.attr({
            display: "block"
        });
        listingCheckBoxClicked_applicant = true;
        relationSchema[0].operations.deleateOperation = true; 
        relationSchema[0].operations.readOperation = true; 
        relationSchema[0].operations.updateOperation = true;
    } else if (listingCheckBoxClicked_applicant) {
        listing_tick_applicant.attr({
            display: "none"
        });
        update_tick_applicant.attr({
            display: "none"
        });
        deleate_tick_applicant.attr({
            display: "none"
        });
        listingCheckBoxClicked_applicant = false;
        relationSchema[0].operations.deleateOperation = false; 
        relationSchema[0].operations.readOperation = false; 
        relationSchema[0].operations.updateOperation = false
    }
}

//now set checkboxes on front of Crud operations...
var createCheckBox_applicant = applicant.rect(0, 0, 12, 12, 1, 1);
createCheckBox_applicant.attr({
    x: (Number(create_applicant.node.attributes.x.nodeValue) + 60),
    y: (create_applicant.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
createCheckBox_applicant.click(createCheckBoxClick_applicant);
var listingCheckBox_applicant = applicant.rect(0, 0, 12, 12, 1, 1);
listingCheckBox_applicant.attr({
    x: (Number(listing_applicant.node.attributes.x.nodeValue) + 60),
    y: (listing_applicant.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
listingCheckBox_applicant.click(listingCheckBoxClick_applicant);
var updateCheckBox_applicant = applicant.rect(0, 0, 12, 12, 1, 1);
updateCheckBox_applicant.attr({
    x: (Number(update_applicant.node.attributes.x.nodeValue) + 60),
    y: (update_applicant.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
updateCheckBox_applicant.click(listingCheckBoxClick_applicant);
var deleateCheckBox_applicant = applicant.rect(0, 0, 12, 12, 1, 1);
deleateCheckBox_applicant.attr({
    x: (Number(deleate_applicant.node.attributes.x.nodeValue) + 60),
    y: (deleate_applicant.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
deleateCheckBox_applicant.click(listingCheckBoxClick_applicant);

//tick inside create check_box...
var create_tick_path_applicant = "M " + (createCheckBox_applicant.node.x.animVal.value + 1) + " " + (createCheckBox_applicant.node.y.animVal.value + 6) + "L " + (createCheckBox_applicant.node.x.animVal.value + 5) + " " + (createCheckBox_applicant.node.y.animVal.value + 10) + "L " + (createCheckBox_applicant.node.x.animVal.value + createCheckBox_applicant.node.width.animVal.value) + " " + (createCheckBox_applicant.node.y.animVal.value - 2);
var create_tick_applicant = applicant.path(create_tick_path_applicant);
create_tick_applicant.click(createCheckBoxClick_applicant);
create_tick_applicant.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside listing check_box...
var listing_tick_path_applicant = "M " + (listingCheckBox_applicant.node.x.animVal.value + 1) + " " + (listingCheckBox_applicant.node.y.animVal.value + 6) + "L " + (listingCheckBox_applicant.node.x.animVal.value + 5) + " " + (listingCheckBox_applicant.node.y.animVal.value + 10) + "L " + (listingCheckBox_applicant.node.x.animVal.value + listingCheckBox_applicant.node.width.animVal.value) + " " + (listingCheckBox_applicant.node.y.animVal.value - 2);
var listing_tick_applicant = applicant.path(listing_tick_path_applicant);
listing_tick_applicant.click(listingCheckBoxClick_applicant);
listing_tick_applicant.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var update_tick_path_applicant = "M " + (updateCheckBox_applicant.node.x.animVal.value + 1) + " " + (updateCheckBox_applicant.node.y.animVal.value + 6) + "L " + (updateCheckBox_applicant.node.x.animVal.value + 5) + " " + (updateCheckBox_applicant.node.y.animVal.value + 10) + "L " + (updateCheckBox_applicant.node.x.animVal.value + updateCheckBox_applicant.node.width.animVal.value) + " " + (updateCheckBox_applicant.node.y.animVal.value - 2);
var update_tick_applicant = applicant.path(update_tick_path_applicant);
update_tick_applicant.click(listingCheckBoxClick_applicant);
update_tick_applicant.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var deleate_tick_path_applicant = "M " + (deleateCheckBox_applicant.node.x.animVal.value + 1) + " " + (deleateCheckBox_applicant.node.y.animVal.value + 6) + "L " + (deleateCheckBox_applicant.node.x.animVal.value + 5) + " " + (deleateCheckBox_applicant.node.y.animVal.value + 10) + "L " + (deleateCheckBox_applicant.node.x.animVal.value + deleateCheckBox_applicant.node.width.animVal.value) + " " + (deleateCheckBox_applicant.node.y.animVal.value - 2);
var deleate_tick_applicant = applicant.path(deleate_tick_path_applicant);
deleate_tick_applicant.click(listingCheckBoxClick_applicant);
deleate_tick_applicant.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

var crud_opt_group_applicant = applicant.group(crud_opt_applicant, create_applicant, listing_applicant, update_applicant, deleate_applicant, createCheckBox_applicant, listingCheckBox_applicant, updateCheckBox_applicant, deleateCheckBox_applicant, create_tick_applicant, listing_tick_applicant, update_tick_applicant, deleate_tick_applicant);
crud_opt_group_applicant.attr({
    'display': 'none'
})

//relative modals svg...

var leave_hasMany0 = Snap("#applicant");

//modal rectangle...
var drag_title_leave_hasMany0 = Snap.parse('<title>Drag and Drop here related model if exist for generate relation inside form</title>');

var block_leave_hasMany0 = leave_hasMany0.rect(20, 20, 150, 100, 5, 5);
block_leave_hasMany0.attr({
    x: (block_applicant.node.x.animVal.value + block_applicant.node.width.animVal.value + 200),
    width : (block_applicant.node.width.animVal.value),
    fill: "rgb(236, 240, 241)",
    stroke: "#1f2c39",
    strokeWidth: 1,
    'stroke-dasharray': 5 
});


block_leave_hasMany0.append(drag_title_leave_hasMany0);


//modal text populate inside modal rect...
var text_leave_hasMany0 = leave_hasMany0.text(0, 0, "LEAVE!");
text_leave_hasMany0.attr({
    x: block_leave_hasMany0.node.x.animVal.value + 10,
    y: block_leave_hasMany0.node.y.animVal.value + 20,
    'font-size': 13
});
// line separates modal head and body...
var line_leave_hasMany0 = leave_hasMany0.line(0, 0, 0, 0);
line_leave_hasMany0.attr({
    x1: block_leave_hasMany0.node.x.animVal.value,
    y1: Number(text_leave_hasMany0.node.attributes.y.nodeValue) + 5,
    x2: block_leave_hasMany0.node.x.animVal.value + block_leave_hasMany0.node.width.animVal.value,
    y2: Number(text_leave_hasMany0.node.attributes.y.nodeValue) + 5,
    stroke: "#1f2c39",
    strokeWidth: 1,
    strokeLinecap: "round"
});

// change coordinates of line and mode1_rect according to text
/*<!--block_leave_hasMany0.attr({
    width: Number(text_leave_hasMany0.node.attributes.x.value) + (Number(text_leave_hasMany0.node.textContent.length) * 10 + 30)
});
line_leave_hasMany0.attr({
    x2: (block_leave_hasMany0.node.width.animVal.value + block_leave_hasMany0.node.x.animVal.value)
})-->*/

//tooltip on checkbox...
var select_title_leave_hasMany0 = Snap.parse('<title>Click here to select model for CRUD Operations , if unchecked Crud form are not created</title>');

//select box checked when modal form is created
var select_leave_hasMany0 = leave_hasMany0.rect(0, 0, 15, 15, 2, 2);
select_leave_hasMany0.attr({
    x: (block_leave_hasMany0.node.width.animVal.value + block_leave_hasMany0.node.x.animVal.value - 10),
    y: (block_leave_hasMany0.node.y.animVal.value - 10),
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 2
});
select_leave_hasMany0.append(select_title_leave_hasMany0);

//check symbol inside select box...
var tick_path_leave_hasMany0 = "M " + (select_leave_hasMany0.node.x.animVal.value + 3) + " " + (select_leave_hasMany0.node.y.animVal.value + 5) + "L " + (select_leave_hasMany0.node.x.animVal.value + 7) + " " + (select_leave_hasMany0.node.y.animVal.value + 10) + "L " + (select_leave_hasMany0.node.x.animVal.value + select_leave_hasMany0.node.width.animVal.value) + " " + (select_leave_hasMany0.node.y.animVal.value - 3);
var tick_leave_hasMany0 = leave_hasMany0.path(tick_path_leave_hasMany0)
tick_leave_hasMany0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

//check and uncheck function on checkbox...
var checked_leave_hasMany0 = false;
var selectCheckBox_leave_hasMany0 = function () {
    if (!checked_leave_hasMany0) {
        crud_opt_group_leave_hasMany0.attr({
            'display': 'block'
        })
        tick_leave_hasMany0.attr({ display : "block"});
        block_leave_hasMany0.attr({ x : (block_applicant.node.x.animVal.value + block_applicant.node.width.animVal.value + 200)});
        checked_leave_hasMany0 = true;
    } else if (checked_leave_hasMany0) {
        crud_opt_group_leave_hasMany0.attr({
            'display': 'none'
        })
        tick_leave_hasMany0.attr({ display : "none"});
        checked_leave_hasMany0 = false;
    }
};
select_leave_hasMany0.click(selectCheckBox_leave_hasMany0);
tick_leave_hasMany0.click(selectCheckBox_leave_hasMany0);

//Crud Rect...
var crud_opt_leave_hasMany0 = leave_hasMany0.rect(0, 0, 80, 90, 5, 5);
crud_opt_leave_hasMany0.attr({
    x: (select_leave_hasMany0.node.x.animVal.value + 15),
    y: (select_leave_hasMany0.node.y.animVal.value + 20),
    fill: "white",
    stroke: "#1f2c39",
    'stroke-dasharray': 10
})

//Crud options inside Crud_opt rect...
var create_leave_hasMany0 = leave_hasMany0.text(0, 0, "-   create");
create_leave_hasMany0.attr({
    x: (crud_opt_leave_hasMany0.node.x.animVal.value + 5),
    y: (crud_opt_leave_hasMany0.node.y.animVal.value + 20),
    'font-size': 15
});
var listing_leave_hasMany0 = leave_hasMany0.text(0, 0, "-   Listing");
listing_leave_hasMany0.attr({
    x: (crud_opt_leave_hasMany0.node.x.animVal.value + 5),
    y: (crud_opt_leave_hasMany0.node.y.animVal.value + 40),
    'font-size': 15
});
var update_leave_hasMany0 = leave_hasMany0.text(0, 0, "-   update");
update_leave_hasMany0.attr({
    x: (crud_opt_leave_hasMany0.node.x.animVal.value + 5),
    y: (crud_opt_leave_hasMany0.node.y.animVal.value + 60),
    'font-size': 15
});
var deleate_leave_hasMany0 = leave_hasMany0.text(0, 0, "-   delete");
deleate_leave_hasMany0.attr({
    x: (crud_opt_leave_hasMany0.node.x.animVal.value + 5),
    y: (crud_opt_leave_hasMany0.node.y.animVal.value + 80),
    'font-size': 15
});

//check and uncheck Crud options functions...
var createCheckBoxClicked_leave_hasMany0 = false;
var createCheckBoxClick_leave_hasMany0 = function () {
    if (!createCheckBoxClicked_leave_hasMany0) {
        create_tick_leave_hasMany0.attr({
            display: "block"
        });
        createCheckBoxClicked_leave_hasMany0 = true;
    } else if (createCheckBoxClicked_leave_hasMany0) {
        create_tick_leave_hasMany0.attr({
            display: "none"
        });
        createCheckBoxClicked_leave_hasMany0 = false;
    }
}

//listing check all three remaining options include listing , delete , edit
var listingCheckBoxClicked_leave_hasMany0 = false;
var listingCheckBoxClick_leave_hasMany0 = function () {
    if (!listingCheckBoxClicked_leave_hasMany0) {
        listing_tick_leave_hasMany0.attr({
            display: "block"
        });
        update_tick_leave_hasMany0.attr({
            display: "block"
        });
        deleate_tick_leave_hasMany0.attr({
            display: "block"
        });
        listingCheckBoxClicked_leave_hasMany0 = true;
    } else if (listingCheckBoxClicked_leave_hasMany0) {
        listing_tick_leave_hasMany0.attr({
            display: "none"
        });
        update_tick_leave_hasMany0.attr({
            display: "none"
        });
        deleate_tick_leave_hasMany0.attr({
            display: "none"
        });
        listingCheckBoxClicked_leave_hasMany0 = false;
    }
}

//now set checkboxes on front of Crud operations...
var createCheckBox_leave_hasMany0 = leave_hasMany0.rect(0, 0, 12, 12, 1, 1);
createCheckBox_leave_hasMany0.attr({
    x: (Number(create_leave_hasMany0.node.attributes.x.nodeValue) + 60),
    y: (create_leave_hasMany0.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
createCheckBox_leave_hasMany0.click(createCheckBoxClick_leave_hasMany0);
var listingCheckBox_leave_hasMany0 = leave_hasMany0.rect(0, 0, 12, 12, 1, 1);
listingCheckBox_leave_hasMany0.attr({
    x: (Number(listing_leave_hasMany0.node.attributes.x.nodeValue) + 60),
    y: (listing_leave_hasMany0.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
listingCheckBox_leave_hasMany0.click(listingCheckBoxClick_leave_hasMany0);
var updateCheckBox_leave_hasMany0 = leave_hasMany0.rect(0, 0, 12, 12, 1, 1);
updateCheckBox_leave_hasMany0.attr({
    x: (Number(update_leave_hasMany0.node.attributes.x.nodeValue) + 60),
    y: (update_leave_hasMany0.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
updateCheckBox_leave_hasMany0.click(listingCheckBoxClick_leave_hasMany0);
var deleateCheckBox_leave_hasMany0 = leave_hasMany0.rect(0, 0, 12, 12, 1, 1);
deleateCheckBox_leave_hasMany0.attr({
    x: (Number(deleate_leave_hasMany0.node.attributes.x.nodeValue) + 60),
    y: (deleate_leave_hasMany0.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
deleateCheckBox_leave_hasMany0.click(listingCheckBoxClick_leave_hasMany0);

//tick inside create check_box...
var create_tick_path_leave_hasMany0 = "M " + (createCheckBox_leave_hasMany0.node.x.animVal.value + 1) + " " + (createCheckBox_leave_hasMany0.node.y.animVal.value + 6) + "L " + (createCheckBox_leave_hasMany0.node.x.animVal.value + 5) + " " + (createCheckBox_leave_hasMany0.node.y.animVal.value + 10) + "L " + (createCheckBox_leave_hasMany0.node.x.animVal.value + createCheckBox_leave_hasMany0.node.width.animVal.value) + " " + (createCheckBox_leave_hasMany0.node.y.animVal.value - 2);
var create_tick_leave_hasMany0 = leave_hasMany0.path(create_tick_path_leave_hasMany0);
create_tick_leave_hasMany0.click(createCheckBoxClick_leave_hasMany0);
create_tick_leave_hasMany0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside listing check_box...
var listing_tick_path_leave_hasMany0 = "M " + (listingCheckBox_leave_hasMany0.node.x.animVal.value + 1) + " " + (listingCheckBox_leave_hasMany0.node.y.animVal.value + 6) + "L " + (listingCheckBox_leave_hasMany0.node.x.animVal.value + 5) + " " + (listingCheckBox_leave_hasMany0.node.y.animVal.value + 10) + "L " + (listingCheckBox_leave_hasMany0.node.x.animVal.value + listingCheckBox_leave_hasMany0.node.width.animVal.value) + " " + (listingCheckBox_leave_hasMany0.node.y.animVal.value - 2);
var listing_tick_leave_hasMany0 = leave_hasMany0.path(listing_tick_path_leave_hasMany0);
listing_tick_leave_hasMany0.click(listingCheckBoxClick_leave_hasMany0);
listing_tick_leave_hasMany0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var update_tick_path_leave_hasMany0 = "M " + (updateCheckBox_leave_hasMany0.node.x.animVal.value + 1) + " " + (updateCheckBox_leave_hasMany0.node.y.animVal.value + 6) + "L " + (updateCheckBox_leave_hasMany0.node.x.animVal.value + 5) + " " + (updateCheckBox_leave_hasMany0.node.y.animVal.value + 10) + "L " + (updateCheckBox_leave_hasMany0.node.x.animVal.value + updateCheckBox_leave_hasMany0.node.width.animVal.value) + " " + (updateCheckBox_leave_hasMany0.node.y.animVal.value - 2);
var update_tick_leave_hasMany0 = leave_hasMany0.path(update_tick_path_leave_hasMany0);
update_tick_leave_hasMany0.click(listingCheckBoxClick_leave_hasMany0);
update_tick_leave_hasMany0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var deleate_tick_path_leave_hasMany0 = "M " + (deleateCheckBox_leave_hasMany0.node.x.animVal.value + 1) + " " + (deleateCheckBox_leave_hasMany0.node.y.animVal.value + 6) + "L " + (deleateCheckBox_leave_hasMany0.node.x.animVal.value + 5) + " " + (deleateCheckBox_leave_hasMany0.node.y.animVal.value + 10) + "L " + (deleateCheckBox_leave_hasMany0.node.x.animVal.value + deleateCheckBox_leave_hasMany0.node.width.animVal.value) + " " + (deleateCheckBox_leave_hasMany0.node.y.animVal.value - 2);
var deleate_tick_leave_hasMany0 = leave_hasMany0.path(deleate_tick_path_leave_hasMany0);
deleate_tick_leave_hasMany0.click(listingCheckBoxClick_leave_hasMany0);
deleate_tick_leave_hasMany0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

var crud_opt_group_leave_hasMany0 = leave_hasMany0.group(crud_opt_leave_hasMany0, create_leave_hasMany0, listing_leave_hasMany0, update_leave_hasMany0, deleate_leave_hasMany0, createCheckBox_leave_hasMany0, listingCheckBox_leave_hasMany0, updateCheckBox_leave_hasMany0, deleateCheckBox_leave_hasMany0, create_tick_leave_hasMany0, listing_tick_leave_hasMany0, update_tick_leave_hasMany0, deleate_tick_leave_hasMany0);
crud_opt_group_leave_hasMany0.attr({
    'display': 'none'
})

var applicantToLeavePath = "M " + (block_applicant.node.x.animVal.value + block_applicant.node.width.animVal.value ) + " " + (block_applicant.node.y.animVal.value + 50) + "H " + (block_applicant.node.x.animVal.value + block_applicant.node.width.animVal.value + 20) + "V " +  (block_leave_hasMany0.node.y.animVal.value + 50) + "H " +  (block_leave_hasMany0.node.x.animVal.value);
var applicantToLeave = applicant.path(applicantToLeavePath);
applicantToLeave.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1
})
//polygon {Arrow at end of line toward related model}
var applicantToLeaveArrowPoints = [block_leave_hasMany0.node.x.animVal.value,(block_leave_hasMany0.node.y.animVal.value+50),(block_leave_hasMany0.node.x.animVal.value-10),(block_leave_hasMany0.node.y.animVal.value+50-10),(block_leave_hasMany0.node.x.animVal.value-10),(block_leave_hasMany0.node.y.animVal.value+50+10)];
var applicantToLeaveArrow = applicant.polygon(applicantToLeaveArrowPoints);
applicantToLeaveArrow.attr({
    fill: "#1f2c39",
    stroke: "#1f2c39",
    strokeWidth: 1,
});

//relation type on top of arrow head {text}...
var applicantToLeaverelationType = applicant.text(0, 0, "HasMany");
applicantToLeaverelationType.attr({
    x : (block_leave_hasMany0.node.x.animVal.value - 120),
    y : (block_leave_hasMany0.node.y.animVal.value+40),
    stroke: "#8a8a8a"
})

//prepend relation type text...
applicantToLeaverelationType.prependTo(Snap(applicant));

//now prepend the lines because these lines overlap components come after it...
applicantToLeave.prependTo(Snap(applicant));



//push main model object inside relationSchema array...
relationSchema.push({
    "modelName" : "ceo",
    "properties" : [
    {
        "field" : "name" , 
        "type" : "string",
        "required" : "false"
    },
    
    ],
    "operations" : {
    "createOperation" : false,
    "readOperation" : false,
    "updateOperation" : false,
    "deleateOperation" : false
    },
    "relations" : [],
    "ACL" :[]
});

//get access to id
var ceo = Snap("#ceo");

//modal rectangle...
var drag_title_ceo = Snap.parse('<title>Drag and Drop here related model if exist for generate relation inside form, Double click to show details</title>');

var block_ceo = ceo.rect(20, 20, 150, 100, 5, 5);
block_ceo.attr({
    fill: "rgb(236, 240, 241)",
    stroke: "#1f2c39",
    strokeWidth: 1,
    'stroke-dasharray': 5
});
block_ceo.append(drag_title_ceo);


//get modal properties...JSON.stringify(data)
var ceoProperties = {"name":{"type":"string"}};

//attach double click event on modal which trigger and display properties panel...
block_ceo.dblclick(function(){
    displayPropPanel('ceo');
});

//modal text populate inside modal rect...
var text_ceo = ceo.text(0, 0, "CEO!");
text_ceo.attr({
    x: block_ceo.node.x.animVal.value + 10,
    y: block_ceo.node.y.animVal.value + 20,
    'font-size': 13
});
// line separates modal head and body...
var line_ceo = ceo.line(0, 0, 0, 0);
line_ceo.attr({
    x1: block_ceo.node.x.animVal.value,
    y1: Number(text_ceo.node.attributes.y.nodeValue) + 5,
    x2: block_ceo.node.x.animVal.value + block_ceo.node.width.animVal.value,
    y2: Number(text_ceo.node.attributes.y.nodeValue) + 5,
    stroke: "#1f2c39",
    strokeWidth: 1,
    strokeLinecap: "round"
});

// change coordinates of line and mode1_rect according to text
/*block_ceo.attr({
    width: Number(text_ceo.node.attributes.x.value) + (Number(text_ceo.node.textContent.length) * 10 + 30)
});
line_ceo.attr({
    x2: (block_ceo.node.width.animVal.value + block_ceo.node.x.animVal.value)
})*/

//tooltip on checkbox...
var select_title_ceo = Snap.parse('<title>Click here to select model for CRUD Operations , if unchecked Crud form are not created</title>');

//select box checked when modal form is created
var select_ceo = ceo.rect(0, 0, 15, 15, 2, 2);
select_ceo.attr({
    x: (block_ceo.node.width.animVal.value + block_ceo.node.x.animVal.value - 10),
    y: (block_ceo.node.y.animVal.value - 10),
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 2
});
select_ceo.append(select_title_ceo);

//check symbol inside select box...
var tick_path_ceo = "M " + (select_ceo.node.x.animVal.value + 3) + " " + (select_ceo.node.y.animVal.value + 5) + "L " + (select_ceo.node.x.animVal.value + 7) + " " + (select_ceo.node.y.animVal.value + 10) + "L " + (select_ceo.node.x.animVal.value + select_ceo.node.width.animVal.value) + " " + (select_ceo.node.y.animVal.value - 3);
var tick_ceo = ceo.path(tick_path_ceo)
tick_ceo.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

//check and uncheck function on checkbox...
var checked_ceo = false;
var selectCheckBox_ceo = function () {
    if (!checked_ceo) {
        //  crud_opt_group.removeClass('animated bounceOutUp')
        crud_opt_group_ceo.attr({
            'display': 'block'
        })

        tick_ceo.attr({ display : "block"});
        // crud_opt_group_ceo.addClass('animated bounceInUp');
        checked_ceo = true;
    } else if (checked_ceo) {
        crud_opt_group_ceo.attr({
            'display': 'none'
        })
        tick_ceo.attr({ display : "none"});
        // crud_opt_group.removeClass('animated bounceInUp');
        // crud_opt_group.addClass('animated bounceOutUp')
        checked_ceo = false;
    }
};
select_ceo.click(selectCheckBox_ceo);
tick_ceo.click(selectCheckBox_ceo);

//Crud Rect...
var crud_opt_ceo = ceo.rect(0, 0, 80, 90, 5, 5);
crud_opt_ceo.attr({
    x: (select_ceo.node.x.animVal.value + 15),
    y: (select_ceo.node.y.animVal.value + 20),
    fill: "white",
    stroke: "#1f2c39",
    'stroke-dasharray': 10
})

//Crud options inside Crud_opt rect...
var create_ceo = ceo.text(0, 0, "-   create");
create_ceo.attr({
    x: (crud_opt_ceo.node.x.animVal.value + 5),
    y: (crud_opt_ceo.node.y.animVal.value + 20),
    'font-size': 15
});
var listing_ceo = ceo.text(0, 0, "-   Listing");
listing_ceo.attr({
    x: (crud_opt_ceo.node.x.animVal.value + 5),
    y: (crud_opt_ceo.node.y.animVal.value + 40),
    'font-size': 15
});
var update_ceo = ceo.text(0, 0, "-   update");
update_ceo.attr({
    x: (crud_opt_ceo.node.x.animVal.value + 5),
    y: (crud_opt_ceo.node.y.animVal.value + 60),
    'font-size': 15
});
var deleate_ceo = ceo.text(0, 0, "-   delete");
deleate_ceo.attr({
    x: (crud_opt_ceo.node.x.animVal.value + 5),
    y: (crud_opt_ceo.node.y.animVal.value + 80),
    'font-size': 15
});

//check and uncheck Crud options functions...
var createCheckBoxClicked_ceo = false;
var createCheckBoxClick_ceo = function () {
    if (!createCheckBoxClicked_ceo) {
        create_tick_ceo.attr({
            display: "block"
        });
        createCheckBoxClicked_ceo = true;
        relationSchema[1].operations.createOperation = true;
    } else if (createCheckBoxClicked_ceo) {
        create_tick_ceo.attr({
            display: "none"
        });
        createCheckBoxClicked_ceo = false;
        relationSchema[1].operations.createOperation = false;
    }
}
//listing check all three remaining options include listing , delete , edit
var listingCheckBoxClicked_ceo = false;
var listingCheckBoxClick_ceo = function () {
    if (!listingCheckBoxClicked_ceo) {
        listing_tick_ceo.attr({
            display: "block"
        });
        update_tick_ceo.attr({
            display: "block"
        });
        deleate_tick_ceo.attr({
            display: "block"
        });
        listingCheckBoxClicked_ceo = true;
        relationSchema[1].operations.deleateOperation = true; 
        relationSchema[1].operations.readOperation = true; 
        relationSchema[1].operations.updateOperation = true;
    } else if (listingCheckBoxClicked_ceo) {
        listing_tick_ceo.attr({
            display: "none"
        });
        update_tick_ceo.attr({
            display: "none"
        });
        deleate_tick_ceo.attr({
            display: "none"
        });
        listingCheckBoxClicked_ceo = false;
        relationSchema[1].operations.deleateOperation = false; 
        relationSchema[1].operations.readOperation = false; 
        relationSchema[1].operations.updateOperation = false
    }
}

//now set checkboxes on front of Crud operations...
var createCheckBox_ceo = ceo.rect(0, 0, 12, 12, 1, 1);
createCheckBox_ceo.attr({
    x: (Number(create_ceo.node.attributes.x.nodeValue) + 60),
    y: (create_ceo.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
createCheckBox_ceo.click(createCheckBoxClick_ceo);
var listingCheckBox_ceo = ceo.rect(0, 0, 12, 12, 1, 1);
listingCheckBox_ceo.attr({
    x: (Number(listing_ceo.node.attributes.x.nodeValue) + 60),
    y: (listing_ceo.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
listingCheckBox_ceo.click(listingCheckBoxClick_ceo);
var updateCheckBox_ceo = ceo.rect(0, 0, 12, 12, 1, 1);
updateCheckBox_ceo.attr({
    x: (Number(update_ceo.node.attributes.x.nodeValue) + 60),
    y: (update_ceo.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
updateCheckBox_ceo.click(listingCheckBoxClick_ceo);
var deleateCheckBox_ceo = ceo.rect(0, 0, 12, 12, 1, 1);
deleateCheckBox_ceo.attr({
    x: (Number(deleate_ceo.node.attributes.x.nodeValue) + 60),
    y: (deleate_ceo.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
deleateCheckBox_ceo.click(listingCheckBoxClick_ceo);

//tick inside create check_box...
var create_tick_path_ceo = "M " + (createCheckBox_ceo.node.x.animVal.value + 1) + " " + (createCheckBox_ceo.node.y.animVal.value + 6) + "L " + (createCheckBox_ceo.node.x.animVal.value + 5) + " " + (createCheckBox_ceo.node.y.animVal.value + 10) + "L " + (createCheckBox_ceo.node.x.animVal.value + createCheckBox_ceo.node.width.animVal.value) + " " + (createCheckBox_ceo.node.y.animVal.value - 2);
var create_tick_ceo = ceo.path(create_tick_path_ceo);
create_tick_ceo.click(createCheckBoxClick_ceo);
create_tick_ceo.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside listing check_box...
var listing_tick_path_ceo = "M " + (listingCheckBox_ceo.node.x.animVal.value + 1) + " " + (listingCheckBox_ceo.node.y.animVal.value + 6) + "L " + (listingCheckBox_ceo.node.x.animVal.value + 5) + " " + (listingCheckBox_ceo.node.y.animVal.value + 10) + "L " + (listingCheckBox_ceo.node.x.animVal.value + listingCheckBox_ceo.node.width.animVal.value) + " " + (listingCheckBox_ceo.node.y.animVal.value - 2);
var listing_tick_ceo = ceo.path(listing_tick_path_ceo);
listing_tick_ceo.click(listingCheckBoxClick_ceo);
listing_tick_ceo.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var update_tick_path_ceo = "M " + (updateCheckBox_ceo.node.x.animVal.value + 1) + " " + (updateCheckBox_ceo.node.y.animVal.value + 6) + "L " + (updateCheckBox_ceo.node.x.animVal.value + 5) + " " + (updateCheckBox_ceo.node.y.animVal.value + 10) + "L " + (updateCheckBox_ceo.node.x.animVal.value + updateCheckBox_ceo.node.width.animVal.value) + " " + (updateCheckBox_ceo.node.y.animVal.value - 2);
var update_tick_ceo = ceo.path(update_tick_path_ceo);
update_tick_ceo.click(listingCheckBoxClick_ceo);
update_tick_ceo.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var deleate_tick_path_ceo = "M " + (deleateCheckBox_ceo.node.x.animVal.value + 1) + " " + (deleateCheckBox_ceo.node.y.animVal.value + 6) + "L " + (deleateCheckBox_ceo.node.x.animVal.value + 5) + " " + (deleateCheckBox_ceo.node.y.animVal.value + 10) + "L " + (deleateCheckBox_ceo.node.x.animVal.value + deleateCheckBox_ceo.node.width.animVal.value) + " " + (deleateCheckBox_ceo.node.y.animVal.value - 2);
var deleate_tick_ceo = ceo.path(deleate_tick_path_ceo);
deleate_tick_ceo.click(listingCheckBoxClick_ceo);
deleate_tick_ceo.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

var crud_opt_group_ceo = ceo.group(crud_opt_ceo, create_ceo, listing_ceo, update_ceo, deleate_ceo, createCheckBox_ceo, listingCheckBox_ceo, updateCheckBox_ceo, deleateCheckBox_ceo, create_tick_ceo, listing_tick_ceo, update_tick_ceo, deleate_tick_ceo);
crud_opt_group_ceo.attr({
    'display': 'none'
})

//relative modals svg...


//push main model object inside relationSchema array...
relationSchema.push({
    "modelName" : "leave",
    "properties" : [
    {
        "field" : "subject" , 
        "type" : "string",
        "required" : "false"
    },
    
    {
        "field" : "approvedbysupervisor" , 
        "type" : "boolean",
        "required" : "false"
    },
    
    {
        "field" : "approvedbyceo" , 
        "type" : "boolean",
        "required" : "false"
    },
    
    {
        "field" : "status" , 
        "type" : "string",
        "required" : "false"
    },
    
    ],
    "operations" : {
    "createOperation" : false,
    "readOperation" : false,
    "updateOperation" : false,
    "deleateOperation" : false
    },
    "relations" : [],
    "ACL" :[]
});

//get access to id
var leave = Snap("#leave");

//modal rectangle...
var drag_title_leave = Snap.parse('<title>Drag and Drop here related model if exist for generate relation inside form, Double click to show details</title>');

var block_leave = leave.rect(20, 20, 150, 100, 5, 5);
block_leave.attr({
    fill: "rgb(236, 240, 241)",
    stroke: "#1f2c39",
    strokeWidth: 1,
    'stroke-dasharray': 5
});
block_leave.append(drag_title_leave);


//get modal properties...JSON.stringify(data)
var leaveProperties = {"subject":{"type":"string"},"approvedbysupervisor":{"type":"boolean"},"approvedbyceo":{"type":"boolean"},"status":{"type":"string"}};

//attach double click event on modal which trigger and display properties panel...
block_leave.dblclick(function(){
    displayPropPanel('leave');
});

//modal text populate inside modal rect...
var text_leave = leave.text(0, 0, "LEAVE!");
text_leave.attr({
    x: block_leave.node.x.animVal.value + 10,
    y: block_leave.node.y.animVal.value + 20,
    'font-size': 13
});
// line separates modal head and body...
var line_leave = leave.line(0, 0, 0, 0);
line_leave.attr({
    x1: block_leave.node.x.animVal.value,
    y1: Number(text_leave.node.attributes.y.nodeValue) + 5,
    x2: block_leave.node.x.animVal.value + block_leave.node.width.animVal.value,
    y2: Number(text_leave.node.attributes.y.nodeValue) + 5,
    stroke: "#1f2c39",
    strokeWidth: 1,
    strokeLinecap: "round"
});

// change coordinates of line and mode1_rect according to text
/*block_leave.attr({
    width: Number(text_leave.node.attributes.x.value) + (Number(text_leave.node.textContent.length) * 10 + 30)
});
line_leave.attr({
    x2: (block_leave.node.width.animVal.value + block_leave.node.x.animVal.value)
})*/

//tooltip on checkbox...
var select_title_leave = Snap.parse('<title>Click here to select model for CRUD Operations , if unchecked Crud form are not created</title>');

//select box checked when modal form is created
var select_leave = leave.rect(0, 0, 15, 15, 2, 2);
select_leave.attr({
    x: (block_leave.node.width.animVal.value + block_leave.node.x.animVal.value - 10),
    y: (block_leave.node.y.animVal.value - 10),
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 2
});
select_leave.append(select_title_leave);

//check symbol inside select box...
var tick_path_leave = "M " + (select_leave.node.x.animVal.value + 3) + " " + (select_leave.node.y.animVal.value + 5) + "L " + (select_leave.node.x.animVal.value + 7) + " " + (select_leave.node.y.animVal.value + 10) + "L " + (select_leave.node.x.animVal.value + select_leave.node.width.animVal.value) + " " + (select_leave.node.y.animVal.value - 3);
var tick_leave = leave.path(tick_path_leave)
tick_leave.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

//check and uncheck function on checkbox...
var checked_leave = false;
var selectCheckBox_leave = function () {
    if (!checked_leave) {
        //  crud_opt_group.removeClass('animated bounceOutUp')
        crud_opt_group_leave.attr({
            'display': 'block'
        })

        tick_leave.attr({ display : "block"});
        // crud_opt_group_leave.addClass('animated bounceInUp');
        checked_leave = true;
    } else if (checked_leave) {
        crud_opt_group_leave.attr({
            'display': 'none'
        })
        tick_leave.attr({ display : "none"});
        // crud_opt_group.removeClass('animated bounceInUp');
        // crud_opt_group.addClass('animated bounceOutUp')
        checked_leave = false;
    }
};
select_leave.click(selectCheckBox_leave);
tick_leave.click(selectCheckBox_leave);

//Crud Rect...
var crud_opt_leave = leave.rect(0, 0, 80, 90, 5, 5);
crud_opt_leave.attr({
    x: (select_leave.node.x.animVal.value + 15),
    y: (select_leave.node.y.animVal.value + 20),
    fill: "white",
    stroke: "#1f2c39",
    'stroke-dasharray': 10
})

//Crud options inside Crud_opt rect...
var create_leave = leave.text(0, 0, "-   create");
create_leave.attr({
    x: (crud_opt_leave.node.x.animVal.value + 5),
    y: (crud_opt_leave.node.y.animVal.value + 20),
    'font-size': 15
});
var listing_leave = leave.text(0, 0, "-   Listing");
listing_leave.attr({
    x: (crud_opt_leave.node.x.animVal.value + 5),
    y: (crud_opt_leave.node.y.animVal.value + 40),
    'font-size': 15
});
var update_leave = leave.text(0, 0, "-   update");
update_leave.attr({
    x: (crud_opt_leave.node.x.animVal.value + 5),
    y: (crud_opt_leave.node.y.animVal.value + 60),
    'font-size': 15
});
var deleate_leave = leave.text(0, 0, "-   delete");
deleate_leave.attr({
    x: (crud_opt_leave.node.x.animVal.value + 5),
    y: (crud_opt_leave.node.y.animVal.value + 80),
    'font-size': 15
});

//check and uncheck Crud options functions...
var createCheckBoxClicked_leave = false;
var createCheckBoxClick_leave = function () {
    if (!createCheckBoxClicked_leave) {
        create_tick_leave.attr({
            display: "block"
        });
        createCheckBoxClicked_leave = true;
        relationSchema[2].operations.createOperation = true;
    } else if (createCheckBoxClicked_leave) {
        create_tick_leave.attr({
            display: "none"
        });
        createCheckBoxClicked_leave = false;
        relationSchema[2].operations.createOperation = false;
    }
}
//listing check all three remaining options include listing , delete , edit
var listingCheckBoxClicked_leave = false;
var listingCheckBoxClick_leave = function () {
    if (!listingCheckBoxClicked_leave) {
        listing_tick_leave.attr({
            display: "block"
        });
        update_tick_leave.attr({
            display: "block"
        });
        deleate_tick_leave.attr({
            display: "block"
        });
        listingCheckBoxClicked_leave = true;
        relationSchema[2].operations.deleateOperation = true; 
        relationSchema[2].operations.readOperation = true; 
        relationSchema[2].operations.updateOperation = true;
    } else if (listingCheckBoxClicked_leave) {
        listing_tick_leave.attr({
            display: "none"
        });
        update_tick_leave.attr({
            display: "none"
        });
        deleate_tick_leave.attr({
            display: "none"
        });
        listingCheckBoxClicked_leave = false;
        relationSchema[2].operations.deleateOperation = false; 
        relationSchema[2].operations.readOperation = false; 
        relationSchema[2].operations.updateOperation = false
    }
}

//now set checkboxes on front of Crud operations...
var createCheckBox_leave = leave.rect(0, 0, 12, 12, 1, 1);
createCheckBox_leave.attr({
    x: (Number(create_leave.node.attributes.x.nodeValue) + 60),
    y: (create_leave.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
createCheckBox_leave.click(createCheckBoxClick_leave);
var listingCheckBox_leave = leave.rect(0, 0, 12, 12, 1, 1);
listingCheckBox_leave.attr({
    x: (Number(listing_leave.node.attributes.x.nodeValue) + 60),
    y: (listing_leave.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
listingCheckBox_leave.click(listingCheckBoxClick_leave);
var updateCheckBox_leave = leave.rect(0, 0, 12, 12, 1, 1);
updateCheckBox_leave.attr({
    x: (Number(update_leave.node.attributes.x.nodeValue) + 60),
    y: (update_leave.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
updateCheckBox_leave.click(listingCheckBoxClick_leave);
var deleateCheckBox_leave = leave.rect(0, 0, 12, 12, 1, 1);
deleateCheckBox_leave.attr({
    x: (Number(deleate_leave.node.attributes.x.nodeValue) + 60),
    y: (deleate_leave.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
deleateCheckBox_leave.click(listingCheckBoxClick_leave);

//tick inside create check_box...
var create_tick_path_leave = "M " + (createCheckBox_leave.node.x.animVal.value + 1) + " " + (createCheckBox_leave.node.y.animVal.value + 6) + "L " + (createCheckBox_leave.node.x.animVal.value + 5) + " " + (createCheckBox_leave.node.y.animVal.value + 10) + "L " + (createCheckBox_leave.node.x.animVal.value + createCheckBox_leave.node.width.animVal.value) + " " + (createCheckBox_leave.node.y.animVal.value - 2);
var create_tick_leave = leave.path(create_tick_path_leave);
create_tick_leave.click(createCheckBoxClick_leave);
create_tick_leave.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside listing check_box...
var listing_tick_path_leave = "M " + (listingCheckBox_leave.node.x.animVal.value + 1) + " " + (listingCheckBox_leave.node.y.animVal.value + 6) + "L " + (listingCheckBox_leave.node.x.animVal.value + 5) + " " + (listingCheckBox_leave.node.y.animVal.value + 10) + "L " + (listingCheckBox_leave.node.x.animVal.value + listingCheckBox_leave.node.width.animVal.value) + " " + (listingCheckBox_leave.node.y.animVal.value - 2);
var listing_tick_leave = leave.path(listing_tick_path_leave);
listing_tick_leave.click(listingCheckBoxClick_leave);
listing_tick_leave.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var update_tick_path_leave = "M " + (updateCheckBox_leave.node.x.animVal.value + 1) + " " + (updateCheckBox_leave.node.y.animVal.value + 6) + "L " + (updateCheckBox_leave.node.x.animVal.value + 5) + " " + (updateCheckBox_leave.node.y.animVal.value + 10) + "L " + (updateCheckBox_leave.node.x.animVal.value + updateCheckBox_leave.node.width.animVal.value) + " " + (updateCheckBox_leave.node.y.animVal.value - 2);
var update_tick_leave = leave.path(update_tick_path_leave);
update_tick_leave.click(listingCheckBoxClick_leave);
update_tick_leave.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var deleate_tick_path_leave = "M " + (deleateCheckBox_leave.node.x.animVal.value + 1) + " " + (deleateCheckBox_leave.node.y.animVal.value + 6) + "L " + (deleateCheckBox_leave.node.x.animVal.value + 5) + " " + (deleateCheckBox_leave.node.y.animVal.value + 10) + "L " + (deleateCheckBox_leave.node.x.animVal.value + deleateCheckBox_leave.node.width.animVal.value) + " " + (deleateCheckBox_leave.node.y.animVal.value - 2);
var deleate_tick_leave = leave.path(deleate_tick_path_leave);
deleate_tick_leave.click(listingCheckBoxClick_leave);
deleate_tick_leave.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

var crud_opt_group_leave = leave.group(crud_opt_leave, create_leave, listing_leave, update_leave, deleate_leave, createCheckBox_leave, listingCheckBox_leave, updateCheckBox_leave, deleateCheckBox_leave, create_tick_leave, listing_tick_leave, update_tick_leave, deleate_tick_leave);
crud_opt_group_leave.attr({
    'display': 'none'
})

//relative modals svg...

var applicant_belongsTo0 = Snap("#leave");

//modal rectangle...
var drag_title_applicant_belongsTo0 = Snap.parse('<title>Drag and Drop here related model if exist for generate relation inside form</title>');

var block_applicant_belongsTo0 = applicant_belongsTo0.rect(20, 20, 150, 100, 5, 5);
block_applicant_belongsTo0.attr({
    x: (block_leave.node.x.animVal.value + block_leave.node.width.animVal.value + 200),
    width : (block_leave.node.width.animVal.value),
    fill: "rgb(236, 240, 241)",
    stroke: "#1f2c39",
    strokeWidth: 1,
    'stroke-dasharray': 5 
});


block_applicant_belongsTo0.append(drag_title_applicant_belongsTo0);


//modal text populate inside modal rect...
var text_applicant_belongsTo0 = applicant_belongsTo0.text(0, 0, "APPLICANT!");
text_applicant_belongsTo0.attr({
    x: block_applicant_belongsTo0.node.x.animVal.value + 10,
    y: block_applicant_belongsTo0.node.y.animVal.value + 20,
    'font-size': 13
});
// line separates modal head and body...
var line_applicant_belongsTo0 = applicant_belongsTo0.line(0, 0, 0, 0);
line_applicant_belongsTo0.attr({
    x1: block_applicant_belongsTo0.node.x.animVal.value,
    y1: Number(text_applicant_belongsTo0.node.attributes.y.nodeValue) + 5,
    x2: block_applicant_belongsTo0.node.x.animVal.value + block_applicant_belongsTo0.node.width.animVal.value,
    y2: Number(text_applicant_belongsTo0.node.attributes.y.nodeValue) + 5,
    stroke: "#1f2c39",
    strokeWidth: 1,
    strokeLinecap: "round"
});

// change coordinates of line and mode1_rect according to text
/*<!--block_applicant_belongsTo0.attr({
    width: Number(text_applicant_belongsTo0.node.attributes.x.value) + (Number(text_applicant_belongsTo0.node.textContent.length) * 10 + 30)
});
line_applicant_belongsTo0.attr({
    x2: (block_applicant_belongsTo0.node.width.animVal.value + block_applicant_belongsTo0.node.x.animVal.value)
})-->*/

//tooltip on checkbox...
var select_title_applicant_belongsTo0 = Snap.parse('<title>Click here to select model for CRUD Operations , if unchecked Crud form are not created</title>');

//select box checked when modal form is created
var select_applicant_belongsTo0 = applicant_belongsTo0.rect(0, 0, 15, 15, 2, 2);
select_applicant_belongsTo0.attr({
    x: (block_applicant_belongsTo0.node.width.animVal.value + block_applicant_belongsTo0.node.x.animVal.value - 10),
    y: (block_applicant_belongsTo0.node.y.animVal.value - 10),
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 2
});
select_applicant_belongsTo0.append(select_title_applicant_belongsTo0);

//check symbol inside select box...
var tick_path_applicant_belongsTo0 = "M " + (select_applicant_belongsTo0.node.x.animVal.value + 3) + " " + (select_applicant_belongsTo0.node.y.animVal.value + 5) + "L " + (select_applicant_belongsTo0.node.x.animVal.value + 7) + " " + (select_applicant_belongsTo0.node.y.animVal.value + 10) + "L " + (select_applicant_belongsTo0.node.x.animVal.value + select_applicant_belongsTo0.node.width.animVal.value) + " " + (select_applicant_belongsTo0.node.y.animVal.value - 3);
var tick_applicant_belongsTo0 = applicant_belongsTo0.path(tick_path_applicant_belongsTo0)
tick_applicant_belongsTo0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

//check and uncheck function on checkbox...
var checked_applicant_belongsTo0 = false;
var selectCheckBox_applicant_belongsTo0 = function () {
    if (!checked_applicant_belongsTo0) {
        crud_opt_group_applicant_belongsTo0.attr({
            'display': 'block'
        })
        tick_applicant_belongsTo0.attr({ display : "block"});
        block_applicant_belongsTo0.attr({ x : (block_leave.node.x.animVal.value + block_leave.node.width.animVal.value + 200)});
        checked_applicant_belongsTo0 = true;
    } else if (checked_applicant_belongsTo0) {
        crud_opt_group_applicant_belongsTo0.attr({
            'display': 'none'
        })
        tick_applicant_belongsTo0.attr({ display : "none"});
        checked_applicant_belongsTo0 = false;
    }
};
select_applicant_belongsTo0.click(selectCheckBox_applicant_belongsTo0);
tick_applicant_belongsTo0.click(selectCheckBox_applicant_belongsTo0);

//Crud Rect...
var crud_opt_applicant_belongsTo0 = applicant_belongsTo0.rect(0, 0, 80, 90, 5, 5);
crud_opt_applicant_belongsTo0.attr({
    x: (select_applicant_belongsTo0.node.x.animVal.value + 15),
    y: (select_applicant_belongsTo0.node.y.animVal.value + 20),
    fill: "white",
    stroke: "#1f2c39",
    'stroke-dasharray': 10
})

//Crud options inside Crud_opt rect...
var create_applicant_belongsTo0 = applicant_belongsTo0.text(0, 0, "-   create");
create_applicant_belongsTo0.attr({
    x: (crud_opt_applicant_belongsTo0.node.x.animVal.value + 5),
    y: (crud_opt_applicant_belongsTo0.node.y.animVal.value + 20),
    'font-size': 15
});
var listing_applicant_belongsTo0 = applicant_belongsTo0.text(0, 0, "-   Listing");
listing_applicant_belongsTo0.attr({
    x: (crud_opt_applicant_belongsTo0.node.x.animVal.value + 5),
    y: (crud_opt_applicant_belongsTo0.node.y.animVal.value + 40),
    'font-size': 15
});
var update_applicant_belongsTo0 = applicant_belongsTo0.text(0, 0, "-   update");
update_applicant_belongsTo0.attr({
    x: (crud_opt_applicant_belongsTo0.node.x.animVal.value + 5),
    y: (crud_opt_applicant_belongsTo0.node.y.animVal.value + 60),
    'font-size': 15
});
var deleate_applicant_belongsTo0 = applicant_belongsTo0.text(0, 0, "-   delete");
deleate_applicant_belongsTo0.attr({
    x: (crud_opt_applicant_belongsTo0.node.x.animVal.value + 5),
    y: (crud_opt_applicant_belongsTo0.node.y.animVal.value + 80),
    'font-size': 15
});

//check and uncheck Crud options functions...
var createCheckBoxClicked_applicant_belongsTo0 = false;
var createCheckBoxClick_applicant_belongsTo0 = function () {
    if (!createCheckBoxClicked_applicant_belongsTo0) {
        create_tick_applicant_belongsTo0.attr({
            display: "block"
        });
        createCheckBoxClicked_applicant_belongsTo0 = true;
    } else if (createCheckBoxClicked_applicant_belongsTo0) {
        create_tick_applicant_belongsTo0.attr({
            display: "none"
        });
        createCheckBoxClicked_applicant_belongsTo0 = false;
    }
}

//listing check all three remaining options include listing , delete , edit
var listingCheckBoxClicked_applicant_belongsTo0 = false;
var listingCheckBoxClick_applicant_belongsTo0 = function () {
    if (!listingCheckBoxClicked_applicant_belongsTo0) {
        listing_tick_applicant_belongsTo0.attr({
            display: "block"
        });
        update_tick_applicant_belongsTo0.attr({
            display: "block"
        });
        deleate_tick_applicant_belongsTo0.attr({
            display: "block"
        });
        listingCheckBoxClicked_applicant_belongsTo0 = true;
    } else if (listingCheckBoxClicked_applicant_belongsTo0) {
        listing_tick_applicant_belongsTo0.attr({
            display: "none"
        });
        update_tick_applicant_belongsTo0.attr({
            display: "none"
        });
        deleate_tick_applicant_belongsTo0.attr({
            display: "none"
        });
        listingCheckBoxClicked_applicant_belongsTo0 = false;
    }
}

//now set checkboxes on front of Crud operations...
var createCheckBox_applicant_belongsTo0 = applicant_belongsTo0.rect(0, 0, 12, 12, 1, 1);
createCheckBox_applicant_belongsTo0.attr({
    x: (Number(create_applicant_belongsTo0.node.attributes.x.nodeValue) + 60),
    y: (create_applicant_belongsTo0.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
createCheckBox_applicant_belongsTo0.click(createCheckBoxClick_applicant_belongsTo0);
var listingCheckBox_applicant_belongsTo0 = applicant_belongsTo0.rect(0, 0, 12, 12, 1, 1);
listingCheckBox_applicant_belongsTo0.attr({
    x: (Number(listing_applicant_belongsTo0.node.attributes.x.nodeValue) + 60),
    y: (listing_applicant_belongsTo0.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
listingCheckBox_applicant_belongsTo0.click(listingCheckBoxClick_applicant_belongsTo0);
var updateCheckBox_applicant_belongsTo0 = applicant_belongsTo0.rect(0, 0, 12, 12, 1, 1);
updateCheckBox_applicant_belongsTo0.attr({
    x: (Number(update_applicant_belongsTo0.node.attributes.x.nodeValue) + 60),
    y: (update_applicant_belongsTo0.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
updateCheckBox_applicant_belongsTo0.click(listingCheckBoxClick_applicant_belongsTo0);
var deleateCheckBox_applicant_belongsTo0 = applicant_belongsTo0.rect(0, 0, 12, 12, 1, 1);
deleateCheckBox_applicant_belongsTo0.attr({
    x: (Number(deleate_applicant_belongsTo0.node.attributes.x.nodeValue) + 60),
    y: (deleate_applicant_belongsTo0.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
deleateCheckBox_applicant_belongsTo0.click(listingCheckBoxClick_applicant_belongsTo0);

//tick inside create check_box...
var create_tick_path_applicant_belongsTo0 = "M " + (createCheckBox_applicant_belongsTo0.node.x.animVal.value + 1) + " " + (createCheckBox_applicant_belongsTo0.node.y.animVal.value + 6) + "L " + (createCheckBox_applicant_belongsTo0.node.x.animVal.value + 5) + " " + (createCheckBox_applicant_belongsTo0.node.y.animVal.value + 10) + "L " + (createCheckBox_applicant_belongsTo0.node.x.animVal.value + createCheckBox_applicant_belongsTo0.node.width.animVal.value) + " " + (createCheckBox_applicant_belongsTo0.node.y.animVal.value - 2);
var create_tick_applicant_belongsTo0 = applicant_belongsTo0.path(create_tick_path_applicant_belongsTo0);
create_tick_applicant_belongsTo0.click(createCheckBoxClick_applicant_belongsTo0);
create_tick_applicant_belongsTo0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside listing check_box...
var listing_tick_path_applicant_belongsTo0 = "M " + (listingCheckBox_applicant_belongsTo0.node.x.animVal.value + 1) + " " + (listingCheckBox_applicant_belongsTo0.node.y.animVal.value + 6) + "L " + (listingCheckBox_applicant_belongsTo0.node.x.animVal.value + 5) + " " + (listingCheckBox_applicant_belongsTo0.node.y.animVal.value + 10) + "L " + (listingCheckBox_applicant_belongsTo0.node.x.animVal.value + listingCheckBox_applicant_belongsTo0.node.width.animVal.value) + " " + (listingCheckBox_applicant_belongsTo0.node.y.animVal.value - 2);
var listing_tick_applicant_belongsTo0 = applicant_belongsTo0.path(listing_tick_path_applicant_belongsTo0);
listing_tick_applicant_belongsTo0.click(listingCheckBoxClick_applicant_belongsTo0);
listing_tick_applicant_belongsTo0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var update_tick_path_applicant_belongsTo0 = "M " + (updateCheckBox_applicant_belongsTo0.node.x.animVal.value + 1) + " " + (updateCheckBox_applicant_belongsTo0.node.y.animVal.value + 6) + "L " + (updateCheckBox_applicant_belongsTo0.node.x.animVal.value + 5) + " " + (updateCheckBox_applicant_belongsTo0.node.y.animVal.value + 10) + "L " + (updateCheckBox_applicant_belongsTo0.node.x.animVal.value + updateCheckBox_applicant_belongsTo0.node.width.animVal.value) + " " + (updateCheckBox_applicant_belongsTo0.node.y.animVal.value - 2);
var update_tick_applicant_belongsTo0 = applicant_belongsTo0.path(update_tick_path_applicant_belongsTo0);
update_tick_applicant_belongsTo0.click(listingCheckBoxClick_applicant_belongsTo0);
update_tick_applicant_belongsTo0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var deleate_tick_path_applicant_belongsTo0 = "M " + (deleateCheckBox_applicant_belongsTo0.node.x.animVal.value + 1) + " " + (deleateCheckBox_applicant_belongsTo0.node.y.animVal.value + 6) + "L " + (deleateCheckBox_applicant_belongsTo0.node.x.animVal.value + 5) + " " + (deleateCheckBox_applicant_belongsTo0.node.y.animVal.value + 10) + "L " + (deleateCheckBox_applicant_belongsTo0.node.x.animVal.value + deleateCheckBox_applicant_belongsTo0.node.width.animVal.value) + " " + (deleateCheckBox_applicant_belongsTo0.node.y.animVal.value - 2);
var deleate_tick_applicant_belongsTo0 = applicant_belongsTo0.path(deleate_tick_path_applicant_belongsTo0);
deleate_tick_applicant_belongsTo0.click(listingCheckBoxClick_applicant_belongsTo0);
deleate_tick_applicant_belongsTo0.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

var crud_opt_group_applicant_belongsTo0 = applicant_belongsTo0.group(crud_opt_applicant_belongsTo0, create_applicant_belongsTo0, listing_applicant_belongsTo0, update_applicant_belongsTo0, deleate_applicant_belongsTo0, createCheckBox_applicant_belongsTo0, listingCheckBox_applicant_belongsTo0, updateCheckBox_applicant_belongsTo0, deleateCheckBox_applicant_belongsTo0, create_tick_applicant_belongsTo0, listing_tick_applicant_belongsTo0, update_tick_applicant_belongsTo0, deleate_tick_applicant_belongsTo0);
crud_opt_group_applicant_belongsTo0.attr({
    'display': 'none'
})

var leaveToApplicantPath = "M " + (block_leave.node.x.animVal.value + block_leave.node.width.animVal.value ) + " " + (block_leave.node.y.animVal.value + 50) + "H " + (block_leave.node.x.animVal.value + block_leave.node.width.animVal.value + 20)+ "V " +  (block_applicant_belongsTo0.node.y.animVal.value + 50) + "H " +  (block_applicant_belongsTo0.node.x.animVal.value);
var leaveToApplicant = leave.path(leaveToApplicantPath);
leaveToApplicant.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1
})

//polygon {Arrow at end of line toward related model}
var leaveToApplicantArrowPoints = [block_applicant_belongsTo0.node.x.animVal.value,(block_applicant_belongsTo0.node.y.animVal.value+50),(block_applicant_belongsTo0.node.x.animVal.value-10),(block_applicant_belongsTo0.node.y.animVal.value+50-10),(block_applicant_belongsTo0.node.x.animVal.value-10),(block_applicant_belongsTo0.node.y.animVal.value+50+10)];
var leaveToApplicantArrow = leave.polygon(leaveToApplicantArrowPoints);
leaveToApplicantArrow.attr({
    fill: "#1f2c39",
    stroke: "#1f2c39",
    strokeWidth: 1,
});

//relation type on top of arrow head {text}...
var leaveToApplicantrelationType = leave.text(0, 0, "Belongsto");
leaveToApplicantrelationType.attr({
    x : (block_applicant_belongsTo0.node.x.animVal.value - 120),
    y : (block_applicant_belongsTo0.node.y.animVal.value+40),
    stroke: "#8a8a8a",
})
//prepend relation type text...
leaveToApplicantrelationType.prependTo(Snap(leave));

//now prepend these line, because these line overlap components come after it...
leaveToApplicant.prependTo(Snap(leave));



//push main model object inside relationSchema array...
relationSchema.push({
    "modelName" : "supervisor",
    "properties" : [
    {
        "field" : "name" , 
        "type" : "string",
        "required" : "false"
    },
    
    ],
    "operations" : {
    "createOperation" : false,
    "readOperation" : false,
    "updateOperation" : false,
    "deleateOperation" : false
    },
    "relations" : [],
    "ACL" :[]
});

//get access to id
var supervisor = Snap("#supervisor");

//modal rectangle...
var drag_title_supervisor = Snap.parse('<title>Drag and Drop here related model if exist for generate relation inside form, Double click to show details</title>');

var block_supervisor = supervisor.rect(20, 20, 150, 100, 5, 5);
block_supervisor.attr({
    fill: "rgb(236, 240, 241)",
    stroke: "#1f2c39",
    strokeWidth: 1,
    'stroke-dasharray': 5
});
block_supervisor.append(drag_title_supervisor);


//get modal properties...JSON.stringify(data)
var supervisorProperties = {"name":{"type":"string"}};

//attach double click event on modal which trigger and display properties panel...
block_supervisor.dblclick(function(){
    displayPropPanel('supervisor');
});

//modal text populate inside modal rect...
var text_supervisor = supervisor.text(0, 0, "SUPERVISOR!");
text_supervisor.attr({
    x: block_supervisor.node.x.animVal.value + 10,
    y: block_supervisor.node.y.animVal.value + 20,
    'font-size': 13
});
// line separates modal head and body...
var line_supervisor = supervisor.line(0, 0, 0, 0);
line_supervisor.attr({
    x1: block_supervisor.node.x.animVal.value,
    y1: Number(text_supervisor.node.attributes.y.nodeValue) + 5,
    x2: block_supervisor.node.x.animVal.value + block_supervisor.node.width.animVal.value,
    y2: Number(text_supervisor.node.attributes.y.nodeValue) + 5,
    stroke: "#1f2c39",
    strokeWidth: 1,
    strokeLinecap: "round"
});

// change coordinates of line and mode1_rect according to text
/*block_supervisor.attr({
    width: Number(text_supervisor.node.attributes.x.value) + (Number(text_supervisor.node.textContent.length) * 10 + 30)
});
line_supervisor.attr({
    x2: (block_supervisor.node.width.animVal.value + block_supervisor.node.x.animVal.value)
})*/

//tooltip on checkbox...
var select_title_supervisor = Snap.parse('<title>Click here to select model for CRUD Operations , if unchecked Crud form are not created</title>');

//select box checked when modal form is created
var select_supervisor = supervisor.rect(0, 0, 15, 15, 2, 2);
select_supervisor.attr({
    x: (block_supervisor.node.width.animVal.value + block_supervisor.node.x.animVal.value - 10),
    y: (block_supervisor.node.y.animVal.value - 10),
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 2
});
select_supervisor.append(select_title_supervisor);

//check symbol inside select box...
var tick_path_supervisor = "M " + (select_supervisor.node.x.animVal.value + 3) + " " + (select_supervisor.node.y.animVal.value + 5) + "L " + (select_supervisor.node.x.animVal.value + 7) + " " + (select_supervisor.node.y.animVal.value + 10) + "L " + (select_supervisor.node.x.animVal.value + select_supervisor.node.width.animVal.value) + " " + (select_supervisor.node.y.animVal.value - 3);
var tick_supervisor = supervisor.path(tick_path_supervisor)
tick_supervisor.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

//check and uncheck function on checkbox...
var checked_supervisor = false;
var selectCheckBox_supervisor = function () {
    if (!checked_supervisor) {
        //  crud_opt_group.removeClass('animated bounceOutUp')
        crud_opt_group_supervisor.attr({
            'display': 'block'
        })

        tick_supervisor.attr({ display : "block"});
        // crud_opt_group_supervisor.addClass('animated bounceInUp');
        checked_supervisor = true;
    } else if (checked_supervisor) {
        crud_opt_group_supervisor.attr({
            'display': 'none'
        })
        tick_supervisor.attr({ display : "none"});
        // crud_opt_group.removeClass('animated bounceInUp');
        // crud_opt_group.addClass('animated bounceOutUp')
        checked_supervisor = false;
    }
};
select_supervisor.click(selectCheckBox_supervisor);
tick_supervisor.click(selectCheckBox_supervisor);

//Crud Rect...
var crud_opt_supervisor = supervisor.rect(0, 0, 80, 90, 5, 5);
crud_opt_supervisor.attr({
    x: (select_supervisor.node.x.animVal.value + 15),
    y: (select_supervisor.node.y.animVal.value + 20),
    fill: "white",
    stroke: "#1f2c39",
    'stroke-dasharray': 10
})

//Crud options inside Crud_opt rect...
var create_supervisor = supervisor.text(0, 0, "-   create");
create_supervisor.attr({
    x: (crud_opt_supervisor.node.x.animVal.value + 5),
    y: (crud_opt_supervisor.node.y.animVal.value + 20),
    'font-size': 15
});
var listing_supervisor = supervisor.text(0, 0, "-   Listing");
listing_supervisor.attr({
    x: (crud_opt_supervisor.node.x.animVal.value + 5),
    y: (crud_opt_supervisor.node.y.animVal.value + 40),
    'font-size': 15
});
var update_supervisor = supervisor.text(0, 0, "-   update");
update_supervisor.attr({
    x: (crud_opt_supervisor.node.x.animVal.value + 5),
    y: (crud_opt_supervisor.node.y.animVal.value + 60),
    'font-size': 15
});
var deleate_supervisor = supervisor.text(0, 0, "-   delete");
deleate_supervisor.attr({
    x: (crud_opt_supervisor.node.x.animVal.value + 5),
    y: (crud_opt_supervisor.node.y.animVal.value + 80),
    'font-size': 15
});

//check and uncheck Crud options functions...
var createCheckBoxClicked_supervisor = false;
var createCheckBoxClick_supervisor = function () {
    if (!createCheckBoxClicked_supervisor) {
        create_tick_supervisor.attr({
            display: "block"
        });
        createCheckBoxClicked_supervisor = true;
        relationSchema[3].operations.createOperation = true;
    } else if (createCheckBoxClicked_supervisor) {
        create_tick_supervisor.attr({
            display: "none"
        });
        createCheckBoxClicked_supervisor = false;
        relationSchema[3].operations.createOperation = false;
    }
}
//listing check all three remaining options include listing , delete , edit
var listingCheckBoxClicked_supervisor = false;
var listingCheckBoxClick_supervisor = function () {
    if (!listingCheckBoxClicked_supervisor) {
        listing_tick_supervisor.attr({
            display: "block"
        });
        update_tick_supervisor.attr({
            display: "block"
        });
        deleate_tick_supervisor.attr({
            display: "block"
        });
        listingCheckBoxClicked_supervisor = true;
        relationSchema[3].operations.deleateOperation = true; 
        relationSchema[3].operations.readOperation = true; 
        relationSchema[3].operations.updateOperation = true;
    } else if (listingCheckBoxClicked_supervisor) {
        listing_tick_supervisor.attr({
            display: "none"
        });
        update_tick_supervisor.attr({
            display: "none"
        });
        deleate_tick_supervisor.attr({
            display: "none"
        });
        listingCheckBoxClicked_supervisor = false;
        relationSchema[3].operations.deleateOperation = false; 
        relationSchema[3].operations.readOperation = false; 
        relationSchema[3].operations.updateOperation = false
    }
}

//now set checkboxes on front of Crud operations...
var createCheckBox_supervisor = supervisor.rect(0, 0, 12, 12, 1, 1);
createCheckBox_supervisor.attr({
    x: (Number(create_supervisor.node.attributes.x.nodeValue) + 60),
    y: (create_supervisor.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
createCheckBox_supervisor.click(createCheckBoxClick_supervisor);
var listingCheckBox_supervisor = supervisor.rect(0, 0, 12, 12, 1, 1);
listingCheckBox_supervisor.attr({
    x: (Number(listing_supervisor.node.attributes.x.nodeValue) + 60),
    y: (listing_supervisor.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
listingCheckBox_supervisor.click(listingCheckBoxClick_supervisor);
var updateCheckBox_supervisor = supervisor.rect(0, 0, 12, 12, 1, 1);
updateCheckBox_supervisor.attr({
    x: (Number(update_supervisor.node.attributes.x.nodeValue) + 60),
    y: (update_supervisor.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
updateCheckBox_supervisor.click(listingCheckBoxClick_supervisor);
var deleateCheckBox_supervisor = supervisor.rect(0, 0, 12, 12, 1, 1);
deleateCheckBox_supervisor.attr({
    x: (Number(deleate_supervisor.node.attributes.x.nodeValue) + 60),
    y: (deleate_supervisor.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
deleateCheckBox_supervisor.click(listingCheckBoxClick_supervisor);

//tick inside create check_box...
var create_tick_path_supervisor = "M " + (createCheckBox_supervisor.node.x.animVal.value + 1) + " " + (createCheckBox_supervisor.node.y.animVal.value + 6) + "L " + (createCheckBox_supervisor.node.x.animVal.value + 5) + " " + (createCheckBox_supervisor.node.y.animVal.value + 10) + "L " + (createCheckBox_supervisor.node.x.animVal.value + createCheckBox_supervisor.node.width.animVal.value) + " " + (createCheckBox_supervisor.node.y.animVal.value - 2);
var create_tick_supervisor = supervisor.path(create_tick_path_supervisor);
create_tick_supervisor.click(createCheckBoxClick_supervisor);
create_tick_supervisor.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside listing check_box...
var listing_tick_path_supervisor = "M " + (listingCheckBox_supervisor.node.x.animVal.value + 1) + " " + (listingCheckBox_supervisor.node.y.animVal.value + 6) + "L " + (listingCheckBox_supervisor.node.x.animVal.value + 5) + " " + (listingCheckBox_supervisor.node.y.animVal.value + 10) + "L " + (listingCheckBox_supervisor.node.x.animVal.value + listingCheckBox_supervisor.node.width.animVal.value) + " " + (listingCheckBox_supervisor.node.y.animVal.value - 2);
var listing_tick_supervisor = supervisor.path(listing_tick_path_supervisor);
listing_tick_supervisor.click(listingCheckBoxClick_supervisor);
listing_tick_supervisor.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var update_tick_path_supervisor = "M " + (updateCheckBox_supervisor.node.x.animVal.value + 1) + " " + (updateCheckBox_supervisor.node.y.animVal.value + 6) + "L " + (updateCheckBox_supervisor.node.x.animVal.value + 5) + " " + (updateCheckBox_supervisor.node.y.animVal.value + 10) + "L " + (updateCheckBox_supervisor.node.x.animVal.value + updateCheckBox_supervisor.node.width.animVal.value) + " " + (updateCheckBox_supervisor.node.y.animVal.value - 2);
var update_tick_supervisor = supervisor.path(update_tick_path_supervisor);
update_tick_supervisor.click(listingCheckBoxClick_supervisor);
update_tick_supervisor.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var deleate_tick_path_supervisor = "M " + (deleateCheckBox_supervisor.node.x.animVal.value + 1) + " " + (deleateCheckBox_supervisor.node.y.animVal.value + 6) + "L " + (deleateCheckBox_supervisor.node.x.animVal.value + 5) + " " + (deleateCheckBox_supervisor.node.y.animVal.value + 10) + "L " + (deleateCheckBox_supervisor.node.x.animVal.value + deleateCheckBox_supervisor.node.width.animVal.value) + " " + (deleateCheckBox_supervisor.node.y.animVal.value - 2);
var deleate_tick_supervisor = supervisor.path(deleate_tick_path_supervisor);
deleate_tick_supervisor.click(listingCheckBoxClick_supervisor);
deleate_tick_supervisor.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

var crud_opt_group_supervisor = supervisor.group(crud_opt_supervisor, create_supervisor, listing_supervisor, update_supervisor, deleate_supervisor, createCheckBox_supervisor, listingCheckBox_supervisor, updateCheckBox_supervisor, deleateCheckBox_supervisor, create_tick_supervisor, listing_tick_supervisor, update_tick_supervisor, deleate_tick_supervisor);
crud_opt_group_supervisor.attr({
    'display': 'none'
})

//relative modals svg...


//push main model object inside relationSchema array...
relationSchema.push({
    "modelName" : "test",
    "properties" : [
    {
        "field" : "testname" , 
        "type" : "string",
        "required" : "false"
    },
    
    ],
    "operations" : {
    "createOperation" : false,
    "readOperation" : false,
    "updateOperation" : false,
    "deleateOperation" : false
    },
    "relations" : [],
    "ACL" :[]
});

//get access to id
var test = Snap("#test");

//modal rectangle...
var drag_title_test = Snap.parse('<title>Drag and Drop here related model if exist for generate relation inside form, Double click to show details</title>');

var block_test = test.rect(20, 20, 150, 100, 5, 5);
block_test.attr({
    fill: "rgb(236, 240, 241)",
    stroke: "#1f2c39",
    strokeWidth: 1,
    'stroke-dasharray': 5
});
block_test.append(drag_title_test);


//get modal properties...JSON.stringify(data)
var testProperties = {"testname":{"type":"string"}};

//attach double click event on modal which trigger and display properties panel...
block_test.dblclick(function(){
    displayPropPanel('test');
});

//modal text populate inside modal rect...
var text_test = test.text(0, 0, "TEST!");
text_test.attr({
    x: block_test.node.x.animVal.value + 10,
    y: block_test.node.y.animVal.value + 20,
    'font-size': 13
});
// line separates modal head and body...
var line_test = test.line(0, 0, 0, 0);
line_test.attr({
    x1: block_test.node.x.animVal.value,
    y1: Number(text_test.node.attributes.y.nodeValue) + 5,
    x2: block_test.node.x.animVal.value + block_test.node.width.animVal.value,
    y2: Number(text_test.node.attributes.y.nodeValue) + 5,
    stroke: "#1f2c39",
    strokeWidth: 1,
    strokeLinecap: "round"
});

// change coordinates of line and mode1_rect according to text
/*block_test.attr({
    width: Number(text_test.node.attributes.x.value) + (Number(text_test.node.textContent.length) * 10 + 30)
});
line_test.attr({
    x2: (block_test.node.width.animVal.value + block_test.node.x.animVal.value)
})*/

//tooltip on checkbox...
var select_title_test = Snap.parse('<title>Click here to select model for CRUD Operations , if unchecked Crud form are not created</title>');

//select box checked when modal form is created
var select_test = test.rect(0, 0, 15, 15, 2, 2);
select_test.attr({
    x: (block_test.node.width.animVal.value + block_test.node.x.animVal.value - 10),
    y: (block_test.node.y.animVal.value - 10),
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 2
});
select_test.append(select_title_test);

//check symbol inside select box...
var tick_path_test = "M " + (select_test.node.x.animVal.value + 3) + " " + (select_test.node.y.animVal.value + 5) + "L " + (select_test.node.x.animVal.value + 7) + " " + (select_test.node.y.animVal.value + 10) + "L " + (select_test.node.x.animVal.value + select_test.node.width.animVal.value) + " " + (select_test.node.y.animVal.value - 3);
var tick_test = test.path(tick_path_test)
tick_test.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

//check and uncheck function on checkbox...
var checked_test = false;
var selectCheckBox_test = function () {
    if (!checked_test) {
        //  crud_opt_group.removeClass('animated bounceOutUp')
        crud_opt_group_test.attr({
            'display': 'block'
        })

        tick_test.attr({ display : "block"});
        // crud_opt_group_test.addClass('animated bounceInUp');
        checked_test = true;
    } else if (checked_test) {
        crud_opt_group_test.attr({
            'display': 'none'
        })
        tick_test.attr({ display : "none"});
        // crud_opt_group.removeClass('animated bounceInUp');
        // crud_opt_group.addClass('animated bounceOutUp')
        checked_test = false;
    }
};
select_test.click(selectCheckBox_test);
tick_test.click(selectCheckBox_test);

//Crud Rect...
var crud_opt_test = test.rect(0, 0, 80, 90, 5, 5);
crud_opt_test.attr({
    x: (select_test.node.x.animVal.value + 15),
    y: (select_test.node.y.animVal.value + 20),
    fill: "white",
    stroke: "#1f2c39",
    'stroke-dasharray': 10
})

//Crud options inside Crud_opt rect...
var create_test = test.text(0, 0, "-   create");
create_test.attr({
    x: (crud_opt_test.node.x.animVal.value + 5),
    y: (crud_opt_test.node.y.animVal.value + 20),
    'font-size': 15
});
var listing_test = test.text(0, 0, "-   Listing");
listing_test.attr({
    x: (crud_opt_test.node.x.animVal.value + 5),
    y: (crud_opt_test.node.y.animVal.value + 40),
    'font-size': 15
});
var update_test = test.text(0, 0, "-   update");
update_test.attr({
    x: (crud_opt_test.node.x.animVal.value + 5),
    y: (crud_opt_test.node.y.animVal.value + 60),
    'font-size': 15
});
var deleate_test = test.text(0, 0, "-   delete");
deleate_test.attr({
    x: (crud_opt_test.node.x.animVal.value + 5),
    y: (crud_opt_test.node.y.animVal.value + 80),
    'font-size': 15
});

//check and uncheck Crud options functions...
var createCheckBoxClicked_test = false;
var createCheckBoxClick_test = function () {
    if (!createCheckBoxClicked_test) {
        create_tick_test.attr({
            display: "block"
        });
        createCheckBoxClicked_test = true;
        relationSchema[4].operations.createOperation = true;
    } else if (createCheckBoxClicked_test) {
        create_tick_test.attr({
            display: "none"
        });
        createCheckBoxClicked_test = false;
        relationSchema[4].operations.createOperation = false;
    }
}
//listing check all three remaining options include listing , delete , edit
var listingCheckBoxClicked_test = false;
var listingCheckBoxClick_test = function () {
    if (!listingCheckBoxClicked_test) {
        listing_tick_test.attr({
            display: "block"
        });
        update_tick_test.attr({
            display: "block"
        });
        deleate_tick_test.attr({
            display: "block"
        });
        listingCheckBoxClicked_test = true;
        relationSchema[4].operations.deleateOperation = true; 
        relationSchema[4].operations.readOperation = true; 
        relationSchema[4].operations.updateOperation = true;
    } else if (listingCheckBoxClicked_test) {
        listing_tick_test.attr({
            display: "none"
        });
        update_tick_test.attr({
            display: "none"
        });
        deleate_tick_test.attr({
            display: "none"
        });
        listingCheckBoxClicked_test = false;
        relationSchema[4].operations.deleateOperation = false; 
        relationSchema[4].operations.readOperation = false; 
        relationSchema[4].operations.updateOperation = false
    }
}

//now set checkboxes on front of Crud operations...
var createCheckBox_test = test.rect(0, 0, 12, 12, 1, 1);
createCheckBox_test.attr({
    x: (Number(create_test.node.attributes.x.nodeValue) + 60),
    y: (create_test.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
createCheckBox_test.click(createCheckBoxClick_test);
var listingCheckBox_test = test.rect(0, 0, 12, 12, 1, 1);
listingCheckBox_test.attr({
    x: (Number(listing_test.node.attributes.x.nodeValue) + 60),
    y: (listing_test.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
listingCheckBox_test.click(listingCheckBoxClick_test);
var updateCheckBox_test = test.rect(0, 0, 12, 12, 1, 1);
updateCheckBox_test.attr({
    x: (Number(update_test.node.attributes.x.nodeValue) + 60),
    y: (update_test.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
});
updateCheckBox_test.click(listingCheckBoxClick_test);
var deleateCheckBox_test = test.rect(0, 0, 12, 12, 1, 1);
deleateCheckBox_test.attr({
    x: (Number(deleate_test.node.attributes.x.nodeValue) + 60),
    y: (deleate_test.node.attributes.y.nodeValue - 10),
    fill: "white",
    stroke: "#1f2c39",
})
deleateCheckBox_test.click(listingCheckBoxClick_test);

//tick inside create check_box...
var create_tick_path_test = "M " + (createCheckBox_test.node.x.animVal.value + 1) + " " + (createCheckBox_test.node.y.animVal.value + 6) + "L " + (createCheckBox_test.node.x.animVal.value + 5) + " " + (createCheckBox_test.node.y.animVal.value + 10) + "L " + (createCheckBox_test.node.x.animVal.value + createCheckBox_test.node.width.animVal.value) + " " + (createCheckBox_test.node.y.animVal.value - 2);
var create_tick_test = test.path(create_tick_path_test);
create_tick_test.click(createCheckBoxClick_test);
create_tick_test.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside listing check_box...
var listing_tick_path_test = "M " + (listingCheckBox_test.node.x.animVal.value + 1) + " " + (listingCheckBox_test.node.y.animVal.value + 6) + "L " + (listingCheckBox_test.node.x.animVal.value + 5) + " " + (listingCheckBox_test.node.y.animVal.value + 10) + "L " + (listingCheckBox_test.node.x.animVal.value + listingCheckBox_test.node.width.animVal.value) + " " + (listingCheckBox_test.node.y.animVal.value - 2);
var listing_tick_test = test.path(listing_tick_path_test);
listing_tick_test.click(listingCheckBoxClick_test);
listing_tick_test.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var update_tick_path_test = "M " + (updateCheckBox_test.node.x.animVal.value + 1) + " " + (updateCheckBox_test.node.y.animVal.value + 6) + "L " + (updateCheckBox_test.node.x.animVal.value + 5) + " " + (updateCheckBox_test.node.y.animVal.value + 10) + "L " + (updateCheckBox_test.node.x.animVal.value + updateCheckBox_test.node.width.animVal.value) + " " + (updateCheckBox_test.node.y.animVal.value - 2);
var update_tick_test = test.path(update_tick_path_test);
update_tick_test.click(listingCheckBoxClick_test);
update_tick_test.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});
//tick inside create check_box...
var deleate_tick_path_test = "M " + (deleateCheckBox_test.node.x.animVal.value + 1) + " " + (deleateCheckBox_test.node.y.animVal.value + 6) + "L " + (deleateCheckBox_test.node.x.animVal.value + 5) + " " + (deleateCheckBox_test.node.y.animVal.value + 10) + "L " + (deleateCheckBox_test.node.x.animVal.value + deleateCheckBox_test.node.width.animVal.value) + " " + (deleateCheckBox_test.node.y.animVal.value - 2);
var deleate_tick_test = test.path(deleate_tick_path_test);
deleate_tick_test.click(listingCheckBoxClick_test);
deleate_tick_test.attr({
    fill: "white",
    stroke: "#1f2c39",
    strokeWidth: 1,
    display: "none"
});

var crud_opt_group_test = test.group(crud_opt_test, create_test, listing_test, update_test, deleate_test, createCheckBox_test, listingCheckBox_test, updateCheckBox_test, deleateCheckBox_test, create_tick_test, listing_tick_test, update_tick_test, deleate_tick_test);
crud_opt_group_test.attr({
    'display': 'none'
})

//relative modals svg...


var roles = new Array();
//deny all operations for roles {ACLS}
$.get("http://localhost:3000/api/Roles", function( data ) {
    data.push({
        "name" : "$everyone",
        "description" : "Loopback default role"
    },{
        "name" : "$owner",
        "description" : "Loopback default role"
    },{
        "name" : "$authenticated",
        "description" : "Loopback default role"
    },{
        "name" : "$unauthenticated",
        "description" : "Loopback default role"
    });
    roles = data;
   /*for(var i=0; i < relationSchema.length ; i++){
        for(var j=0 ; j < roles.length ; j++){
            if (roles[j].name == "$everyone"){
                relationSchema[i].ACL.push({
                    "principalType": "ROLE",
                    "principalId": roles[j].name,
                    "permission": "DENY"
                });
            }
        }
    }*/
});

//function createSchema generate schema file on server side...
function createSchema(){
    
    schema = relationSchema;
    for (var i=0 ; i< schema.length ; i++){
        for (var j=0 ; j < schema.length; j++){
            if (schema[j].relations.length >0){
                for (var k=0 ; k < schema[j].relations.length;k++){
                    if (schema[i].modelName ==schema[j].relations[k].modelName){
                        schema[i].operations.createOperation =false;
                    }
                }
            }
        }
    }    console.log(relationSchema);
    
    
    schema = JSON.stringify(schema);
    $.post("http://localhost:3000/save_schema",{schema : schema}, function(response){
    console.log(response)
    });
}

//function called on model doubleClick and displays property and ACL's panel...
function displayPropPanel(modelName){
    $("#infoi").css("display", "block");                                //=> display properties panel
    $("#roleTable").find("tr:gt(0)").remove();                          //=> remove all roles from table
    $('#aclSelectRole').html('');
    roles.forEach(function(role) {
        $('#roleTable tr:last').after("<tr> <td>" + role.name + "</td> <td>" + role.description + "</td></tr>");    
        $('#aclSelectRole').append('<option value=' + role.name + '>' + role.name+ '</option>');         
    });
    $("#propTable").find("tr:gt(0)").remove();                          //=> remove all properties from table
    var modelProperties = this[modelName + 'Properties'];                
    for (prop in modelProperties) {                                     //=>create rows inside properties panel dynamically
        $('#propTable tr:last').after("<tr onclick='setfieldProperties(\"" + prop + "\",\"" + modelName + "\")'> <td>" + prop + "</td> <td>" + modelProperties[prop].type + "</td></tr>");        
    }
}

var selectedModelName , selectedPropertyName;

//set field properties...
function setfieldProperties(propertyName , modelName) {
    selectedModelName = modelName; selectedPropertyName = propertyName;
    $("#propertySetting").css('display', 'block');
    $("#propertySettingHeading").text(propertyName);

    //empty fields after submit info...
    $('#modal_prop_label').val('');
    $("option[name='defaultRequired']").prop('selected',true);
    $('#modal_prop_placeholder').val('');
    $('#modal_prop_pattern').val('');
    $('#modal_prop_min').val('');
    $('#modal_prop_max').val('');
    $('#modal_prop_title').val('');
};

//save model properties details...
function saveProperties(){    
    var modelProperties = {
        "required" : false, 
        "label" : $('#modal_prop_label').val(),
        "type" : $( "#modal_prop_type option:selected" ).text(),
        "placeholder" : $('#modal_prop_placeholder').val(),
        "pattern" : $('#modal_prop_pattern').val(),
        "min" : $('#modal_prop_min').val(),
        "max" : $('#modal_prop_max').val(),
        "title" : $('#modal_prop_title').val(),
        
    };
    if ($('#modal_prop_required').is(":checked")){
        modelProperties.required = true;
    }
    if (Number($("#modal_prop_max").val()) < Number($("#modal_prop_min").val()) && $("#modal_prop_max").val() != "")
        modelProperties.max = $("#modal_prop_min").val();


    //push properties data in relationSchema array...
    for (var i=0 ; i < relationSchema.length ; i++){
        if (relationSchema[i].modelName == selectedModelName){
            for (var j=0 ; j< relationSchema[i].properties.length ; j++){
                if (relationSchema[i].properties[j].field == selectedPropertyName){
                    relationSchema[i].properties[j].required = modelProperties.required;
                    relationSchema[i].properties[j].label = modelProperties.label;
                    relationSchema[i].properties[j].type = modelProperties.type;
                    relationSchema[i].properties[j].placeholder = modelProperties.placeholder;
                    relationSchema[i].properties[j].pattern = modelProperties.pattern;
                    relationSchema[i].properties[j].min = modelProperties.min;
                    relationSchema[i].properties[j].max = modelProperties.max;
                    relationSchema[i].properties[j].title = modelProperties.title;
                }
            }
        }
    }

    //empty fields after submit info...
    $('#modal_prop_label').val('');
    $("option[name='defaultRequired']").prop('selected',true);
    $('#modal_prop_placeholder').val('');
    $('#modal_prop_pattern').val('');
    $('#modal_prop_min').val('');
    $('#modal_prop_max').val('');
    $('#modal_prop_title').val('');
}

//add ACL to models...
function addPermission(modelName){
    var aclSelectedRole = $( "#aclSelectRole option:selected" ).text();
    var view = add = deleate = update = relationsOpt = false;
    if ($('#idView').is(":checked")) view = true;
    if ($('#idAdd').is(":checked")) add=true;
    if ($('#idUpdate').is(":checked")) update = true;
    if ($('#idDelete').is(":checked")) deleate = true;
    if ($('#idRelations').is(":checked")) relationsOpt = true;

    var relBelongsTo = [], relHasOne = [], relHasMany =[], relHasManyThrough =[], relHasAndBelongsToMany =[];

    for (var j=0 ; j< model_schema.length; j++){            
        if (model_schema[j].name.toLowerCase() == modelName.toLowerCase()){  
            for (var rel in model_schema[j].relations) {
                if (model_schema[j].relations[rel].type == 'belongsTo'){
                    relBelongsTo.push({
                        "belongsTo" : true,
                        "relation" : model_schema[j].relations[rel].model,
                        "model" : model_schema[j].name
                    });
                }
                if (model_schema[j].relations[rel].type == 'hasOne'){
                    relHasOne.push({
                        "hasOne" : true,
                        "relation" : model_schema[j].relations[rel].model,
                        "model" : model_schema[j].name
                    });
                }
                if (model_schema[j].relations[rel].type == 'hasMany'){
                    relHasMany.push({
                        "hasMany" : true,
                        "relation" : model_schema[j].relations[rel].model,
                        "model" : model_schema[j].name
                    });
                }
                if (model_schema[j].relations[rel].type == 'hasManyThrough'){
                    relHasManyThrough.push({
                        "hasManyThrough" : true,
                        "relation" : model_schema[j].relations[rel].model,
                        "model" : model_schema[j].name
                    });
                }
                if (model_schema[j].relations[rel].type == 'hasAndBelongsToMany'){
                    relHasAndBelongsToMany = true;
                    relHasAndBelongsToMany.push({
                        "hasAndBelongsToMany" : true,
                        "relation" : model_schema[j].relations[rel].model,
                        "model" : model_schema[j].name
                    });
                }
            }
        }
    }

    //view checked...
    if (view){                                         //=> push acl in array in relationSchema
        for (var i=0 ; i< relationSchema.length ; i++){ 
            if(relationSchema[i].modelName == modelName){
                relationSchema[i].ACL.push({
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "ALLOW",
                    "property": "findById"
                },{
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "ALLOW",
                    "property": "find"
                });
            }
        }
    }else{
        for(var i=0; i < relationSchema.length ; i++){
            if(relationSchema[i].modelName == modelName){                
                for(var j=0 ; j < relationSchema[i].ACL.length ; j++){
                    if ((relationSchema[i].ACL[j].property == 'find' || relationSchema[i].ACL[j].property == 'findById') && relationSchema[i].ACL[j].principalId == aclSelectedRole){
                        relationSchema[i].ACL.splice(j, 1);
                    }
                }
                relationSchema[i].ACL.push({
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "DENY",
                    "property": "findById"
                },{
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "DENY",
                    "property": "find"
                });
            }
        }
    }

    //add Checked...
    if (add){                                         //=> push acl in array in relationSchema
        for (var i=0 ; i< relationSchema.length ; i++){ 
            if(relationSchema[i].modelName == modelName){
                relationSchema[i].ACL.push({
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "ALLOW",
                    "property": "create"
                },{
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "ALLOW",
                    "property": "replaceOrCreate"
                },{
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "ALLOW",
                    "property": "updateOrCreate"
                });
            }
        }
    }else{
        for(var i=0; i < relationSchema.length ; i++){
            if(relationSchema[i].modelName == modelName){                
                for(var j=0 ; j < relationSchema[i].ACL.length ; j++){
                    if ((relationSchema[i].ACL[j].property == 'create' || relationSchema[i].ACL[j].property == 'replaceOrCreate' || relationSchema[i].ACL[j].property == 'updateOrCreate') && relationSchema[i].ACL[j].principalId == aclSelectedRole){
                        relationSchema[i].ACL.splice(j, 1);
                    }
                }
                relationSchema[i].ACL.push({
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "DENY",
                    "property": "create"
                },{
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "DENY",
                    "property": "replaceOrCreate"
                },{
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "DENY",
                    "property": "updateOrCreate"
                });
            }
        }
    }

    //update Checked...
    if (update){                                     //=> push acl in array in relationSchema
        for (var i=0 ; i< relationSchema.length ; i++){ 
            if(relationSchema[i].modelName == modelName){
                relationSchema[i].ACL.push({
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "ALLOW",
                    "property": "updateById"
                });
            }
        }
    }else{
        for(var i=0; i < relationSchema.length ; i++){
            if(relationSchema[i].modelName == modelName){                
                for(var j=0 ; j < relationSchema[i].ACL.length ; j++){
                    if (relationSchema[i].ACL[j].property == 'updateById' && relationSchema[i].ACL[j].principalId == aclSelectedRole){
                        relationSchema[i].ACL.splice(j, 1);
                    }
                }
                relationSchema[i].ACL.push({
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "DENY",
                    "property": "updateById"
                });
            }
        }
    }

    //delete Checked...
    if (deleate){                                      //=> push acl in array in relationSchema
        for (var i=0 ; i< relationSchema.length ; i++){ 
            if(relationSchema[i].modelName == modelName){
                relationSchema[i].ACL.push({
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "ALLOW",
                    "property": "deleteById"
                });
            }
        }
    }else{
        for(var i=0; i < relationSchema.length ; i++){
            if(relationSchema[i].modelName == modelName){                
                for(var j=0 ; j < relationSchema[i].ACL.length ; j++){
                    if (relationSchema[i].ACL[j].property == 'deleteById' && relationSchema[i].ACL[j].principalId == aclSelectedRole){
                        relationSchema[i].ACL.splice(j, 1);
                    }
                }
                relationSchema[i].ACL.push({
                    "principalType": "ROLE",
                    "principalId": aclSelectedRole,
                    "permission": "DENY",
                    "property": "deleteById"
                });
            }
        }
    }
    /*//relations operations...
    if (relationsOpt){     //=> push acl in array in relationSchema
        for (var i=0 ; i< relationSchema.length ; i++){ 
            if(relationSchema[i].modelName == modelName){
                for (var j= 0; j< relBelongsTo.length ; j++){
                    if  (relBelongsTo[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__get__" + relBelongsTo[j].relation
                        }); 
                    }
                } 
                for (var j =0 ; j < relHasOne.length ; j++){
                    if (relHasOne[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__create__" + relHasOne[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__get__" + relHasOne[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__update__" + relHasOne[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__destroy__" + relHasOne[j].relation
                        });
                    }
                }
                for (var j =0 ; j < relHasMany.length ; j++){
                    if (relHasMany[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__create__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__get__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__count__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": " __findById__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__destroyById__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__delete__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__updateById__" + relHasMany[j].relations
                        });
                    }
                }
                for (var j =0 ; j < relHasManyThrough.length ; j++){
                    if (relHasManyThrough[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__link__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__exists__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__unlink__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__create__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__get__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__count__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": " __findById__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__destroyById__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__delete__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__updateById__" + relHasManyThrough[j].relation
                        });
                    }
                }
                for (var j =0 ; j < relHasAndBelongsToMany.length ; j++){
                    if (relHasAndBelongsToMany[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__link__" + relHasAndBelongsToMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "ALLOW",
                            "property": "__unlink__" + relHasAndBelongsToMany[j].relation
                        });
                    }
                }
            }
        }
    }else{
        for(var i=0; i < relationSchema.length ; i++){
            if(relationSchema[i].modelName == modelName){                
                for(var j=0 ; j < relationSchema[i].ACL.length ; j++){
                    for (var k=0 ; k< model_schema.length; k++){
                        if (model_schema[k].name.toLowerCase() == relationSchema[i].modelName.toLowerCase()){            
                            if (relationSchema[i].ACL[j].property == '__get__'+model_schema[k].relations.model && relationSchema[i].ACL[j].principalId == aclSelectedRole){     
                                relationSchema[i].ACL.splice(j, 1);                                
                            }  
                            if ((relationSchema[i].ACL[j].property == '__create__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__get__'+model_schema[k].relations.model ||relationSchema[i].ACL[j].property == '__update__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__destroy__'+model_schema[k].relations.model )&& relationSchema[i].ACL[j].principalId == aclSelectedRole){     
                                relationSchema[i].ACL.splice(j, 1);                                
                            }  
                            if ((relationSchema[i].ACL[j].property == '__count__'+model_schema[k].relations.model ||relationSchema[i].ACL[j].property == '__create__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__get__'+model_schema[k].relations.model ||relationSchema[i].ACL[j].property == '__updateById__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__destroyById__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__delete__'+model_schema[k].relations.model|| relationSchema[i].ACL[j].property == '__findById__'+model_schema[k].relations.model )&& relationSchema[i].ACL[j].principalId == aclSelectedRole){     
                                relationSchema[i].ACL.splice(j, 1);                                
                            }      
                            if ((relationSchema[i].ACL[j].property == '__count__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__create__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__get__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__updateById__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__destroyById__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__delete__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__findById__'+model_schema[k].relations.model || relationSchema[i].ACL[j].property == '__exists__'+model_schema[k].relations.model ||relationSchema[i].ACL[j].property == '__link__'+model_schema[k].relations.model ||relationSchema[i].ACL[j].property == '__unlink__'+model_schema[k].relations.model) && relationSchema[i].ACL[j].principalId == aclSelectedRole){     
                                relationSchema[i].ACL.splice(j, 1);
                            } 
                            if ((relationSchema[i].ACL[j].property == '__link__'+model_schema[k].relations.model  || relationSchema[i].ACL[j].property == '__unlink__'+model_schema[k].relations.model )&& relationSchema[i].ACL[j].principalId == aclSelectedRole){     
                                relationSchema[i].ACL.splice(j, 1);
                            }                 
                        }
                    }
                }
                for (var j= 0; j< relBelongsTo.length ; j++){
                    if  (relBelongsTo[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__get__" + relBelongsTo[j].relation
                        }); 
                    }
                } 
                for (var j =0 ; j < relHasOne.length ; j++){
                    if (relHasOne[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__create__" + relHasOne[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__get__" + relHasOne[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__update__" + relHasOne[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__destroy__" + relHasOne[j].relation
                        });
                    }
                }
                for (var j =0 ; j < relHasMany.length ; j++){
                    console.log(relHasMany[j] == modelName);
                    if (relHasMany[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__create__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__get__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__count__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": " __findById__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__destroyById__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__delete__" + relHasMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__updateById__" + relHasMany[j].relations
                        });
                    }
                }
                for (var j =0 ; j < relHasManyThrough.length ; j++){
                    if (relHasManyThrough[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__link__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__exists__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__unlink__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__create__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__get__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__count__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": " __findById__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__destroyById__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__delete__" + relHasManyThrough[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__updateById__" + relHasManyThrough[j].relation
                        });
                    }
                }
                for (var j =0 ; j < relHasAndBelongsToMany.length ; j++){
                    if (relHasAndBelongsToMany[j].model == modelName){
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__link__" + relHasAndBelongsToMany[j].relation
                        });
                        relationSchema[i].ACL.push({
                            "principalType": "ROLE",
                            "principalId": aclSelectedRole,
                            "permission": "DENY",
                            "property": "__unlink__" + relHasAndBelongsToMany[j].relation
                        });
                    }
                }
            }
        }
    }*/
}