var flat = require('array.prototype.flat');

const challengeMsg = {
    subscribe: (parent, args, ctx, info) => {
      return ctx.db.subscription.challengeMessage(
        { where:{
          AND: [
            {
              mutation_in: ["CREATED"]
            },
            {
            node: {
              challenge: {
                id: args.challengeId
                }
              }
            }
          ] }
        },
        info
      )
    }
  }


const newPanel = {
      subscribe: async (parent, args, ctx, info) => {
        return ctx.db.subscription
          .panel({ where:{
            AND: [
              {
                mutation_in: ["CREATED"]
              },
              {
              node: {
                test: {
                  id: args.testId
                  }
                }
              }
            ] }
          },
        `{ node { id link questions { questionAnswers {  answer { correct } } } } }` )
      },
      resolve: (payload, args, context, info) => {
        const panel = payload.panel.node
        return {
          id:panel.id,
          question:'',
          panelLink:panel.link,
          total: flat(panel.questions.map(q => q.questionAnswers.map(a => a.answer.correct))).length,
          totalCorrect: flat(panel.questions.map(q => q.questionAnswers.map(a => a.answer.correct))).filter(a => a).length,
          percentCorrect: flat(panel.questions.map(q => q.questionAnswers.map(a => a.answer.correct))).filter(a => a).length / flat(panel.questions.map(q => q.questionAnswers.map(a => a.answer.correct))).length > 0 ? flat(panel.questions.map(q => q.questionAnswers.map(a => a.answer.correct))).filter(a => a).length / flat(panel.questions.map(q => q.questionAnswers.map(a => a.answer.correct))).length : 0.0
        }
      },
    }


module.exports = {
  challengeMsg,
  newPanel
}
