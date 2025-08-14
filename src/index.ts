import { LMStudioClient } from '@lmstudio/sdk';
import { Models } from './models';
const client = new LMStudioClient();

const model = await client.llm.model(Models.GEMMA_12B);
const result = await model.respond('What is the meaning of life?');
console.info(result.content);
