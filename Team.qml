import QtQuick 2.0
import QtGraphicalEffects 1.0


Rectangle {
    id:rect
    visible:true
    width:mainWindow.oGame.calcul(480)
    height:mainWindow.oGame.calcul(120)
    color: "#007382"


    property string _color: "W"


    AnimatedSprite {
        id: sprite
        width:parent.width
        height:parent.height
        anchors.centerIn: parent
        source: "/images/team.png"
        paused:true
        frameWidth: 480
        frameHeight: 120
        frameCount: 2
        running:false

    }


    function display(){
        if(_color==='W'){
            sprite.setCurrentFrame(1);
            rect.color="#5a0060";
            console.debug("color:"+_color);

        }else{
            sprite.setCurrentFrame(0);
            rect.color="#007382";

        }

    }
}
