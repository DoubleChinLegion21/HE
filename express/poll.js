// written by Caleb Rivera

var ably = new Ably.Realtime('ug5isA.wzLbOA:OCSsHx8SGzRZJZT8DIYCPg0q-0CvXGkRWZQJkyycaT0');
var channel = ably.channels.get('HE');

flavors = ["Vanilla","Matcha", "Chocolate", "Coconut", "Strawberry", "Banana", "Mango", "Coffee", "Pistachio", "Cookie Dough", "Oreo", "Peanut Butter"]

function randomize(){
    shuffleArray(flavors)
    for(i in flavors){
        $(".form-select").append('<option value="'+flavors[i]+'">'+flavors[i]+'</option>')
    }
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
    //alert(message.data);
    toadd = ""
    for(i in message.data){
        toadd += message.data[i].name + ": " + message.data[i].number.toString()
    }
    $("#liveresults").text(toadd)
});