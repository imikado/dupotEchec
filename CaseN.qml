import QtQuick 2.0
import QtGraphicalEffects 1.0


Rectangle{
    id:rect
    width:mainWindow.oGame.calcul(60)
    height:mainWindow.oGame.calcul(60)
    color:"#666666"
    property int x2;
    property int y2;
    property bool _walking;
    border.width:mainWindow.oGame.calcul(5);
    border.color:"#888888"

    BrightnessContrast {
        id:brightness
            anchors.fill: rect
            source: rect
            brightness: -0.2
            visible:false
        }

    MouseArea{
        anchors.fill: parent;
        onClicked: {

            mainWindow.oGame.click(parent.x2,parent.y2);
        }
    }
    function walking(){
        _walking=true;
        border.width=mainWindow.oGame.calcul(5);
        border.color="#84e18d";
        show();
    }
    function attack(){
        _walking=true;
        border.width=mainWindow.oGame.calcul(5);
        border.color="#9e5050";
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
       border.color="#888888";
        show();
    }
    function hide(){
        brightness.visible=true;
    }
    function show(){
        brightness.visible=false;
    }
}
