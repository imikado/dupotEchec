import QtQuick 2.0
import QtGraphicalEffects 1.0

Rectangle{
    id:rect
    width:mainWindow.oGame.calcul(60)
    height:mainWindow.oGame.calcul(60)
    color:"#ffffff"
    property int x2;
    property int y2;
    property bool _walking;
    border.width:mainWindow.oGame.calcul(5);
    border.color:"#dddddd"

    MouseArea{
        anchors.fill: parent;
        onClicked: {

            mainWindow.oGame.click(parent.x2,parent.y2);
        }
    }

    BrightnessContrast {
        id:brightness
            anchors.fill: rect
            source: rect
            brightness: -0.2
            visible:false
        }

    function walking(){
        _walking=true;
        border.width=mainWindow.oGame.calcul(5);
        border.color="#76c97e";
        show();
    }
    function attack(){
        _walking=true;
        border.width=mainWindow.oGame.calcul(5);
        border.color="#d28484";
        show();
    }
    function select(){
        _walking=false;
        border.width=mainWindow.oGame.calcul(5);
        border.color="#9dc1c2";
        show();
    }

    function reset(){
        _walking=false;
        border.color="#dddddd";
        show();
    }

    function hide(){
        brightness.visible=true;
    }
    function show(){
        brightness.visible=false;
    }
}
