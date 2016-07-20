import QtQuick 2.0
import QtGraphicalEffects 1.0

Rectangle {
    id:rect
    visible:true
    width:mainWindow.oGame.calcul(60)
    height:mainWindow.oGame.calcul(60)
    color: "transparent"
    property int _x;
    property int _y;
    property string _type;



    AnimatedSprite {
        id: sprite
        width:parent.width
        height:parent.height
        anchors.centerIn: parent
        source: "/images/pieces.png"
        paused:true
        frameWidth: 60
        frameHeight: 60
        frameCount: 14
        smooth: true

    }
    DropShadow {
        id:shadow
        anchors.fill: sprite
        horizontalOffset: 1
        verticalOffset: 6
        radius: 1.0
        samples: 8
        color: "#80000000"
        source: sprite
    }
    Glow {
        id:glow
       anchors.fill: sprite
       radius: 8
       samples: 17
       color: "white"
       source: sprite
       visible:false
   }
    BrightnessContrast {
        id:brightness
            anchors.fill: rect
            source: rect
            brightness: -0.2
            visible:false
        }

    NumberAnimation {
        id:anim
        target: rect
        properties: "y"
        duration: 500
        from:y
        to:y-mainWindow.oGame.calcul(5)
        loops: Animation.Infinite
        easing.type: Easing.OutBack
    }


    function display(){

        var tPiece=Array();
        tPiece['BT']=0;
        tPiece['BF']=1;
        tPiece['BC']=2;
        tPiece['BQ']=3;
        tPiece['BK']=4;
        tPiece['BP']=5;
        tPiece['']=6;
        tPiece['WT']=7;
        tPiece['WF']=8;
        tPiece['WC']=9;
        tPiece['WQ']=10;
        tPiece['WK']=11;
        tPiece['WP']=12;



        sprite.setCurrentFrame(tPiece[_type]);
     }
     function select(){
         anim.start();
     }
     function reset(){
         anim.stop();
        opacity=1;
         glow.visible=false;
         shadow.visible=true;
         brightness.visible=false;
     }

     NumberAnimation {
         id:animMoveThere
         target: rect
         properties: "opacity"
         duration: 1000
         from:0
         to:1
         easing.type: Easing.OutCirc
     }
     function moveThere(){
        animMoveThere.start();

     }

     NumberAnimation {
         id:animAttackThere
         target: rect
         properties: "opacity"
         duration: 600
         from:0
         to:1
         loops:2
         easing.type: Easing.OutBack;
     }
     function attackThere(sPiece_){


         animAttackThere.start();

         _type=sPiece_;
         display();

     }



     function hide(){
        shadow.visible=false;
        glow.visible=false;
         brightness.visible=true;
     }
     function show(){

        shadow.visible=true;
         glow.visible=true;
         brightness.visible=false;
     }



}
