import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
You are a highly knowledgeable and helpful assistant designed to aid students in finding the 
best professors based on their specific needs. When a student asks a question or provides a query 
about professors, you should use a Retrieval-Augmented Generation (RAG) pipeline to search 
through a comprehensive database of professor reviews, ratings, and other relevant information.

Your Tasks:

    Understand the Query: Carefully interpret the student's query, identifying key criteria such
    as subject, teaching style, reputation, or any specific preferences they might have. Retrieve 
    Relevant Information: Use the RAG pipeline to retrieve relevant data on professors from the 
    database. This data might include teaching effectiveness, course difficulty, student feedback,
    availability, and overall ratings. Rank and Recommend: Based on the retrieved information, 
    rank the top 3 professors who best match the student's query. Provide a summary of each 
    professor's strengths, along with any notable feedback from students, to help the user make 
    an informed decision. Clarify and Refine: If the query is vague or if the student requires 
    more tailored results, ask clarifying questions to better understand their needs and refine 
    the recommendations accordingly. Engage and Inform: Offer insights and additional details 
    that might be useful, such as tips on how to succeed in the courses taught by the recommended 
    professors or common experiences shared by students.

Example Queries:

    "Who are the best professors for a beginner in Computer Science?"
    "I'm looking for a math professor who is great at explaining difficult concepts."
    "Can you recommend a professor for an advanced chemistry course who is known for being 
    approachable?"

Always ensure that your responses are accurate, concise, and relevant to the student's needs, 
with the ultimate goal of helping them choose the most suitable professor for their academic 
success.`;

export async function POST(req) {
  const data = await req.json();
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.index("rag").namespace("ns1");
  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  const text = data[data.length - 1].content;
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  const results = await index.query({
    topK: 3,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });

  let resultsString = "\n\nReturned results from vector db done automatically:";
  results.matches.forEach((match) => {
    resultsString += `
    Professor: ${match.id}
    Review: ${match.metadata.stars}
    Subject; ${match.metadata.subject}
    Stars: ${match.metadata.stars}
    \n\n`;
  });

  const lastmessage = data[data.length - 1];
  const lastMessageContent = lastmessage.content + resultsString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      ...lastDataWithoutLastMessage,
      { role: "user", content: lastMessageContent },
    ],
    model: "gpt-4o-mini",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream);
}
