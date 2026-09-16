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

    // Mock AI Engine for 100% reliable demos without API keys
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const targetLang = (language || 'JavaScript').toLowerCase();
    
    // Generate a realistic mock question based on the language
    const parsedQuestion = {
      title: `Validating Data Streams in ${language || 'JavaScript'}`,
      description: `You are building a real-time data processing pipeline. Write a function that takes an array of incoming data packets (integers) and returns true if there is any contiguous subarray of length at least 2 that sums up to a multiple of a given integer k. Otherwise, return false.\n\nExample 1:\nInput: nums = [23,2,4,6,7], k = 6\nOutput: true\nExplanation: [2, 4] is a continuous subarray of size 2 whose elements sum up to 6.\n\nExample 2:\nInput: nums = [23,2,6,4,7], k = 13\nOutput: false`,
      language: targetLang,
      test_cases: [
        { input: "[23,2,4,6,7]\n6", expected_output: "true" },
        { input: "[23,2,6,4,7]\n13", expected_output: "false" }
      ]
    };
    
    // Create an admin client to bypass RLS for inserting system-generated questions
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Insert into Supabase using admin client
    const { data: newQuestion, error } = await supabaseAdmin.from('questions').insert({
      title: parsedQuestion.title,
      description: parsedQuestion.description,
      language: parsedQuestion.language.toLowerCase(),
      test_cases: parsedQuestion.test_cases,
    }).select().single();

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json({ error: 'Failed to save question to database: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ question: newQuestion });

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate assessment' }, { status: 500 });
  }
}
