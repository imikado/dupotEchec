import QtQuick 2.2

Rectangle{
    id:sceneArea
    visible:true
    color:'#1868b2'
    width:mainWindow.oGame.width
    height:mainWindow.oGame.height

    Team{
        id:team
        _color:"B"
        anchors.horizontalCenter: parent.horizontalCenter

        Component.onCompleted: display()
    }

    function switchTeam(sColor){
        team._color=sColor
        team.display();
    }
    function zoomIn(x_,y_){
        x_=parseInt(x_);
        y_=parseInt(y_);
        console.debug("zoom in x:"+x_+' y:'+y_);
        scaleId.origin.x=x_;
        scaleId.origin.y=y_;

        scaleId.xScale=3;
        scaleId.yScale=3;
    }
    function zoomOut(){
        scaleId.origin.x=0;
        scaleId.origin.y=0;

        scaleId.xScale=1;
        scaleId.yScale=1;
    }

    transform: Scale {id:scaleId; origin.x: 25; origin.y: 25; xScale: 1}



}
