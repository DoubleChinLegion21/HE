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
    if (a.number == b.number){
        if(a.name > b.name) { return 1; }
        if(a.name < b.name) { return -1; }
        return 0;
    }else{
        return a.number - b.number;
    }
}

function make_message_results(din){
    din.sort(sortmessagespace2)
    flavorbase = din
    var toadd = ""
    var seedlower = 0
    var seedhigher = 0
    $("#message_space_results").empty();
    for(i in din){
        toadd += din[i].name + ": " + din[i].number.toString() + " // "
        seedhigher += din[i].number
        var seed_string = dec2bin(seedlower)
        if (seedhigher-1 != seedlower){
            seed_string = dec2bin(seedlower)+"-"+dec2bin(seedhigher-1)
        }
        $("#message_space_results").append(
            "<tr><td>"+din[i].name+"</td>"+
            "<td>"+din[i].number.toString()+"</td>"+
            "<td>"+seed_string+"</td></tr>"
        )
        seedlower = seedhigher
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
        $("#pagetitle").html("HE 476 Poll")
    }else if(phase == '2'){
        console.log("Phase 2")
        $("#formpopulation").hide()
        $("#view_message_results").show()
        $("#pagetitle").html("HE Message Space Results")
    }
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2).padStart(5, "0");;
}

channel.subscribe('set_seed_password', function(message){
    var password = message.data[0]
    var message_word = message.data[1]
    var seed = message.data[2]
    if (password == 0){
        password = ""
    }
    if (message_word = 0){//Todo: higlight row from this
        message_word = ""
    }
    if (seed == 0){
        seed = ""
    }
    
    var ciphertext = "";
    for (i in password){
        ciphertext = ciphertext + String.fromCharCode(password[i].charCodeAt(0) ^ seed.charCodeAt(0));
    }
    console.log(ciphertext)
    $("#view_password_seed").append(password + " ^ " + seed + " = " + ciphertext)
});