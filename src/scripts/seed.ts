import { createClient } from '@supabase/supabase-js';

// Setup basic dummy data for pitch presentation
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'; // Make sure this UUID format is valid in your auth.users if checking foreign keys

const githubStats = {
  followers: 1254,
  public_repos: 42,
  top_languages: ['TypeScript', 'Python', 'Rust', 'Go'],
  repos: [
    {
      id: 1,
      name: 'smart-portfolio',
      description: 'An AI-powered portfolio builder that syncs with GitHub.',
      html_url: 'https://github.com/demo/smart-portfolio',
      language: 'TypeScript',
      stargazers_count: 532
    },
    {
      id: 2,
      name: 'rust-microservices',
      description: 'High performance microservices architecture built in Rust.',
      html_url: 'https://github.com/demo/rust-microservices',
      language: 'Rust',
      stargazers_count: 310
    },
    {
      id: 3,
      name: 'go-api-gateway',
      description: 'A custom API gateway implementation in Go.',
      html_url: 'https://github.com/demo/go-api-gateway',
      language: 'Go',
      stargazers_count: 154
    },
    {
      id: 4,
      name: 'ml-pipeline',
      description: 'End-to-end machine learning pipeline using Python.',
      html_url: 'https://github.com/demo/ml-pipeline',
      language: 'Python',
      stargazers_count: 89
    }
  ]
};

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Role Key in environment variables.');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Seeding demo profile...');

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: DEMO_USER_ID,
      username: 'johndoe_demo',
      full_name: 'John Doe (Demo)',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      github_stats: githubStats,
    });

  if (error) {
    console.error('Error seeding profile:', error);
  } else {
    console.log('Successfully seeded demo profile!');
    console.log(`Demo Profile User ID: ${DEMO_USER_ID}`);
  }
}

seed();
