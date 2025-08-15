import { LMStudioClient } from '@lmstudio/sdk';
import { Models } from './models';
import { runMathTests } from './tests/math';
import { runSummarizationTests } from './tests/summarization';
const client = new LMStudioClient();

const model = await client.llm.model(Models.GEMMA_270M);

await runMathTests(model);
await runSummarizationTests(model);
