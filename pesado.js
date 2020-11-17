
const { Client } = require('discord.js');
const antiTrava = new Client();

//Token do bot, coloquei em baixo
antiTrava.login("");


//Registrar na console quando o anti-trava estiver online
antiTrava.on('ready', () => console.log("Anti-trava esta online, blidado!!!"));


const MapUsuario = new Map();
const LIMITE = 5;
const TEMPO = 1000;
const DIFF = 3000;

antiTrava.on('message', message => {
  if(message.author.bot) return;
  if(MapUsuario.has(message.author.id)) { //Pegar o id do usuario (Tem)
    const DataUsuario = MapUsuario.get(message.author.id); //Pegar o usuario pelo iid
    const { lastMessage, timer } = DataUsuario;
    const deferença = message.createdTimestamp - lastMessage.createdTimestamp; //Comparar a ultima mensagem e a atual do spam
    let msgquanti = DataUsuario.msgquanti; //Quantidade de mensagens enviadas pelo mesmo usuario salvo
    console.log(deferença); //Enviar na console a diferença ente as mensagens
    if(deferença > DIFF) {
      clearTimeout(timer); //Limpar o Timout (Tempo)
      console.log('Timeout foi limpo');
      DataUsuario.msgquanti = 1;
      DataUsuario.lastMessage = message;
      DataUsuario.timer = setTimeout(() => { //Timeout
        MapUsuario.delete(message.author.id);
        console.log('Removido do reset.');
      }, TEMPO);
      MapUsuario.set(message.author.id, DataUsuario);
    }
    else {
      ++msgquanti;
      if(parseInt(msgquanti) === LIMITE) { // Caso o limite for alcançado ele começara a ação abaixo
        const cargo = message.guild.roles.cache.get('CARGO AQUI ID');
        message.member.roles.add(cargo);
        message.channel.send('Você foi mutado por tentar travar o servidor, hoje não foi seu dia');
        setTimeout(() => {
          message.member.roles.remove(cargo);
          message.channel.send('Você foi desmutado por meu sistema');
        }, TEMPO);
      } else {
        DataUsuario.msgquanti = msgquanti;
        MapUsuario.set(message.author.id, DataUsuario);
      }
    }
  }
  else {
    let fn = setTimeout(() => {
      MapUsuario.delete(message.author.id);
      console.log('Removido do map');
    }, TEMPO);
    MapUsuario.set(message.author.id, {
      msgCount: 1,
      lastMessage: message,
      timer: fn
    });
  }
});
