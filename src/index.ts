import { LMStudioClient } from '@lmstudio/sdk';
import { Models } from './models';
import { runMathTests } from './tests/math';
const client = new LMStudioClient();

const model = await client.llm.model(Models.GEMMA_12B);

await runMathTests(model);
