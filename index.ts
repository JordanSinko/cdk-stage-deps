import { Artifact } from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction } from '@aws-cdk/aws-codepipeline-actions/lib/github/source-action';
import { App, Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';

import AccountStage from './AccountStage';
import AppStage from './AppStage';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: 'MyAppPipeline',
      cloudAssemblyArtifact,

      sourceAction: new GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('GITHUB_TOKEN_NAME'),
        owner: 'OWNER',
        repo: 'REPO',
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
      }),
    });

    const accountStage = new AccountStage(this, 'AccountStage', {});

    pipeline.addApplicationStage(accountStage);

    const appStage = new AppStage(this, 'AppStage', {
      bucket: accountStage.bucket,
    });

    pipeline.addApplicationStage(appStage);
  }
}

const app = new App();
new PipelineStack(app, 'PipelineStack', {});
