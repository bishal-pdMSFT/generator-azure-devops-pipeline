'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  //paramsDone = this.async();
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the luminous ${chalk.red('generator-azure-devops-pipeline')} generator!`)
    );

    //var done = this.async();
    const extPrompts = [
      {
        type: 'input',
        name: 'extensionId',
        message: 'Name of your extension?',
        default: this.appname
      }
    ];

    const pipelineParamsPrompts = [
      {
        type: 'list',
        name: 'inputs',
        message: 'Inputs for pipeline template?'
      }
    ];

    return this.prompt(extPrompts).then(extProps => {
      // To access props later use this.props.someAnswer;
      this.props = {
        extProps: extProps
      };

      //this.prompt(pipelineParamsPrompts).then(pipelineParams => {
      //this.props['pipelineParams'] = pipelineParams;
      return this.promptForInput();
      //})
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_vss-extension.json'),
      this.destinationPath('vss-extension.json'), {
        extProps: this.props.extProps,
        pipelineParams: this.props.pipelineParams
      }
    );
  }

  install() {
    this.installDependencies();
  }

  promptForInput() {

    var done = this.async();
    var promtMoreFunc = function () {
      const moreInputsPrompt = [
        {
          type: 'confirm',
          name: 'moreInput',
          message: 'Add more input?',
          default: true
        }
      ];

      console.log("prompting for more..")
      var promise = new Promise(
        function (resolve, reject) {
          this.prompt(moreInputsPrompt).then(moreInputs => {
            resolve(moreInputs.moreInput);
            // if (moreInputs.moreInput) {
            //   return this.promptForInput();
            // } else {
            //   console.log("No more inputs")
            //   return Promise.resolve();
            //   //this.async().resolve();
            // }
          });
        }.bind(this));

      return promise;
    }.bind(this);

    var promptInputFunc = function () {
      const pipelineParamPrompts = [
        {
          type: 'input',
          name: 'id',
          message: 'Input id?'
        },
        {
          type: 'list',
          name: 'type',
          message: 'Input type?',
          choices: ['string', 'secureString']
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description of input?'
        }
      ];

      return this.prompt(pipelineParamPrompts).then(pipelineParam => {
        //this.props.inputs.push(pipelineParam);
        var promise = new Promise(
          function (resolve, reject) {
            promtMoreFunc().then((more) => {
              console.log("More: " + more);
              if (more) {
                return promptInputFunc();
              } else {
                resolve();
              }
            });
          }.bind(this));

        return promise;
      });
    }.bind(this);

    return promptInputFunc();
  }

  // promptForMore() {
  //   const moreInputsPrompt = [
  //     {
  //       type: 'confirm',
  //       name: 'moreInput',
  //       message: 'Add more input?',
  //       default: true
  //     }
  //   ];

  //   console.log("prompting for more..")
  //   return this.prompt(moreInputsPrompt).then(moreInputs => {
  //     return Promise.resolve(moreInputs.moreInput);
  //     // if (moreInputs.moreInput) {
  //     //   return this.promptForInput();
  //     // } else {
  //     //   console.log("No more inputs")
  //     //   return Promise.resolve();
  //     //   //this.async().resolve();
  //     // }
  //   });
  // }
};
