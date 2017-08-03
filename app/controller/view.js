module.exports = (app) => {
  class ViewController extends app.Controller {
    * index() {
      const server = process.env.HOST_IP;
      this.ctx.logger.info(`server: ${server}`);

      this.ctx.logger.info('Hello MO');
      yield this.ctx.render('index.html');
    }
  }

  return ViewController;
};
