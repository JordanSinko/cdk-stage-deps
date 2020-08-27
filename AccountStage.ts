import { Bucket, IBucket } from '@aws-cdk/aws-s3';
import {
  Construct,
  RemovalPolicy,
  Stack,
  StackProps,
  Stage,
  StageProps,
} from '@aws-cdk/core';

class AccountStack extends Stack {
  readonly bucket: IBucket;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.bucket = new Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

export default class AccountStage extends Stage {
  readonly bucket: IBucket;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    const { bucket } = new AccountStack(this, 'AccountStack', {});

    this.bucket = bucket;
  }
}
