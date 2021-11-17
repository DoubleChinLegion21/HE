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