#!/usr/bin/env node
import { program } from 'commander';
import { Coder } from '../lib/code';
import { Config } from '../lib/config';
import { Typer } from '../lib/type';

Config.initConfigFile();
const config = new Config();
const typer = new Typer(config);
const coder = new Coder(config, typer);

program
  .name('gxen')
  .description('CLI to generate code from templates')
  .version('0.0.1');

program.command('init')
  .description('Initialize code template')
  .action(() => {
    config.initGxen();
  });

program.command('type:create')
  .description('Create yaml file for template params')
  .argument('<namespace>', 'namespace')
  .action((name) => {
    typer.create(name);
  });

program.command('code:init')
  .description('Initialize code from type')
  .argument('<type>', 'type')
  .argument('<namespace>', 'name space')
  .action((type, namespace) => {
    coder.create(type, namespace);
  });

program.command('code:generate')
  .description('Generate code from template')
  .argument('<namespace>', 'name space')
  .option('-f, --force', 'force generate code')
  .action((namespace, force) => {
    coder.generate(namespace, force);
  });

program.parse();
