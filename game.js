var width;
var height;

var originalWidth;
var originalHeight;

var global_oPieceSelected=null;
var global_teamToPlay="B";

var global_deltaY=120;


var tMap=new Array();
tMap=[
    ['BT','BF','BC','BQ','BK','BC','BF','BT'],
    ['BP','BP','BP','BP','BP','BP','BP','BP'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['WP','WP','WP','WP','WP','WP','WP','WP'],
    ['WT','WF','WC','WQ','WK','WC','WF','WT'],


];
var tPiece=new Array();
var tCase=new Array();

var iRatio;

var oPageSplashscreen;
var oPageMenu;
var oPageScene;
var oPageGameover;

function start(width_,height_){

    originalWidth=480;
    originalHeight=680;

    if(width_> height_){
        width=height_*(this.originalWidth/this.originalHeight)
    }else{
        width=width_;
    }

    height=width*(this.originalHeight/this.originalWidth);
    if(height<height_){
        height=height_;
    }

    iRatio=this.width/this.originalWidth;

    this.pageSplashscreen();


}
function ComponentQml(src_,x_,y_){
    this.oComponent =   Qt.createComponent( src_);
    this.object=this.oComponent.createObject(canvas,{"x": x_, "y": y_});

    if( this.oComponent.status === Component.Error ){
        console.debug("Error:"+ this.oComponent.errorString() );
    }
}

function click(x2_,y2_){
    if(global_oPieceSelected && global_oPieceSelected.canMoveTo(x2_,y2_)===true && isWalking(x2_,y2_)){
        global_oPieceSelected.moveTo(x2_,y2_);

        resetCases();
        resetSelected();
        switchTeam();
    }else if(global_oPieceSelected && global_oPieceSelected.canAttack(x2_,y2_)===true && isWalking(x2_,y2_)){
        global_oPieceSelected.attack(x2_,y2_);

        resetCases();
        resetSelected();
        switchTeam();
    }else if(tPiece[x2_+'_'+y2_].canBeSelected(global_teamToPlay)===true){
        resetCases();
        resetSelected();
        unfocusAll();
        tPiece[x2_+'_'+y2_].select();
        global_oPieceSelected=tPiece[x2_+'_'+y2_];

    }

}

function resetCases(){
    for(var caseId in tCase){
        tCase[caseId].reset();
        tPiece[caseId].object.reset();
    }
}
function unfocusAll(){
    for(var caseId in tCase){
        tCase[caseId].object.hide();
        tPiece[caseId].object.hide();
    }
}

function resetSelected(){
    if(global_oPieceSelected){
        global_oPieceSelected.reset();
    }
    global_oPieceSelected=null;

}

function switchTeam(){
    if(global_teamToPlay==='B'){
        global_teamToPlay='W';
    }else{
        global_teamToPlay='B';
    }

    oPageScene.object.switchTeam(global_teamToPlay);
}
function isWalking(x2_,y2_){
    var sId=x2_+'_'+y2_;
    if(!tCase[sId]){
        return false;
    }
    return tCase[sId].isWalking();
}

function startParty(){


    var sColor='N';

       for(var y2=0;y2<8;y2++){

           for(var x2=0;x2<8;x2++){

                var oCase;
                if(sColor=='N'){

                    oCase=new CaseN(x2,y2);

                    sColor='B';
                }else{

                    oCase=new CaseB(x2,y2);

                    sColor='N';
                }

                tCase[x2+'_'+y2]=oCase;

                //console.debug(sColor);

               var oPiece =new Piece(tMap[y2][x2], x2,y2);
                tPiece[x2+'_'+y2]=oPiece;

           }

           if(sColor=='N'){
               sColor='B';
           }else{
               sColor='N';
           }

       }
/*
       for(var i2=0;i2<=8;i2++){
            var oPiece =new Piece(tMap[0][i2], i2*calcul(60),0);
       }
*/

}


function calcul(iValue_){
    return (iValue_*iRatio);
}

function pageSplashscreen(){
    oPageSplashscreen=new ComponentQml('/Splashscreen.qml',0,0);
    oPageSplashscreen.object.display();
}
function pageMenu(){
    resetPages();
    oPageMenu=new ComponentQml('/Menu.qml',0,0);
}
function pageGameStart(){
    resetPages();
    oPageScene=new ComponentQml('/Scene.qml',0,0);

    startParty();
}
function pageGameOver(){
    resetPages();
    oPageGameover=new ComponentQml('/GameOver.qml',0,0);
    oPageGameover.object.display(global_teamToPlay);
}

function resetPages(){
    if(oPageSplashscreen ){
        oPageSplashscreen.object.destroy();
        oPageSplashscreen=null;
    }
    if(oPageMenu){
        oPageMenu.object.destroy();
        oPageMenu=null;
    }
    if(oPageScene){
        oPageScene.object.destroy();
        oPageScene=null;
    }
    if(oPageGameover){
        oPageGameover.object.destroy();
        oPageGameover=null;
    }
}


//---------------
//-------enemy

function Piece(sPiece_,x_,y_){

    var x2=x_*calcul(60);
    var y2=y_*calcul(60);
    y2+=calcul(global_deltaY);
    y2-=calcul(20);
    this.oComponent =   Qt.createComponent( "/Piece.qml");
    this.object=this.oComponent.createObject(oPageScene.object,{"x": x2, "y": y2,"_x":x_,"_y":y_,"_type":sPiece_});



    if( this.oComponent.status === Component.Error ){
        console.debug("Error:"+ this.oComponent.errorString() );
    }



    this.load=function(type_){
        this.object._type=type_;
        this.object.display();
    }

    this.getType=function(){
        return this.object._type.substr(1,1);
    }
    this.getTeam=function(){
        return this.object._type.substr(0,1);
    }
    this.getName=function(){
        return this.object._type;
    }

    this.getX2=function(){
        return this.object._x;
    }
    this.getY2=function(){
        return this.object._y;
    }

    this.isEmpty=function(){
        if(this.object._type===''){
            return true;
        }
        return false;
    }

    this.canBeSelected=function(teamToPlay_){
        if(this.isEmpty()){
            console.debug('empty');
            return false;
        }

        if(teamToPlay_===this.getTeam() ){
            console.debug('to play');
            return true;
        }
        console.debug('other team');
        return false;
    }

    this.selectCaseToMove=function(x2_,y2_){
        var sId=x2_+'_'+y2_;
        if(this.canMoveTo(x2_,y2_ ) ){
            tCase[sId].walking();
            tPiece[sId].object.show();
            return true;
        }
        return false;
    }
    this.selectCaseToAttack=function(x2_,y2_){
        var sId=x2_+'_'+y2_;
        if(this.canAttack(x2_,y2_ ) ){
            tCase[sId].attack();
            tPiece[sId].object.show();
            return true;
        }
        return false;
    }
    this.selectCaseRelative=function(deltaX,deltaY){
        var sId=this.object._x+'_'+this.object._y;
        tCase[sId].select();
        tPiece[sId].object.show();
    }

    this.selectCaseRelativeToMove=function(deltaX,deltaY){
        return this.selectCaseToMove(this.object._x+parseInt(deltaX),this.object._y+parseInt(deltaY));
    }
    this.selectCaseRelativeToAttack=function(deltaX,deltaY){
        return this.selectCaseToAttack(this.object._x+parseInt(deltaX),this.object._y+parseInt(deltaY));
    }

    this.selectCaseRelativeBoth=function(deltaX,deltaY){
        if(this.selectCaseRelativeToMove(deltaX,deltaY) || this.selectCaseRelativeToMove(deltaX,deltaY)){
            return true;
        }
    }

    this.reset=function(){

        this.object.reset();
    }

    this.select=function(){

        this.object.select();
        //oPageScene.object.zoomIn(this.object.x,this.object.y);
        this.selectCaseRelative(0,0);

        var type=this.getType();
        var i=1;
        var run=1;

        var tMove;

        if(type==='P'){//pion
            tMove=Array();

            if(this.getTeam()==='B'){
                tMove=[

                '0,1',
                ];

                if(this.object._y===1){
                    tMove.push('0,2');
                }

            }else{
                tMove=[

                '0,-1',

                ];

                if(this.object._y===6){
                    tMove.push('0,-2');
                }
            }

            for(var moveKey in tMove){
                var tDetail=tMove[moveKey].split(',');
                var deltaX=tDetail[0];
                 var deltaY=tDetail[1];
                this.selectCaseRelativeToMove(deltaX,deltaY);
            }

            if(this.getTeam()==='B'){
                tMove=[

                '1,1',
                '-1,1',
                ];
            }else{
                tMove=[

                '1,-1',
                '-1,-1',
                ];
            }

            for(var moveKey in tMove){
                var tDetail=tMove[moveKey].split(',');
                var deltaX=tDetail[0];
                 var deltaY=tDetail[1];
                this.selectCaseRelativeToAttack(deltaX,deltaY);
            }
        }else if(type==='K'){//King
            var tMove=[
                '0,1',
                '1,1',
                '1,0',
                '1,-1',
                '0,-1',
                '-1,-1',
                '-1,0',
                '-1,1',
            ];

            for(var moveKey in tMove){
                var tDetail=tMove[moveKey].split(',');
                var deltaX=tDetail[0];
                var deltaY=tDetail[1];
                this.selectCaseRelativeToMove(deltaX,deltaY);
                this.selectCaseRelativeToAttack(deltaX,deltaY);
            }
        }else if(type==='T'){//tour
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i,0)===true ){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i,0)===false){
                    run=0;
                }
                i++;
            }
            i=-1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i,0)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i,0)===false){
                    run=0;
                }
                i--;
            }

            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(0,i)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(0,i)===false){
                    run=0;
                }
                i++;
            }
            i=-1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(0,i)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(0,i)===false){
                    run=0;
                }
                i--;
            }


        }else if(type==='F'){//fou
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i,i)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i,i)===false){
                    run=0;
                }
                i++;
            }
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i,i*-1)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i,i*-1)===false){
                    run=0;
                }
                i++;
            }
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i*-1,i)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i*-1,i)===false){
                    run=0;
                }
                i++;
            }
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i*-1,i*-1)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i*-1,i*-1)===false){
                    run=0;
                }
                i++;
            }
        }else if(type==='Q'){//Queen
            //copy tour
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i,0)===true ){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i,0)===false){
                    run=0;
                }
                i++;
            }
            i=-1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i,0)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i,0)===false){
                    run=0;
                }
                i--;
            }

            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(0,i)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(0,i)===false){
                    run=0;
                }
                i++;
            }
            i=-1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(0,i)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(0,i)===false){
                    run=0;
                }
                i--;
            }
            //copy fou
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i,i)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i,i)===false){
                    run=0;
                }
                i++;
            }
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i,i*-1)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i,i*-1)===false){
                    run=0;
                }
                i++;
            }
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i*-1,i)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i*-1,i)===false){
                    run=0;
                }
                i++;
            }
            i=1;
            run=1;
            while(run){
                if(this.selectCaseRelativeToAttack(i*-1,i*-1)===true){
                    run=0;
                }else if(this.selectCaseRelativeToMove(i*-1,i*-1)===false){
                    run=0;
                }
                i++;
            }


        }else if(type==='C'){//cavalier

            var tMove=[
                '1,2',
                '-1,2',
                '1,-2',
                '-1,-2',

                '2,1',
                '-2,1',
                '2,-1',
                '-2,-1',

            ];

            for(var moveKey in tMove){
                var tDetail=tMove[moveKey].split(',');
                var deltaX=tDetail[0];
                 var deltaY=tDetail[1];
                this.selectCaseRelativeToMove(deltaX,deltaY);
                this.selectCaseRelativeToAttack(deltaX,deltaY);
            }
        }
    }
    this.canMoveTo=function(x2_,y2_){
        var sId=x2_+'_'+y2_;
        if(!tPiece[sId]){
            return false;
        }else if(tPiece[sId].isEmpty()===true){
            return true;
        }
        return false;
    }
    this.canAttack=function(x2_,y2_){
        var sId=x2_+'_'+y2_;
        if(!tPiece[sId]){
            return false;
        }else if(tPiece[sId].isEmpty()===true){
            return false;
        }else if(tPiece[sId].getTeam()!==this.getTeam()){
            return true;
        }
        return false;
    }
    this.moveTo=function(x2_,y2_){
        tPiece[x2_+'_'+y2_].load(global_oPieceSelected.getName());
        tPiece[x2_+'_'+y2_].object.moveThere();
        tPiece[global_oPieceSelected.getX2()+'_'+global_oPieceSelected.getY2()].load('');
        console.debug('moveTo');
    }
    this.attack=function(x2_,y2_){
        var tmpObjectFrom=tPiece[x2_+'_'+y2_];
        if(tmpObjectFrom.getType()==='K'){
            console.debug('Echec et mat');
            pageGameOver();
        }
        //tPiece[x2_+'_'+y2_].load(global_oPieceSelected.getName());
        tPiece[x2_+'_'+y2_].object.attackThere(global_oPieceSelected.getName());
        tPiece[global_oPieceSelected.getX2()+'_'+global_oPieceSelected.getY2()].load('');


    }

    this.load(sPiece_);
}


function CaseB(x_,y_){
    var x2=x_*calcul(60);
    var y2=y_*calcul(60);
    y2+=calcul(global_deltaY);
    this.oComponent =   Qt.createComponent( "/CaseB.qml");
    this.object=this.oComponent.createObject(oPageScene.object,{"x": x2, "y": y2, "x2":x_,"y2":y_});

    if( this.oComponent.status === Component.Error ){
        console.debug("Error:"+ this.oComponent.errorString() );
    }

    this.isWalking=function(){
        return this.object._walking;
    }
    this.walking=function(){
        this.object.walking();
    }
    this.attack=function(){
        this.object.attack();
    }
    this.select=function(){
        this.object.select();
    }

    this.reset=function(){
        this.object.reset();
    }
}
function CaseN(x_,y_){
    var x2=x_*calcul(60);
    var y2=y_*calcul(60);
    y2+=calcul(global_deltaY);
    this.oComponent =   Qt.createComponent( "/CaseN.qml");
    this.object=this.oComponent.createObject(oPageScene.object,{"x": x2, "y": y2, "x2":x_,"y2":y_});

    if( this.oComponent.status === Component.Error ){
        console.debug("Error:"+ this.oComponent.errorString() );
    }

    this.isWalking=function(){
        return this.object._walking;
    }
    this.walking=function(){
        this.object.walking();
    }
    this.attack=function(){
        this.object.attack();
    }
    this.select=function(){
        this.object.select();
    }

    this.reset=function(){
        this.object.reset();
    }
}
