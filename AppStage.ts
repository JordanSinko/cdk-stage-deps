import { Construct, Stack, StackProps, Stage, StageProps } from "@aws-cdk/core";
import { Code, Function as AwsFunction, Runtime } from "@aws-cdk/aws-lambda";
import { Bucket, IBucket } from "@aws-cdk/aws-s3";
import { StringParameter } from "@aws-cdk/aws-ssm/lib/parameter";

interface AppStackProps extends StackProps {
    //bucket: IBucket;
}

class AppStack extends Stack {
    constructor(scope: Construct, id: string, props: AppStackProps) {
        super(scope, id, props);

        const { bucketArnParameterName } = this.node.tryGetContext(
            "stack:AccountStack"
        );

        console.log(bucketArnParameterName);

        const bucketArn = StringParameter.fromStringParameterAttributes(
            this,
            "Parameter",
            {
                parameterName: bucketArnParameterName,
            }
        ).stringValue;

        const bucket = Bucket.fromBucketArn(this, "Bucket", bucketArn);

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
