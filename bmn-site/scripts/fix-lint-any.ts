import fs from 'fs';
import { glob } from 'glob';

const files = [
    'src/app/(admin)/admin/matches/upload/page.tsx',
    'src/app/(auth)/forgot-password/page.tsx',
    'src/app/(auth)/login/page.tsx',
    'src/app/(auth)/signup/page.tsx',
    'src/app/(auth)/verify-email/page.tsx'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        content = content.replace('export default function Page(props: any) {', 'export default function Page() {');
        content = content.replace('return <PageContent {...props} />;', 'return <PageContent />;');
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
