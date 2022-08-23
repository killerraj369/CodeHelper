require("dotenv").config()

// Require the necessary discord.js classes
const Discord = require('discord.js');
const axios = require('axios')
var qs = require("qs");


// Create a new client instance
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"], partials: ["MESSAGE"] })

// When the client is ready, run this code (only once)
client.on('ready', () => {
    console.log('Ready to go ! ZoooooooooooooOOOOOOOOMMMMMM');
});



const PREFIX = '.'


client.on("error", function (error) {
    msg.channel.send(`client's WebSocket encountered a connection error: ${error}`);
});


client.on("guildBanAdd", function (guild, user) {
    msg.channel.send(`a member is banned from a guild`);
});

client.on("guildBanRemove", function (guild, user) {
    console.log(`a member is unbanned from a guild`);
});



client.on('messageDelete', msg => {

    msg.channel.send("Why are you Deleting Messages ?")
})

// Joke  API
const options = {
    method: 'GET',
    url: 'https://jokeapi-v2.p.rapidapi.com/joke/Any',
    params: { contains: 'C%23', idRange: '0-150', blacklistFlags: 'nsfw,racist' },
    headers: {
        'X-RapidAPI-Key': '537dd78390msh16f053d5aa8aa58p128314jsn547ba0d8f2f6',
        'X-RapidAPI-Host': 'jokeapi-v2.p.rapidapi.com'
    }
};

client.on('message', async msg => {

    if (msg.author.bot == true) return;

    if (msg.content.startsWith(PREFIX)) {

        const commandBody = msg.content.slice(PREFIX.length);

        const args = commandBody.split(' ');
        let arg1;  // I will use this arg1 for the code part in .run c++ code command


        for (let i = 2; i < args.length; i++) {
            arg1 += args[i];
            arg1 += ' '
        }

        const command = args.shift().toLowerCase();

        if (command == "ping") {
            msg.reply('Pong')
        }

        if (command == "joke") {
            let getjoke = async () => {
                let response = await axios.get("https://v2.jokeapi.dev/joke/Any");
                let joke = response.data;
                return joke;
            };

            let jokeValue = await getjoke();
            console.log(jokeValue)

            if (jokeValue.type == "twopart") {
                msg.reply('Here I found Something 🙌 ' + '\n' + (jokeValue.setup) + '\n' + (jokeValue.delivery) + ' 😂')
            }

            else {
                msg.reply('Here I found Something 🙌 ' + '\n' + (jokeValue.joke))
            }

        }


        if (command == "contest" || command == "contests") {
            let getcontest = async () => {
                let response = await axios.get("https://kontests.net/api/v1/all");
                let data = response.data;
                return data;
            };

            let value = []
            let data = await getcontest();
            value = data;


            const sites = ['codechef', 'codeforce', 'codeforces', 'atcoder', 'topcoder', 'leetcode'];

            // If the suffix enter by the user is contained in declared sites. Ex- .contest codechef or .contest codeforces

            if (sites.includes(args[0]))   // If user wants to search for a particular site contests
            {

                let count = 0;
                for (let val of value) {

                    if (val.site.toLowerCase() == args[0]) {

                        let name = val.name;
                        let url = val.url;
                        let start = val.start_time;


                        msg.channel.send(count + 1 + ') ' + name + ': starting at ' + start + ' Attempt at ' + url + '\n')

                        count++;
                    }

                }

                msg.channel.send('found ' + count + ' results' + ' ✌')

            }

            // else prints every contests information
            else if (args[0] == null) {

                let count = 0;
                for (let val of value) {

                    let name = val.name;
                    let start = val.start_time;
                    let site = val.site;
                    let hours_24 = val.in_24_hours;

                    if (hours_24 == true) {
                        msg.channel.send(name + ': starting at ' + start + ' Within 24 hours' + ' by ' + site)
                    }

                    else {
                        msg.channel.send(name + ': starting at ' + start + ' Contest Not Nearby' + site)
                    }


                    count++;
                }

                console.log('found ' + count + ' results' + '✌')


            }

            // printing today's contests

            else if (args[0].toLowerCase() == 'today') {

                let sites = ['codechef', 'codeforces', 'leetcode', 'atcoder', 'topcoder']
                msg.channel.send('These are Todays Contests ✨' + '\n')

                let count = 0 // vairable for counting the number of contests today


                let today_date = extract_date();     // getting today's date

                console.log(today_date)


                for (let val of value) {

                    let name = val.name;
                    let url = val.url;
                    let start = val.start_time;
                    let end = val.end_time;
                    let hours_24 = val.in_24_hours;
                    let site = val.site;


                    let contest_dat = contest_date(start);      // getting contest date

                    // console.log(contest_dat)

                    if ((contest_dat == today_date) && sites.includes(site.toLowerCase())) {

                        msg.channel.send(count + 1 + ') ' + site + ' : ' + name + ': starting at ' + start + ' Contest within 24 hours' + ' Attempt today at ' + url + '\n')
                        count++

                    }


                }

                if (count == 0) {
                    msg.channel.send('There is no Contest today 👍')
                }
                else {

                    msg.channel.send('Wish you Good Luck 👍 \n')
                }

            }
        }

        if (command == 'hackathon' || command == 'hackathons') {

            let getcontest = async () => {
                let response = await axios.get("https://kontests.net/api/v1/all");
                let data = response.data;
                return data;
            };

            let value = []
            let data = await getcontest();
            value = data;

            msg.channel.send('Here are some on going hackathons ✨\n')

            let count = 0;
            for (let val of value) {

                let today_date = extract_date();
                let contest_dat = contest_date(val.start_time);

                if (val.site.toLowerCase() == 'hackerearth') {
                    let name = val.name;
                    let url = val.url;
                    let start = val.start_time;

                    if (contest_dat > today_date) {
                        msg.channel.send(count + 1 + ' ) ' + name + ': starting at ' + start + '\n Attempt at ' + url + ' (UPCOMING) ' + '\n')
                        count++
                    }

                    else {
                        msg.channel.send(count + 1 + ' ) ' + name + ': starting at ' + start + ' Attempt today at ' + url + '\n')
                        count++
                    }


                }

            }

            msg.channel.send('Found ' + count + ' Hackathons out there ' + '😉')

        }

        if (command == 'run') {

        
            let code = '';
            for (let i = 1; i < args.length; i++) {
                code += args[i];
                code += ' ';
            }

            console.log(code)


            msg.channel.send('Compiling the results  🔍 ..')

            var data = qs.stringify({
                code: code,
                language: args[0],
                input: "",
            });

            var config = {
                method: "post",
                url: "https://codex-api.herokuapp.com/",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: data,
            };

            axios(config)
                .then(function (response) {

                    if (response.data.success == true) {
                        msg.channel.send('------- Code Executed Succesfully  -------')
                        msg.channel.send('Output : ' + JSON.stringify(response.data.output));
                    }
                    else {
                        msg.channel.send('Code did not Executed Succesfully')

                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        }



        // quotes 

        if (command == 'quote' || (args[0] == 'quote')) {

            console.log(args[0])
            const url = "https://api.quotable.io/random";

            let getquote = async () => {
                let response = await axios.get(url);
                let data = response.data;
                return data;
            };

            let data = await getquote();

            let content = data.content;
            let author = data.author;


            msg.channel.send(author + ' Says ,' + '\n' + content)
            msg.react('👌')


        }


        // help

        if (command == 'help') {
            
            // msg.channel.send({ embeds: [{
            //     color: 3447003,
            //     // author: {
            //     //   name: "Vaibhav",
            //     //   icon_url: "https://i.imgur.com/lm8s41J.png"
            //     // },
            //     // thumbnail: {
            //     //   url: "http://i.imgur.com/p2qNFag.png"
            //     // },
            //     // image: {
            //     //   url: "http://i.imgur.com/yVpymuV.png"
            //     // },
            //     title: "The commands I follow is listed below",
            //     url: "https://discord.js.org/#/docs/main/master/class/MessageEmbed",
            //     description: "CODEHELPER :A Discord Bot for Coders",
            //     fields: [{
            //         name:"1.) .joke -> Gives you Joke",

            //         name:"2.) .quote -> Gives you a motivational Line",
                    
            //         name:"3.) .contest -> Gives you all Contests related information",
                    
            //         name:"4.) .contest codechef -> Gives you all the contests of codechef",
                    
            //         name:"5.) .contest codeforces -> Gives you all the contests of codeforces",
                    
            //         name:"6.) .contest leetcode -> Gives you all the contests of Leetcode",
                    
            //         name:"7.) .contest atcoder -> Gives you all the contests of Atcoder",
                    
            //         name:"8.) .contest topcoder -> Gives you all the contests of topcoder",
                    
            //         name:"9.) .contest today -> Gives you today's contest",
                    
            //         name:"10.) .hackathon -> Gives you ongoing and upcoming hackathons from hackerearth",
                    
            //         name:"11.) .help -> Gives you help",
                    
            //         name:"12.) .run {language} {code} -> Runs your Code Ex) .run js console.log('hello world')",
                    
            //         name:"13.) .news {keyword} -> Gives you keywords's news Ex.) .news tesla",
                    
            //         name:"14.) .news today -> Gives you today's news",
                  
            //       inline: false
            //     },
            //     // {
            //     //   name: "Inline fields",
            //     //   value: "They can have different fields with small headlines, and you can inline them.",
            //     //   inline: true
            //     // },
            //     // {
            //     //   name: "Masked links",
            //     //   value: "You can put [masked links](https://discord.js.org/#/docs/main/master/class/MessageEmbed) inside of rich embeds.",
            //     //   inline: true
            //     // },
            //     // {
            //     //   name: "Markdown",
            //     //   value: "You can put all the *usual* **__Markdown__** inside of them.",
            //     //   inline: true
            //     // },
            //     {
            //       name: "\u200b",
            //       value:"\u200b"
            //     }],
            //     timestamp: new Date(),
            //     footer: {
            //       icon_url: "http://i.imgur.com/w1vhFSR.png",
            //       text: "This is the footer text, it can hold 2048 characters"
            //     }
            //   }]});
            msg.channel.send('Here are the commands i follow')
            msg.channel.send('Go to https://github.com/killerraj369/CodeHelper for getting all commands 😁')
            msg.channel.send('Try .contest today or .news tesla or .joke or .hackathon')
        }


        // news

        if (command == 'news') {
            console.log(args)

           if(args[0]!=null)   // Only if args[0] is not null
           {

            if (args[0] == 'today') {
                let getnews = async () => {
                    let response = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`);
                    let data = response.data;
                    return data;
                };

                let value = await getnews();

                msg.channel.send('Have a look at todays headlines 📰')

                let count = 0;

                for (let val of value.articles) {
                    if (count == 10) break;    // Show only 10 contents

                    if(val.title!=null) msg.channel.send(count + 1 + '.) ' + val.title)

                    count++;
                   
                    if(val.urlToImage != null) 
                    {
                        msg.channel.send(val.urlToImage)
                        
                    }

                    if(val.description != null)
                    {
                       
                        msg.channel.send(val.description + '\n\n')
                    } 
                     
                }

                msg.channel.send('--------------------')
                msg.channel.send('🙌 These are the Top Results !!')



            }

            else {

                let getnews = async () => {
                    let response = await axios.get(`https://newsapi.org/v2/everything?q=${args[0]}&apiKey=${process.env.NEWS_API_KEY}`);
                    let data = response.data;
                    return data;
                };

                let value = await getnews();

                msg.channel.send('Have a look at these News 📰 ')

                let count = 0;

                for (let val of value.articles) {
                    if (count == 10) break;           // show 10 things
                    count++;
                    msg.channel.send(count  + '.) ' + val.title)
                    
                    
                    if(val.urlToImage!=null) msg.channel.send(val.urlToImage)

                    if(val.description!=null) msg.channel.send(val.description + '\n\n')


                }

                msg.channel.send('--------------------')
                msg.channel.send('🙌 These are the Top Results !! ')

            }


           }

          
        }

    }



    // Fun Commands

    else {

        message = msg.content.toLocaleLowerCase()

        if (message == 'hi' || message == 'hello') {
            msg.channel.send('@' + msg.author.username + ' hello ! how are you doing')
        }

        if (message == 'i love you bot' ) {
            msg.channel.send('😍😍')
            msg.react('❤')
        }

        if (message == 'date') {
            let today = new Date();
            let date = today.getDate().toLocaleString()
            let month = today.getMonth().toLocaleString()
            let year = today.getFullYear().toLocaleString()
            let time = today.getUTCHours().toLocaleString()


            msg.channel.send(date + '/' + month + '/' + year + ' ' + time)
        }


    }


})




function extract_date()       // To get today date
{
    let date = new Date();
    let today_date = '';


    today_date += date.getFullYear() + '-';

    let month = date.getMonth() + 1;

    if (month <= 9) {

        today_date += '0' + month + '-';
    }
    else {
        today_date += month;
    }


    let aj_date = date.getDate();

    if (aj_date <= 9) {
        today_date += '0' + aj_date;
    }
    else {
        today_date += aj_date;
    }

    return today_date;
}


function contest_date(start)         // to get contest date
{
    let date = '';
    for (let i = 0; i < 10; i++) {
        date += start[i];
    }

    return date
}











// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);