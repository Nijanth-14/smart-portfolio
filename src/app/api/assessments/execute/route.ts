import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { questionId, code } = await request.json();

    if (!questionId || !code) {
      return NextResponse.json({ error: 'Missing questionId or code' }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the question and its test cases
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Since the public Piston API is no longer available, we will execute JavaScript locally
    // in a secure V8 VM context for the purposes of this demo.
    const vm = require('vm');
    let output = '';
    
    try {
      const sandbox = {
        console: {
          log: (...args: any[]) => {
            output += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
          },
          error: (...args: any[]) => {
            output += args.map(a => String(a)).join(' ') + '\n';
          }
        }
      };
      vm.createContext(sandbox);
      const script = new vm.Script(code);
      script.runInContext(sandbox, { timeout: 1000 });
      output = output.trim();
    } catch (err: any) {
      output = err.toString();
    }
    
    const executionResult = { run: { stdout: output, stderr: '' } };
    
    // Simplistic grading: For now, we assume test_cases is an array of objects { input, expected_output }
    // A robust engine would inject inputs into the code. For MVP, we just match stdout against an expected string.
    let status = 'failed';
    const expectedOutput = question.test_cases[0]?.expected_output;
    
    if (expectedOutput && output.includes(expectedOutput)) {
      status = 'passed';
    }

    // Save assessment to DB
    const { error: insertError } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        question_id: questionId,
        status: status,
        code_submitted: code
      });

    if (insertError) {
      console.error('Error saving assessment:', insertError);
      return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      status, 
      output,
      executionResult 
    });

  } catch (error: any) {
    console.error('Execution Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
