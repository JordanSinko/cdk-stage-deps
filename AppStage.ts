import { Construct, Stack, StackProps, Stage, StageProps } from "@aws-cdk/core";
import { Code, Function as AwsFunction, Runtime } from "@aws-cdk/aws-lambda";
import { Bucket, IBucket } from "@aws-cdk/aws-s3";
import { StringParameter } from "@aws-cdk/aws-ssm/lib/parameter";
import { SsmParameterReader } from "./SsmParameterReader";

interface AppStackProps extends StackProps {
    //bucket: IBucket;
}

class AppStack extends Stack {
    constructor(scope: Construct, id: string, props: AppStackProps) {
        super(scope, id, props);

        const { bucketArnParameterName } = this.node.tryGetContext(
            "stack:AccountStack"
        );

        const parameter = new SsmParameterReader(this, "Parameter", {
            region: "us-east-1",
            parameters: {
                Name: bucketArnParameterName,
                WithDecryption: false,
            },
        });

        const bucket = Bucket.fromBucketArn(
            this,
            "Bucket",
            parameter.getParameterValue()
        );

        const handler = new AwsFunction(this, "Function", {
            code: Code.fromInline(`export.handler = async => 'Hello, world!'`),
            runtime: Runtime.NODEJS_12_X,
            handler: "index.handler",
        });

        bucket.grantRead(handler);
    }
}

export interface AppStageProps extends StageProps {
    //bucket: IBucket;
}

export default class AppStage extends Stage {
    constructor(scope: Construct, id: string, props: AppStageProps) {
        super(scope, id, props);

        new AppStack(this, "AppStack", {});
    }
}
