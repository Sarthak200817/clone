require("dotenv").config();

class Members {
  warnings = 0;
  names = ["Sarthak","Richtoen"];

  constructor() {
  }
  addName(name) {
    this.names.push(name);
  }
  size(){
    return this.names.length;
  }
  findName(find) {
    var ret = "error";
    for (let i = 0; i < this.names.length; i++) {
      if (this.names[i] === find) {
        ret = this.names[i];
        break;
      }
    }
    return ret;
  }

  NameId(find) {
    var id = "-1";
    for (let i = 0; i < this.names.length; i++) {
      if (this.names[i] === find) {
        id = i;
        break;
      }
    }
    return id;
  }
  removeName(find) {
    const i = this.NameId(find);
    if (i > -1) {
      this.names.splice(i, 1);
    }
  }
  warns() {
    if (this.warnings === 0) {
      this.warnings++;
    }
  }
}

const { Client, GatewayIntentBits, Partials , EmbedBuilder} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

const prefix="$";
const members=new Members();
client.login(DISCORDJS_BOT_TOKEN);
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {   
    const guild = await client.guilds.fetch("1098510430479065088");
    console.log(`Fetched guild ${guild.name}`);
  } catch (error) {
    console.error("Error while reacting to message or fetching guild:", error);
  }
});
 client.on('guildMemberAdd',(member)=>{
  members.addName(member.username);
  const channelS= client.channels.cache.get('1103960204007182338');
  channelS.send(`Welcome ${member.displayName}, you are one of ${member.guild.memberCount} members in our server `);
 });
//commands
const badWords=["fuck", "suck","sex","pussy","cum","squirt","nigg","bitch"];
var used=false;
function containsBadWords(msg){
  var usedWords=[]
    msg=msg+" ";
    var numSpaces=0;
    for(let i=0;i<msg.length;i++){
  if(msg.charAt(i)===' '){
    numSpaces++;
  }
}
  for (let i = 0; i < numSpaces; i++) {
    const word = msg.split(" ")[i];

    // Check if the word contains any bad word
    for (let j = 0; j < badWords.length; j++) {
      if (word.toLowerCase().includes(badWords[j])) {
        usedWords.push(word);
      }
    }
  }

  return {
    used: usedWords.length > 0,
    usedWords: usedWords,
    numUsedWords: usedWords.length
  };
}/*
console.log("Bad words found: " + result.usedWords.join(", "));
console.log("Number of bad words: " + result.numUsedWords);
console.log("Contains bad words: " + result.used);
*/
var reason
client.on('messageCreate',(message)=>{
  const result = containsBadWords(message.content);
  if(message.author.bot)return;
  if(result.used===true){
    const embed=new EmbedBuilder()
    .setTitle("You cursed")
    .setDescription(`You used ${result.usedWords.join(", ")}`)
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
 .setColor('Red')
message.reply({embeds:[embed]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
  }
})


//commands
var muteRoleset=false;
/*const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://sarthak:Sv@v14.x8rhyjf.mongodb.net/?retryWrites=true&w=majority';
const bot = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

bot.connect()
  .then(() => {
    const database = bot.db('myDatabase');
    const collection = database.collection('muteRoles');
    console.log('MongoDB connected...');
    // Do something with the collection here
  })
  .catch(err => console.log(err));

*/
const muteRoles = {};


client.on('interactionCreate', async (interaction) => {
  const guild = interaction.guild;
  const message = interaction;
  const permission = interaction.member.permissions;
  
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'setmuterole') {
    if (permission.has('ManageMembers')) {
      const muteRoleId = interaction.options.get('role').value;
      const muteRole = guild.roles.cache.get(muteRoleId);
      
      // Save the mute role id for this server
      muteRoles[guild.id] = muteRoleId;
      muteRoleset=true;
      const embed2 = new EmbedBuilder()
        .setTitle('Mute role set succesfully')
        .setDescription(`${muteRole.name} is the new mute Role`)
        .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
        .setColor('Green');
        
      message.reply({ embeds: [embed2] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
    } else {
      const embed2 = new EmbedBuilder()
        .setTitle(`You can't set mute role`)
        .setDescription(`<@${interaction.user.id}> you can't set the mute role `)
        .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
        .setColor('Red');
        
      message.reply({ embeds: [embed2] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
    }
  }
  
  // use muteRoles[guild.id] to get the mute role id for this server

//In this code, muteRoles is an object that stores the mute role id for each server. When a user sets a new mute role for their server, we update the muteRoles object with the new mute role id for that server. To get the mute role id for the current server, we can use muteRoles[guild.id].  
  if (interaction.commandName === 'ban') {
    const member = interaction.options.get('user').value;
    const mention = await guild.members.fetch(member);
    const me = interaction.user.id;
      const mem = await interaction.guild.members.fetch(me);
      const roleIndex = mem.roles.highest.position;
      const mRoleIndex = mention.roles.highest.position;
    if (permission.has('BanMembers')) {
       reason=interaction.options.get('reason')?.value;
      if (mRoleIndex >= roleIndex) {
        const embed2 = new EmbedBuilder()
          .setTitle(`You can't ban ${mention.displayName}`)
          .setDescription(`<@${mention.id}> cannot be banned by you`)
          .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
          .setColor('Red');
        message.reply({ embeds: [embed2] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
      } else {
        try {
          if(reason===undefined){
            reason="no reason";
          }
          await mention.ban();
          const embed2 = new EmbedBuilder()
            .setTitle('Ban succesful')
            .setDescription(`Succesfully banned <@${mention.id}> for ${reason}`)
            .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
            .setColor('Green');
          message.reply({ embeds: [embed2] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
        } catch (error) {
          console.log(error);
          const embed1 = new EmbedBuilder()
            .setTitle('Ban unsuccesful')
            .setDescription(`I can't ban that user, <@${mention.id}> is too powerful`)
            .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
            .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
            .setColor('Red');
          message.reply({ embeds: [embed1] }).catch(console.error,interaction.channel.send("The bot took to long to respond"));
        }
      }
    } else {
      const embed1 = new EmbedBuilder()
        .setTitle("You can't ban users ")
        .setDescription(`-_-`)
        .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
        .setImage('https://media.tenor.com/fbWWeaUTKn0AAAAM/weak-weakness.gif')
        .setColor('Red');
      message.reply({ embeds: [embed1] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
    }
  }
  if(interaction.commandName==='kick'){
    const member = interaction.options.get('user').value;
    const mention = await guild.members.fetch(member);
    const me = interaction.user.id;
      const mem = await interaction.guild.members.fetch(me);
      const roleIndex = mem.roles.highest.position;
      const mRoleIndex = mention.roles.highest.position;
    if(permission.has('KickMembers')){
    // Check if a member was actually mentioned
     reason=interaction.options.get('reason')?.value;
      if(mRoleIndex>=roleIndex){
        const embed2= new EmbedBuilder()
.setTitle("Can't kick this user" )
.setDescription(`You can't kick <@${mention.id}> `)
.setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
.setColor('Red');
message.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
      }
      else{
        try{
       await mention.kick();
        const embed1= new EmbedBuilder()
.setTitle('Kick succesful')
.setDescription(`Succesfully kicked <@${mention.id}> for ${reason}`)
.setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
.setColor('Green');
message.reply({embeds:[embed1]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
        }
        catch(error){
          const embed1= new EmbedBuilder()
.setTitle('Kick unsuccesful')
.setDescription(`I can't kick that user, <@${mention.id}> is too powerful`)
.setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
.setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
.setColor('Red');
message.reply({embeds:[embed1]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
        }
      }
    
   
   }
   else{
    const embed1= new EmbedBuilder()
.setTitle("You can't kick users ")
.setDescription(`-_-`)
.setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
.setImage('https://media.tenor.com/fbWWeaUTKn0AAAAM/weak-weakness.gif')
.setColor('Red');
message.reply({embeds:[embed1]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
   }
}
if(interaction.commandName==='mute'){
  const member = interaction.options.get('user').value;
    const mention = await guild.members.fetch(member);
    const me = interaction.user.id;
      const mem = await interaction.guild.members.fetch(me);
      const roleIndex = mem.roles.highest.position;
      const mRoleIndex = mention.roles.highest.position;
  var time=interaction.options.get('time')?.value;
  /*const muteRole = interaction.guild.roles.cache.find(
    r => r.id === muteRoleId
  )*/
  const muteRoleId=muteRoles[guild.id];
  const muteRole = interaction.guild.roles.cache.find(
    r => r.id === muteRoleId
  )
  if(!muteRole){
      const embed2 = new EmbedBuilder()
      .setTitle(`Mute role hasn't been set`)
      .setDescription(`Please use /setmuterole to set it`)
      .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
      .setColor('Red');
    message.reply({ embeds: [embed2] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
    return;
  }
  if (!interaction || interaction.expired) {
    message.channel.send('Interaction has expired or does not exist.');
    return;
  }
  else if(muteRoleset===true){
    console.log(muteRole.id)
  if(permission.has('MuteMembers')){
      if(mRoleIndex>=roleIndex){
        const embed2= new EmbedBuilder()
         .setTitle("You can't mute  this user")
         .setDescription(`You can't mute <@${mention.id}>`)
         .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
         .setColor('Red');
 interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
      }
      else{
        
    const t1=time;
    if(time===undefined){
      mention.roles.add(muteRole).then(()=>{
      const embed2= new EmbedBuilder()
      .setTitle('Mute succesful')
      .setDescription(`Succesfully muted <@${mention.id}> by ${message.user.username}`)
      .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
      .setColor('Green');
interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
      })
    }
    else{
    if(time.endsWith("s")){
      time = parseInt(time)*1000;
      try{
      mention.roles.add(muteRole).then(()=>{
        const embed2= new EmbedBuilder()
         .setTitle('Mute succesful')
         .setDescription(`Succesfully muted <@${mention.id}> by ${message.user.username} for ${t1}`)
         .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
         .setColor('Green');
 interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
      });
      setTimeout(function(){
        if(mention.roles.cache.some(role=> role.id==muteRoleId)){
         mention.roles.remove(muteRole)
         .then(()=>{
          const embed2= new EmbedBuilder()
         .setTitle('Unmuted')
         .setDescription(`Unmuted ${mention.displayName}`)
         .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
 message.channel.send({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
        })
        }
      },time)}
      catch(error){
        const embed2= new EmbedBuilder()
        .setTitle('Mute unsuccesful')
        .setDescription(`I can't mute that user, ${mention.displayName} is too powerful`)
        .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
        .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
        .setColor('Red')
        interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
      }
    }
    else if(time.endsWith("m")){
      time=parseInt(time)*60*1000;
      try{
        mention.roles.add(muteRole).then(()=>{
          const embed2= new EmbedBuilder()
           .setTitle('Mute succesful')
           .setDescription(`Succesfully muted ${mention.displayName} by ${message.user.username} for ${t1}`)
           .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
           .setColor('Green');
   interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
        });
        setTimeout(function(){
          if(mention.roles.cache.some(role=> role.id==muteRoleId)){
           mention.roles.remove(muteRole)
           .then(()=>{
            const embed2= new EmbedBuilder()
           .setTitle('Unmuted')
           .setDescription(`Unmuted ${mention.displayName}`)
           .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
   message.channel.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
          })
          }
        },time)}
        catch(error){
          const embed2= new EmbedBuilder()
          .setTitle('Mute unsuccesful')
          .setDescription(`I can't mute that user, ${mention.displayName} is too powerful`)
          .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
          .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
          .setColor('Red')
          interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
        }
    }
    else if(time.endsWith("h")){
      time=parseInt(time)*60*60*1000;
      try{
        mention.roles.add(muteRole).then(()=>{
          const embed2= new EmbedBuilder()
           .setTitle('Mute succesful')
           .setDescription(`Succesfully muted ${mention.displayName} by ${message.user.username} for ${t1}`)
           .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
           .setColor('Green');
   interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
        });
        setTimeout(function(){
          if(mention.roles.cache.some(role=> role.id==muteRoleId)){
           mention.roles.remove(muteRole)
           .then(()=>{
            const embed2= new EmbedBuilder()
           .setTitle('Unmuted')
           .setDescription(`Unmuted ${mention.displayName}`)
           .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
   message.channel.send({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
          })
          }
        },time)}
        catch(error){
          const embed2= new EmbedBuilder()
          .setTitle('Mute unsuccesful')
          .setDescription(`I can't mute that user, ${mention.displayName} is too powerful`)
          .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
          .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
          .setColor('Red')
          interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
        }
    }
    else {
      try{
     mention.roles.add(muteRole).then(()=>{
      const embed2= new EmbedBuilder()
         .setTitle('Mute succesful')
         .setDescription(`Succesfully muted ${mention.displayName} by ${message.user.username} }`)
         .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
         .setColor('Green');
 interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
    });
  }
  catch(error){
    const embed2= new EmbedBuilder()
          .setTitle('Mute unsuccesful')
          .setDescription(`I can't mute that user, ${mention.displayName} is too powerful`)
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
          .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
          .setColor('Red')
          interaction.reply({embeds:[embed2]}).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
  }
    }}
  }
    
  }
   else{
    const embed2 = new EmbedBuilder()
    .setTitle(`You can't mute users`)
    .setDescription(`-_-`)
    .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
    .setColor('Red');
  message.reply({ embeds: [embed2] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
   }

  }
  else if(muteRoleset===false){
    const embed2 = new EmbedBuilder()
    .setTitle(`Mute role hasn't been set`)
    .setDescription("Please use `/setmuterole` to set it")
    .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
    .setColor('Red');
  message.reply({ embeds: [embed2] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
  }
}
if (interaction.commandName === "unmute") {
  const member = interaction.options.get('user').value;
  const mention = await guild.members.fetch(member);
const muteroleId = muteRoles[guild.id];
  const muteRole = interaction.guild.roles.cache.find(
    r => r.id == muteroleId
  );
  if (!muteRole) {
    const embed2 = new EmbedBuilder()
      .setTitle(`Mute role hasn't been set`)
      .setDescription("Please use `/setmuterole` to set it")
      .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
      .setColor('Red');
    message.reply({ embeds: [embed2] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
  }
 else {
  if (permission.has('MuteMembers')) {
    if (mention.roles.cache.some(role => role.id === muteroleId)) {
      mention.roles.remove(muteRole).then(() => {
        const embed = new EmbedBuilder()
          .setTitle("Unmute successful")
          .setDescription(`Successfully unmuted ${mention.displayName}`)
          .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
          .setColor('Green');
        interaction.reply({ embeds: [embed] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Unmuting the unmuted")
        .setDescription(`Bruh`)
        .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
        .setColor('Orange');
      interaction.reply({ embeds: [embed] }).catch(error => {
    console.error(error);
    message.channel.send("The application took too long to respond.");
  });
    }
  } else {
    const embed2 = new EmbedBuilder()
      .setTitle(`Bruh`)
      .setDescription(`You can't unmute users`)
      .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
      .setColor('Red');
    message.reply({ embeds: [embed2] }).catch(console.error,message.channel.send("The application took too long to respond"));
  }
}}
})
client.on('guildMemberRemove',(member)=>{
  members.removeName(member.displayName);
  console.log(member.displayName)
  const channelS= client.channels.cache.get('1103960204007182338');
  channelS.send(`${member.displayName} left for ${reason}, we stand with only ${member.guild.memberCount} people`);
 });
 client.on('guildBanAdd',(Ban)=>{
  members.removeName(Ban.user.username);
  const member=Ban.user;
const channelS= client.channels.cache.get('1103960204007182338');
channelS.send(`${Ban.user.username} was banned due to ${reason} , we are better with ${Ban.guild.memberCount} people`);
 });
