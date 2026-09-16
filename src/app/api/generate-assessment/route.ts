import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';



export async function POST(request: Request) {
  try {
    const { language } = await request.json();
    const supabase = await createClient();

    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key missing' }, { status: 500 });
    }

    const prompt = `
      You are an expert technical interviewer. Generate a Leetcode-style algorithmic coding challenge.
      The candidate's primary language is ${language || 'JavaScript'}.
      
      Requirements:
      1. The question should be challenging but solvable in 15-30 minutes.
      2. It should test core algorithmic concepts (arrays, strings, hash maps, pointers, etc.).
      3. Provide a clear title, description with examples, and 2 exact test cases.
      
      Respond strictly in the following JSON format:
      {
        "title": "String",
        "description": "String (Include problem statement and examples)",
        "language": "String (lowercase, e.g. javascript, python, typescript)",
        "test_cases": [
          { "input": "String", "expected_output": "String" },
          { "input": "String", "expected_output": "String" }
        ]
      }
    `;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a coding assessment generator. You must respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content generated");
    
    const parsedQuestion = JSON.parse(content);
    
    // Insert into Supabase
    const { data: newQuestion, error } = await supabase.from('questions').insert({
      title: parsedQuestion.title,
      description: parsedQuestion.description,
      language: parsedQuestion.language.toLowerCase(),
      test_cases: parsedQuestion.test_cases,
    }).select().single();

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json({ error: 'Failed to save question' }, { status: 500 });
    }

    return NextResponse.json({ question: newQuestion });

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate assessment' }, { status: 500 });
  }
}
