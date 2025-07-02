import { runCli } from './cli';

runCli().catch(e => {
    console.error(e);
    process.exit(1);
});
