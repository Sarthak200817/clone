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
client.login(process.env.DISCORDJS_BOT_TOKEN);
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
 client.on('guildMemberRemove',(member)=>{
  members.removeName(member.displayName);
  console.log(member.displayName)
  const channelS= client.channels.cache.get('1103960204007182338');
  channelS.send(`${member.displayName} left, we stand with only ${member.guild.memberCount} people`);
 });
 client.on('guildBanAdd',(Ban)=>{
  members.removeName(Ban.user.username);
  const member=Ban.user;
const channelS= client.channels.cache.get('1103960204007182338');
channelS.send(`${Ban.user.username} was banned by  due to reasons , we are better with ${Ban.guild.memberCount} people`);
 });
//commands

client.on('messageCreate',async (message)=>{
  if(message.content.startsWith(prefix)===true){
    var cmd=message.content.replace(prefix,"");
    const permissions = message.member.permissions;
    const roleIndex = message.member.roles.highest.position;
    const mention = message.mentions.members.first();
    const avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 128 });
    const Wmention=cmd.replace("kick ","");
    if(cmd.startsWith("kick ")){
      if(permissions.has('KickMembers')){
      // Check if a member was actually mentioned
      if (!mention) {
        const embed1= new EmbedBuilder()
  .setTitle('Invalid User')
  .setDescription(`Please mention a valid user as ${Wmention} is not one`)
  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
  .setColor('Red');
  interaction.reply({embeds:[embed1]});
        return;
      }

      else{
       // const mention = message.mentions.members.first();
        const mRoleIndex=mention.roles.highest.position;
        if(mRoleIndex>=roleIndex){
          const embed2= new EmbedBuilder()
  .setTitle("Can't kick this user" )
  .setDescription(`You can't kick ${mention.displayName} `)
  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
  .setColor('Red');
  interaction.reply({embeds:[embed2]});
        }
        else{
          try{
         await mention.kick();
          const embed1= new EmbedBuilder()
  .setTitle('Kick succesful')
  .setDescription(`Succesfully kicked ${mention.displayName}`)
  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
  .setColor('Green');
  interaction.reply({embeds:[embed1]});
          }
          catch(error){
            const embed1= new EmbedBuilder()
  .setTitle('Kick unsuccesful')
  .setDescription(`I can't kick that user, ${mention.displayName} is too powerful`)
  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
  .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
  .setColor('Red');
  interaction.reply({embeds:[embed1]});
          }
        }
      }
     
     }
     else{
      const embed1= new EmbedBuilder()
  .setTitle("You can't kick users ")
 .setDescription(`-_-`)
  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
  .setImage('https://media.tenor.com/fbWWeaUTKn0AAAAM/weak-weakness.gif')
  .setColor('Red');
  interaction.reply({embeds:[embed1]});
     }
    }
    if(cmd.startsWith("ban ")===true){
      if(permissions.has('BanMembers')){
        // Check if a member was actually mentioned
        if (!mention) {
          const embed2= new EmbedBuilder()
          .setTitle('Invalid User')
          .setDescription(`Please mention a valid user as ${Wmention} is not one`)
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
          .setColor('Red');
  interaction.reply({embeds:[embed2]});
          return;
        }
  
        else{
         // const mention = message.mentions.members.first();
          const mRoleIndex=mention.roles.highest.position;
          if(mRoleIndex>=roleIndex){
            const embed2= new EmbedBuilder()
          .setTitle(`You can't ban ${mention.displayName}`)
          .setDescription(`${mention.displayName} cannot be banned by you`)
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
          .setColor('Red');
  interaction.reply({embeds:[embed2]});
          }
          else{
            try{
            await mention.ban();
             const embed2= new EmbedBuilder()
             .setTitle('Ban succesful')
             .setDescription(`Succesfully banned ${mention.displayName}`)
             .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
             .setColor('Green');
     interaction.reply({embeds:[embed2]});
            }
            catch(error){
              const embed1= new EmbedBuilder()
  .setTitle('Ban unsuccesful')
  .setDescription(`I can't ban that user, ${mention.displayName} is too powerful`)
  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
  .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
  .setColor('Red');
  interaction.reply({embeds:[embed1]});
            }
          }
        }
       
       }
       else{
        const embed1= new EmbedBuilder()
  .setTitle("You can't ban users ")
 .setDescription(`-_-`)
  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
  .setImage('https://media.tenor.com/fbWWeaUTKn0AAAAM/weak-weakness.gif')
  .setColor('Red');
  interaction.reply({embeds:[embed1]});
       }
    }
    if(cmd.startsWith("mute ")===true){
        var wuser=Wmention.replace(mention,"");
        wuser=wuser.split(" ")[0];
        const muteRole="1105393012021919764"
      const mute = message.guild.roles.cache.find(role => role.id === muteRole);

      if(permissions.has('MuteMembers')){
        // Check if a member was actually mentioned

        if (!mention) {
          const embed2= new EmbedBuilder()
             .setTitle('Invalid user')
             .setDescription(`Please mention a valid user as ${wuser} is not one`)
             .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
             .setColor('Red');
     interaction.reply({embeds:[embed2]});
          return;
        }
  
        else{
         // const mention = message.mentions.members.first();
          const mRoleIndex=mention.roles.highest.position;
          if(mRoleIndex>=roleIndex){
            const embed2= new EmbedBuilder()
             .setTitle("You can't mute  this user")
             .setDescription(`You caan't mute ${mention.displayName}`)
             .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
             .setColor('Red');
     interaction.reply({embeds:[embed2]});
          }
          else{
            var time=cmd.replace("mute ","");
        time=time.replace(mention,"");
        time=time.trimEnd();
        const t1=time;
        if(time.endsWith("s")){
          time = parseInt(time)*1000;
          try{
          mention.roles.add(mute).then(()=>{
            const embed2= new EmbedBuilder()
             .setTitle('Mute succesful')
             .setDescription(`Succesfully muted ${mention.displayName} by ${message.author.username} for ${t1}`)
             .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
             .setColor('Green');
     interaction.reply({embeds:[embed2]});
          });
          setTimeout(function(){
            if(mention.roles.cache.some(role=> role.id==mute)){
             mention.roles.remove(mute)
             .then(()=>{
              const embed2= new EmbedBuilder()
             .setTitle('Unmuted')
             .setDescription(`Unmuted ${mention.displayName}`)
             .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
     interaction.reply({embeds:[embed2]});
            })
            }
          },time)}
          catch(error){
            const embed2= new EmbedBuilder()
            .setTitle('Mute unsuccesful')
            .setDescription(`I can't mute that user, ${mention.displayName} is too powerful`)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
            .setColor('Red')
            interaction.reply({embeds:[embed2]});
          }
        }
        else if(time.endsWith("m")){
          time=parseInt(time)*60*1000;
          try{
            mention.roles.add(mute).then(()=>{
              const embed2= new EmbedBuilder()
               .setTitle('Mute succesful')
               .setDescription(`Succesfully muted ${mention.displayName} by ${message.author.username} for ${t1}`)
               .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
               .setColor('Green');
       interaction.reply({embeds:[embed2]});
            });
            setTimeout(function(){
              if(mention.roles.cache.some(role=> role.id==mute)){
               mention.roles.remove(mute)
               .then(()=>{
                const embed2= new EmbedBuilder()
               .setTitle('Unmuted')
               .setDescription(`Unmuted ${mention.displayName}`)
               .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
       interaction.reply({embeds:[embed2]});
              })
              }
            },time)}
            catch(error){
              const embed2= new EmbedBuilder()
              .setTitle('Mute unsuccesful')
              .setDescription(`I can't mute that user, ${mention.displayName} is too powerful`)
              .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
              .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
              .setColor('Red')
              interaction.reply({embeds:[embed2]});
            }
        }
        else if(time.endsWith("h")){
          time=parseInt(time)*60*60*1000;
          try{
            mention.roles.add(mute).then(()=>{
              const embed2= new EmbedBuilder()
               .setTitle('Mute succesful')
               .setDescription(`Succesfully muted ${mention.displayName} by ${message.author.username} for ${t1}`)
               .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
               .setColor('Green');
       interaction.reply({embeds:[embed2]});
            });
            setTimeout(function(){
              if(mention.roles.cache.some(role=> role.id==mute)){
               mention.roles.remove(mute)
               .then(()=>{
                const embed2= new EmbedBuilder()
               .setTitle('Unmuted')
               .setDescription(`Unmuted ${mention.displayName}`)
               .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
       interaction.reply({embeds:[embed2]});
              })
              }
            },time)}
            catch(error){
              const embed2= new EmbedBuilder()
              .setTitle('Mute unsuccesful')
              .setDescription(`I can't mute that user, ${mention.displayName} is too powerful`)
              .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
              .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
              .setColor('Red')
              interaction.reply({embeds:[embed2]});
            }
        }
        else {
          try{
         mention.roles.add(mute).then(()=>{
          const embed2= new EmbedBuilder()
             .setTitle('Mute succesful')
             .setDescription(`Succesfully muted ${mention.displayName} by ${message.author.username} }`)
             .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
             .setColor('Green');
     interaction.reply({embeds:[embed2]});
        });
      }
      catch(error){
        const embed2= new EmbedBuilder()
              .setTitle('Mute unsuccesful')
              .setDescription(`I can't mute that user, ${mention.displayName} is too powerful`)
              .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
              .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
              .setColor('Red')
              interaction.reply({embeds:[embed2]});
      }
        }


            /*try{
            await mention.ban();
             message.channel.send(`Succesfully banned ${mention}`);
            }
            catch(error){
              message.channel.send("Failed to ban user");
            }
          }
        }
               
       }*/
      }
        }
      }
       else{
        message.channel.send("You can't mute users")
       }
    }
 if(cmd.startsWith("unmute ")){
  const muteRole="1105393012021919764";
      const mute = message.guild.roles.cache.find(role => role.id === muteRole);
  if(permissions.has('MuteMembers')){
     if(!mention){
      const embed2= new EmbedBuilder()
      .setTitle('Invalid user')
      .setDescription(`Please mention a valid use as ${Wmention} is not one`)
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
      .setColor('Red')
      interaction.reply({embeds:[embed2]});
     }else{
      if(mention.roles.cache.some(role=> role.id==mute)){
        mention.roles.remove(mute).then(()=>{
          const embed=new EmbedBuilder()
          .setTitle("Unmute succesful")
          .setDescription(`Succesfully unmuted ${mention.displayName}`)
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
      .setColor('Red')
      interaction.reply({embeds:[embed]});
        })
      }
      else{
        const embed=new EmbedBuilder()
          .setTitle("Unmuting the unmuted")
          .setDescription(`Bruh`)
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
      .setColor('Orange')
      interaction.reply({embeds:[embed]});
      }
     }
  }
  else{
    const embed=new EmbedBuilder()
    .setTitle("You can't unmute people")
    .setDescription(`You dont'have the permission to unmute`)
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
.setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
.setColor('Red')
interaction.reply({embeds:[embed]});
  }
 }
    
 
}
  
})
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

client.on('messageCreate',(message)=>{
  const result = containsBadWords(message.content);
  if(message.author.bot)return;
  if(result.used===true){
    const embed=new EmbedBuilder()
    .setTitle("You cursed")
    .setDescription(`You used ${result.usedWords.join(", ")}`)
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
 .setColor('Red')
message.reply({embeds:[embed]})
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

  if (interaction.commandName === 'muterole') {
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
        
      message.reply({ embeds: [embed2] });
    } else {
      const embed2 = new EmbedBuilder()
        .setTitle(`You can't set mute role`)
        .setDescription(`<@${interaction.user.id}> you can't set the mute role `)
        .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
        .setColor('Red');
        
      message.reply({ embeds: [embed2] });
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
      var reason=interaction.options.get('reason')?.value;
      if (mRoleIndex >= roleIndex) {
        const embed2 = new EmbedBuilder()
          .setTitle(`You can't ban ${mention.displayName}`)
          .setDescription(`<@${mention.id}> cannot be banned by you`)
          .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
          .setColor('Red');
        message.reply({ embeds: [embed2] });
      } else {
        try {
          if(reason===undefined){
            reason="no reason";
          }
          //await mention.ban();
          const embed2 = new EmbedBuilder()
            .setTitle('Ban succesful')
            .setDescription(`Succesfully banned <@${mention.id}> for ${reason}`)
            .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
            .setColor('Green');
          message.reply({ embeds: [embed2] });
        } catch (error) {
          console.log(error);
          const embed1 = new EmbedBuilder()
            .setTitle('Ban unsuccesful')
            .setDescription(`I can't ban that user, <@${mention.id}> is too powerful`)
            .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
            .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
            .setColor('Red');
          message.reply({ embeds: [embed1] });
        }
      }
    } else {
      const embed1 = new EmbedBuilder()
        .setTitle("You can't ban users ")
        .setDescription(`-_-`)
        .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
        .setImage('https://media.tenor.com/fbWWeaUTKn0AAAAM/weak-weakness.gif')
        .setColor('Red');
      message.reply({ embeds: [embed1] });
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
    var reason=interaction.options.get('reason')?.value;
      if(mRoleIndex>=roleIndex){
        const embed2= new EmbedBuilder()
.setTitle("Can't kick this user" )
.setDescription(`You can't kick <@${mention.id}> `)
.setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
.setColor('Red');
message.reply({embeds:[embed2]});
      }
      else{
        try{
      // await mention.kick();
        const embed1= new EmbedBuilder()
.setTitle('Kick succesful')
.setDescription(`Succesfully kicked <@${mention.id}> for ${reason}`)
.setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
.setColor('Green');
message.reply({embeds:[embed1]});
        }
        catch(error){
          const embed1= new EmbedBuilder()
.setTitle('Kick unsuccesful')
.setDescription(`I can't kick that user, <@${mention.id}> is too powerful`)
.setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
.setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
.setColor('Red');
message.reply({embeds:[embed1]});
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
message.reply({embeds:[embed1]});
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
      .setDescription(`Please use /muterole to set it`)
      .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
      .setColor('Red');
    message.reply({ embeds: [embed2] });
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
 interaction.reply({embeds:[embed2]});
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
interaction.reply({embeds:[embed2]});
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
 interaction.reply({embeds:[embed2]});
      });
      setTimeout(function(){
        if(mention.roles.cache.some(role=> role.id==muteRoleId)){
         mention.roles.remove(muteRole)
         .then(()=>{
          const embed2= new EmbedBuilder()
         .setTitle('Unmuted')
         .setDescription(`Unmuted ${mention.displayName}`)
         .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
 message.channel.send({embeds:[embed2]});
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
        interaction.reply({embeds:[embed2]});
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
   interaction.reply({embeds:[embed2]});
        });
        setTimeout(function(){
          if(mention.roles.cache.some(role=> role.id==muteRoleId)){
           mention.roles.remove(muteRole)
           .then(()=>{
            const embed2= new EmbedBuilder()
           .setTitle('Unmuted')
           .setDescription(`Unmuted ${mention.displayName}`)
           .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
   message.channel.reply({embeds:[embed2]});
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
          interaction.reply({embeds:[embed2]});
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
   interaction.reply({embeds:[embed2]});
        });
        setTimeout(function(){
          if(mention.roles.cache.some(role=> role.id==muteRoleId)){
           mention.roles.remove(muteRole)
           .then(()=>{
            const embed2= new EmbedBuilder()
           .setTitle('Unmuted')
           .setDescription(`Unmuted ${mention.displayName}`)
           .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
   message.channel.send({embeds:[embed2]});
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
          interaction.reply({embeds:[embed2]});
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
 interaction.reply({embeds:[embed2]});
    });
  }
  catch(error){
    const embed2= new EmbedBuilder()
          .setTitle('Mute unsuccesful')
          .setDescription(`I can't mute that user, ${mention.displayName} is too powerful`)
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
          .setImage('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')
          .setColor('Red')
          interaction.reply({embeds:[embed2]});
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
  message.reply({ embeds: [embed2] });
   }

  }
  else if(muteRoleset===false){
    const embed2 = new EmbedBuilder()
    .setTitle(`Mute role hasn't been set`)
    .setDescription(`Please use /muterole to set it`)
    .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
    .setColor('Red');
  message.reply({ embeds: [embed2] });
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
      .setDescription("Please use `/muterole` to set it")
      .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
      .setColor('Red');
    message.reply({ embeds: [embed2] });
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
        interaction.reply({ embeds: [embed] });
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Unmuting the unmuted")
        .setDescription(`Bruh`)
        .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
        .setColor('Orange');
      interaction.reply({ embeds: [embed] });
    }
  } else {
    const embed2 = new EmbedBuilder()
      .setTitle(`Bruh`)
      .setDescription(`You can't unmute users`)
      .setAuthor({ name: message.user.username, iconURL: message.user.displayAvatarURL() })
      .setColor('Red');
    message.reply({ embeds: [embed2] });
  }
}}
})
