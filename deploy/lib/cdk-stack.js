require('dotenv').config()
const events = require('@aws-cdk/aws-events');
const targets = require('@aws-cdk/aws-events-targets');
const lambda = require('@aws-cdk/aws-lambda');
const cdk = require('@aws-cdk/core');
const path = require('path')

const { BUNQ_PRIVATE_KEY, BUNQ_API_KEY, BUNQ_DEVICE_KEY, TICKUSERNAME, TICKPASSWORD, CDK_ACCOUNT, CDK_REGION } = process.env

class CdkStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, {
      ...props, 
      env: { 
        account: CDK_ACCOUNT,
        region: CDK_REGION
      }
    });

    const lambdaFn = new lambda.Function(this, 'Singleton', {
      code: lambda.Code.fromAsset(path.join(__dirname, "../src")),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: { 
        BUNQ_API_KEY,
        BUNQ_DEVICE_KEY,
        BUNQ_PRIVATE_KEY,
        TICKPASSWORD,
        TICKUSERNAME
      }
    });

    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.expression('cron(0 23 * * ? *)')
    });

    rule.addTarget(new targets.LambdaFunction(lambdaFn));  
  }
}

module.exports = { CdkStack }
