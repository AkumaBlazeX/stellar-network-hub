import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda';

const lambda = new LambdaClient({ region: 'us-east-1' });

async function checkLambdaFunctions() {
  try {
    console.log('🔍 Checking Lambda functions...\n');
    
    const command = new ListFunctionsCommand({});
    const response = await lambda.send(command);
    
    console.log('📋 All Lambda Functions:');
    response.Functions.forEach(func => {
      console.log(`- ${func.FunctionName} (${func.Runtime})`);
    });
    
    const uploadFunction = response.Functions.find(f => 
      f.FunctionName.includes('upload') || f.FunctionName.includes('Upload')
    );
    
    if (uploadFunction) {
      console.log(`\n✅ Found upload function: ${uploadFunction.FunctionName}`);
      console.log(`📅 Last modified: ${uploadFunction.LastModified}`);
      console.log(`⏱️ Timeout: ${uploadFunction.Timeout}s`);
      console.log(`💾 Memory: ${uploadFunction.MemorySize}MB`);
    } else {
      console.log('\n❌ No upload function found!');
      console.log('🔧 You need to create the Lambda function first.');
    }
    
  } catch (error) {
    console.error('❌ Error checking Lambda functions:', error.message);
    console.log('\n💡 If you get authentication errors, you need to:');
    console.log('1. Configure AWS CLI: aws configure');
    console.log('2. Or use AWS Console to check manually');
  }
}

checkLambdaFunctions(); 