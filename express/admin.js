var ably = new Ably.Realtime('ug5isA._li3Cw:2GTzt_IvptxXrFnudQsXYzoJGtkgL59pSjjx2CRSqUk');
var channel = ably.channels.get('HE');

function generate(){
    channel.publish('generate', "hey");
}
function phase(number){
    channel.publish('phase', number.toString());
}
function wash(){
    channel.publish('wash', 'please');
}
function setpassword(myvar){
    channel.publish('setpassword', myvar)
}

$.get( "whatbase", function( data ) {
    var new_data = data[0]
    for(i in new_data){
        $("#set_range").append('<option value="'+new_data[i].name+'">'+new_data[i].name+'</option>')
    }
});
function setmessage(){
    channel.publish('setmessage', $('#set_range').find(":selected").text())
}

//<option value="1">One</option>