import { Construct } from "@aws-cdk/core";
import {
    AwsCustomResource,
    AwsCustomResourcePolicy,
    AwsCustomResourceProps,
    PhysicalResourceId,
} from "@aws-cdk/custom-resources";

export interface SsmParameterReaderProps {
    region: string;
    parameters: {
        Name: string;
        WithDecryption: boolean;
    };
}

export class SsmParameterReader extends AwsCustomResource {
    constructor(scope: Construct, id: string, props: SsmParameterReaderProps) {
        super(scope, id, {
            onUpdate: {
                service: "SSM",
                action: "getParameter",
                parameters: props.parameters,
                region: props.region,
                physicalResourceId: PhysicalResourceId.of(
                    Date.now().toString()
                ),
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({
                resources: AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
        });
    }

    public getParameterValue(): string {
        return this.getResponseField("Parameter.Value").toString();
    }
}
