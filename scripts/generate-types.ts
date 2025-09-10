import { execSync } from 'child_process';

const projectId = 'opukvvmumyegtkukqint';
const outputDir = 'packages/shared/src/database.types.ts';

const command = `npx supabase gen types typescript --project-id ${projectId} --debug > ${outputDir}`;

try {
  console.log(`Generating Supabase types for project ${projectId}...`);
  execSync(command, { stdio: 'inherit' });
  console.log(`Successfully generated types to ${outputDir}`);
} catch (error) {
  console.error('Error generating Supabase types:', error);
  process.exit(1);
}
