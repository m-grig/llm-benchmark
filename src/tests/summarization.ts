import type { ChatLike, LLM } from '@lmstudio/sdk';
import { parseJSON } from '../util/parse';

export async function runSummarizationTests(model: LLM) {
  console.log('📝 Running summarization tests...');
  const ebayScore = await testEbayDescriptionSummary(model);
}

async function testEbayDescriptionSummary(model: LLM) {
  console.log('Testing ability to summarize product description detail as JSON');
  const prompt = `Can you summarize this product description?


VeggieTales All The Shows Volume 3 (2005-2010) - 10 Show Collector's Series (5 Disc Set)

Description:
Since 1993, VeggieTales has helped millions of families teach their children timeless lessons from the Bible - all with hilarious storytelling, silly songs and lovable vegetable characters! 

This Volume Three collection, which covers 2005 thru 2010, includes these classic VeggieTales shows:  

- Sheerluck Holmes and the Golden Ruler  
- LarryBoy and the Bad Apple 
- Gideon: Tuba Warrior 
- Moe and the Big Exit 
- Tomato Sawyer & Huckleberry Larry's Big River Rescue 
- Abe and the Amazing Promise 
- Minnesota Cuke & the Search for Noah's Umbrella 
- Saint Nicholas 
- Pistachio 
- Sweetpea Beauty 

As a bonus this also includes 9 Favorite Silly Songs!

Product Info:
This item is brand new and sealed. It is guaranteed to be the official U.S. edition. We source all of our product from reputable U.S. wholesale distributors/vendors and in many cases receive our product directly from the manufacturers. This is something we take very seriously, and we take pride in selling only authentic merchandise.

Shipping:
FREE economy Media Mail shipping will be used with this order. Your order will be carefully and securely packed in a box. We will not ship this in a bubble mailing envelope or in a box that is way too large that could cause damage. We do our best to make sure your order arrives in great shape.

Additional shipping options are available through UPS or the Postal Service for individuals that wish to choose an affordable upgraded shipping service.

Customer Service Questions & Returns:
We read and reply to all questions and concerns and do our best to do so within 24 hours. While it is rare and highly unlikely, mistakes with orders or damage to items may occur. If you have an issue with anything that you have ordered, please contact us first and allow us to address the issue. Much like the pride we take in only selling authentic merchandise, we also take pride in our customer service and will do our best to make sure you are satisfied with your order. 
`;

  const conversation: ChatLike = [{ role: 'user', content: prompt }];

  const firstResponse = await model.respond(prompt);

  conversation.push({ role: 'assistant', content: firstResponse.content });
  conversation.push({ role: 'user', content: 'List the episodes included in this collection as a json array' });

  const secondResponse = await model.respond(conversation);
  const parsedResponse = parseJSON(secondResponse.nonReasoningContent);

  const expectedResult = [
    'Sheerluck Holmes and the Golden Ruler',
    'LarryBoy and the Bad Apple',
    'Gideon: Tuba Warrior',
    'Moe and the Big Exit',
    "Tomato Sawyer & Huckleberry Larry's Big River Rescue",
    'Abe and the Amazing Promise',
    "Minnesota Cuke & the Search for Noah's Umbrella",
    'Saint Nicholas',
    'Pistachio',
    'Sweetpea Beauty',
  ];
  const lowerExpectedResult = expectedResult.map((entry) => entry.toLowerCase());

  // validate result
  const parsedResponseString = JSON.stringify(parsedResponse);
  if (parsedResponseString === JSON.stringify(expectedResult)) {
    console.log('✅ 100% - Perfectly extracted product details as JSON');
    return 100.0;
  } else if (parsedResponseString.toLowerCase() === JSON.stringify(lowerExpectedResult)) {
    console.log('✅ 100% - Successfully extracted product details as JSON, preserving order but not case');
    return 100.0;
  }

  const perfectResults = [];
  const imperfectResults = [];
  for (const entry of parsedResponse) {
    if (expectedResult.includes(entry)) perfectResults.push(entry);
    else if (lowerExpectedResult.includes(entry.toLowerCase())) imperfectResults.push(entry);
  }
  const totalScore = perfectResults.length + imperfectResults.length;
  const percentage = (totalScore / expectedResult.length) * 100;
  const ratio =
    totalScore === perfectResults.length
      ? `${totalScore}/${expectedResult.length} matches`
      : `${totalScore}/${expectedResult.length} matches with ${perfectResults.length} case perfect matches`;
  console.log(`⚠️ ${percentage.toFixed(2)}% - ${ratio}`);
  return percentage;
}
