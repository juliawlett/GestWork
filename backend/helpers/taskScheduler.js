const Tarefa = require('../model/Tarefa');
const User = require('../model/User');
const Transporter = require('./email-config');
const { Sequelize } = require('sequelize');
const schedule = require('node-schedule');

// Função para verificar tarefas em atraso e enviar e-mails de notificação
async function checkAndNotifyOverdueTasks() {
  try {
    const currentDate = new Date();

    // Encontre todas as tarefas com data de finalização anterior à data atual e status "em atraso"
    const overdueTasks = await Tarefa.findAll({
      where: {
        predicted_end: {
          [Sequelize.Op.lt]: currentDate,
        }
      }
    });

    if (overdueTasks.length > 0) {
      // Enviar e-mails de notificação para as tarefas em atraso
      for (const task of overdueTasks) {
        // Verificar se o status da tarefa não é "CONCLUIDA" ou "CANCELADA"
        if (task.status !== 'concluida' && task.status !== 'cancelada') {
          try {
            // Encontre o usuário que criou a tarefa
            const user = await User.findByPk(task.UserId);

            if (user && user.email) {
              const mailOptions = {
                from: 'julialeticia100@gmail.com', // Use o seu e-mail como remetente
                to: user.email, // Use o e-mail do usuário que criou a tarefa como destinatário
                subject: `Tarefa em Atraso #${task.id_card}`,
                text: `A tarefa "${task.id_card}" está em atraso.\n\n Acesse o nossa plataforma e continue com sua gestão de atividade.\n\nAtenciosamente,\nSua Equipe GestWork`,
              };

              Transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error('Erro ao enviar e-mail de notificação:', error);
                } else {
                  console.log('E-mail de notificação enviado com sucesso:', info.response);
                }
              });
            } else {
              console.error('Usuário não encontrado ou não possui e-mail definido:', user);
            }
          } catch (error) {
            console.error('Erro ao buscar usuário que criou a tarefa:', error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro ao verificar tarefas em atraso:', error);
  }
}

// Agende a verificação diária às 21:41
const scheduledTask = schedule.scheduleJob('00 01 * * *', () => {
  console.log('Verificando tarefas em atraso...');
  checkAndNotifyOverdueTasks();
});

// Exporte a função checkAndNotifyOverdueTasks para poder usá-la em outros lugares, se necessário
module.exports = { checkAndNotifyOverdueTasks };
