import { LMStudioClient } from '@lmstudio/sdk';
import { Models } from './models';
import { runMathTests } from './tests/math';
import { runSummarizationTests } from './tests/summarization';

const client = new LMStudioClient();
const model = await client.llm.model(Models.LFM2_1_2B);

await runMathTests(model);
await runSummarizationTests(model);
