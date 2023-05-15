require('dotenv').config();
const {REST,Routes, ApplicationCommandOptionType }=require('discord.js');
const cmds=[{
    name:"ban",
    description:"Bans user",
    options:[
        {
            name:"user",
            description:"user to be banned",
            type:ApplicationCommandOptionType.User,
            required:true
        },
        {
            name:"reason",
            description:"the reason for ban",
            type:ApplicationCommandOptionType.String,
        }
    ],
},
{
    name:"kick",
    description:"Kicks users",
    options:[{name:"user",description:"User to be kicked",type:ApplicationCommandOptionType.User,required:true},{name:"reason",description:"Reason for the kick",type:ApplicationCommandOptionType.String}]
},{
    name:"mute",
    description:"Mutes users",
    options:[{
        name:"user",
        description:"User to be muted",
        type:ApplicationCommandOptionType.User,
        required:true,  
    },
    {
      name:"time",
      description:"Time for the mute ",
      type:ApplicationCommandOptionType.String
    }]
}, {
    name:"setmuterole",
    description:"Set the Mute Role",
    options:[{
        name:"role",
        description:"The mute role",
        type:ApplicationCommandOptionType.Role,
         required:true,
},]
},

{
    name:"setwchannel",
    description:"Set the welcome channel",
    options:[{
        name:"channel",
        description:"The welcome Channel",
    type:ApplicationCommandOptionType.Channel,
    required:true,
}]
},{
    name:"unmute",
    description:"Unmutes users",
    options:[{
        name:"user",
        description:"User to be unmuted",
        type:ApplicationCommandOptionType.User,
        required:true,
    }]
},
];
const rest=new REST({version:'10'}).setToken(process.env.DISCORDJS_BOT_TOKEN);

(async()=>{
    try {
        console.log("Registring commands")
        await rest.put(
            Routes.applicationCommands(process.env.c),
            {body:cmds}
        )
        console.log("registered commands")
    } catch (error) {
        console.log(error)
    }
})();
