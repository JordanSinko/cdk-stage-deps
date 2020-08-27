import { Bucket, IBucket } from "@aws-cdk/aws-s3";
import { StringParameter } from "@aws-cdk/aws-ssm/lib/parameter";
import {
    Construct,
    RemovalPolicy,
    Stack,
    StackProps,
    Stage,
    StageProps,
} from "@aws-cdk/core";

class AccountStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const { bucketArnParameterName } = this.node.tryGetContext(
            `stack:${id}`
        );

        const bucket = new Bucket(this, "Bucket", {
            removalPolicy: RemovalPolicy.DESTROY,
        });

        new StringParameter(this, "Parameter", {
            parameterName: bucketArnParameterName,
            stringValue: bucket.bucketArn,
        });
    }
}

export default class AccountStage extends Stage {
    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props);

        new AccountStack(this, "AccountStack", {});
    }
}
