// written by Caleb Rivera

var ably = new Ably.Realtime('ug5isA.wzLbOA:OCSsHx8SGzRZJZT8DIYCPg0q-0CvXGkRWZQJkyycaT0');
var channel = ably.channels.get('HE');

flavors = ["Vanilla","Matcha", "Chocolate", "Coconut", "Strawberry", "Banana", "Mango", "Coffee", "Pistachio", "Cookie Dough", "Oreo", "Peanut Butter"]

var flavorbase = []

function randomize(){
    shuffleArray(flavors)
    for(i in flavors){
        $(".form-select").append('<option value="'+flavors[i]+'">'+flavors[i]+'</option>')
    }
    $.get( "whatphase", function( data ) {
        phase_selector(data)
    });
    $.get( "whatbase", function( data ) {
        make_message_results(data)
    });
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function delete_msg(){
    
}
setTimeout(() => {
    $('#checkmark').remove()
}, 10000);

channel.subscribe('primary', function(message) {
    make_message_results(message.data)
});

function sortmessagespace2(a,b){
    return a.number - b.number;
}

function make_message_results(din){
    din.sort(sortmessagespace2)
    flavorbase = din
    toadd = ""
    $("#message_space_results").empty();
    for(i in din){
        toadd += din[i].name + ": " + din[i].number.toString() + " // "
        $("#message_space_results").append(
            "<tr><td>"+din[i].name+"</td>"+
            "<td>"+din[i].number.toString()+"</td>"+
            "<td>"+"numbinary"+"</td></tr>"
        )
    }
    $("#liveresults").text(toadd)
}

channel.subscribe('phase', function(message) {
    phase_selector(message.data)
});

function phase_selector(phase){
    if (phase == '1'){
        console.log("Phase 1")
        $("#formpopulation").show()
        $("#view_message_results").hide()
    }else if(phase == '2'){
        console.log("Phase 2")
        $("#formpopulation").hide()
        $("#view_message_results").show()
    }
}