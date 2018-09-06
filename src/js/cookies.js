




function load()
{

	scores = [];
	levelReached = 0;
	var data = getCookie("save");
	if(data.constructor === String && data.length>0)
	{
		data = JSON.parse(data);

		if(data.constructor === Array)
		{
			levelReached = data[0];
			if(levelReached >0)document.getElementById("continueButton").className="option";

			for(var i = 1;i<data.length;i++)
				scores.push(data[i]);


			if(scores.length>0)
			{
				var string = "<h2>Scores</h2>"
				for(var i = 0;i<scores.length;i++)
				{
					string+="<li>"+scores[i]+" ticks</li>";
				}
				document.getElementById("stats").innerHTML = string;
				document.getElementById("statButton").className="option";
			}
			else document.getElementById("statButton").className="option option-disabled";
		}
	}
}


function save()
{
	var toSave = [levelReached];
	for(var i = 0;i<scores.length;i++)
		toSave.push(scores[i]);
	console.log(JSON.stringify(toSave));
	setCookie("save",JSON.stringify(toSave),365);
	load(); //refresh. Don't judge please
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
