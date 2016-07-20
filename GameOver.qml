import QtQuick 2.0

Rectangle {
    id:rect
    width:parent.width
    height:parent.height
    color:"#222222"


    Bouton{
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.verticalCenter: parent.verticalCenter
        _width: mainWindow.oGame.calcul(291)
        _height: mainWindow.oGame.calcul(33)
        _text: qsTr("Re-Jouer!")
        _link:mainWindow.oGame.pageGameStart
    }

    Team{
        id:team
        _color:"B"
        anchors.horizontalCenter: parent.horizontalCenter

        Component.onCompleted: display()
    }


    function display(sColor){
        team._color=sColor
        team.display();

        if(sColor==='W'){
            rect.color="#5a0060";
        }else{
            rect.color="#007382";
        }
    }
}
