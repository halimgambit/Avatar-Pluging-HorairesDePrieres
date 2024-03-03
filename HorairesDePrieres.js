exports.action = function(data, callback){

	let client = setClient(data);
	info("HorairesDePrieres from:", data.client, "To:", client);
	prieres (data, client);
	callback();
 
}


function prieres (data, client) {

	async function nameTimePrayer() {
		try {
		  const responseCity = await fetch('http://ip-api.com/json/');
		  if (!responseCity.ok) {
			throw new Error(responseCity.statusText);
		  }
		  const result = await responseCity.json();
		  const ville = result.city;
	  
		  const prayerResponse = await fetch(`https://www.al-hamdoulillah.com/horaires-prieres/monde/europe/france/${ville.toLowerCase()}.html#jour`);
		  if (!prayerResponse.ok) {
			throw new Error(prayerResponse.statusText);
		  }
	  
		  const html = await prayerResponse.text();
		  const cheerio = require("cheerio");
		  const $ = cheerio.load(html);
	  
		const Fajr = $('span.timeinday').eq(0).text(); 
			const Dhuhr = $('span.timeinday').eq(2).text(); 
			const Asr = $('span.timeinday').eq(3).text(); 
			const Maghrib = $('span.timeinday').eq(4).text(); 
			const Isha = $('span.timeinday').eq(5).text();

			Avatar.speak(`Salam alaikoum, voici les heures de priére à ${ville.toLowerCase()}: Fajr à ${Fajr}. Dhouhr à ${Dhuhr}. Asr à ${Asr}. Maghrib à ${Maghrib}. Isha à ${Isha}.`, data.client, () => {
				Avatar.Speech.end(data.client);
			});


			let date = new Date();
			let hours = date.getHours();
			let minutes = date.getMinutes();
			let currentTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

	
			if (currentTime === Fajr || currentTime === Dhuhr || currentTime === Asr || currentTime === Maghrib || currentTime === Isha) {
				playAdhan(data, client)
			}
		} catch (error) {
			Avatar.speak(`Je n'arrive pas à accéder au site al-hamdoulillah, ${error.message}`, data.client, () => {
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

