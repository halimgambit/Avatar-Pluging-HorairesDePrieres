exports.action = function(data, callback){

	let client = setClient(data);
	info("HorairesDePrieres from:", data.client, "To:", client);
	prieres (data, client);
	callback();
 
}


function prieres (data, client) {

	async function nameTimePrayer() {
		try {
		  // Fetch user's city from IP
		  const responseCity = await fetch('http://ip-api.com/json/');
		  if (!responseCity.ok) {
			throw new Error(responseCity.statusText);
		  }
		  const result = await responseCity.json();
		  const ville = result.city;
	  
		  // Fetch prayer times based on the city
		  const prayerResponse = await fetch(`https://www.al-hamdoulillah.com/horaires-prieres/monde/europe/france/${ville.toLowerCase()}.html#jour`);
		  if (!prayerResponse.ok) {
			throw new Error(prayerResponse.statusText);
		  }
	  
		  const html = await prayerResponse.text();
		  const cheerio = require("cheerio");
		  const $ = cheerio.load(html);
	  
		  let date = new Date();
		  let time = `${date.getHours()}:${date.getMinutes()}`;
	  
		  const Fajr = $('span.timeinday').eq(0).text();
		  if (time === Fajr) {
			playAdhan();
		  }
	  
		  const Dhouhr = $('span.timeinday').eq(2).text();
		  if (time === Dhouhr) {
			playAdhan();
		  }
	  
		  const Asr = $('span.timeinday').eq(3).text();
		  if (time === Asr) {
			playAdhan();
		  }
	  
		  const Maghrib = $('span.timeinday').eq(4).text();
		  if (time === Maghrib) {
			playAdhan();
		  }
	  
		  const Isha = $('span.timeinday').eq(5).text();
		  if (time === Isha) {
			playAdhan();
		  }
	  
		  Avatar.speak(`Salam alaikoum, voici les horaires de prières à ${ville.toLowerCase()}: Fajr à ${Fajr}. Dhouhr à ${Dhouhr}. Asr à ${Asr}. Maghrib à ${Maghrib}. Isha à ${Isha}.`, data.client, () => {
			Avatar.Speech.end(data.client);
		  });
		} catch (error) {
		  Avatar.speak(`Je n'arrive pas à accéder au site al-hamdoulillah, ${error}`, data.client, () => {
			Avatar.Speech.end(data.client);
		  });
		}
	  }
	  
	  nameTimePrayer();
	  

}

function playAdhan(data, client) {
	Avatar.play("https://www.islamcan.com/audio/adhan/azan6.mp3", data.client);
}


function setClient (data) {
	let client = data.client;
	if (data.action.room)
	client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	if (data.action.setRoom)
	client = data.action.setRoom;
	return client;
}

